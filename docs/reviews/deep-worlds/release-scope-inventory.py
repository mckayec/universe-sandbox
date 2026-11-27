#!/usr/bin/env python3
"""Release-scope inventory for Deep Worlds PR37 at an exact head.

Joins every pack record added/changed/removed by PR37 (merge base vs head) with
the existing review evidence: seven-place ledger (28 selected + 139 unselected),
historical 210-row sample reconciliation, Cosmere supplement crosswalk (23 rows).
Usage: release-scope-inventory.py <dir with base/ and head/ trees (public/atlas/packs/*.js) and sample.csv from a115b69> <deep-worlds docs dir> <out csv>
"""
import csv, json, subprocess, sys, collections, os

S, D, OUT = sys.argv[1:4]
PACKS = ["dune", "foundation", "sun-eater", "cosmere", "expanse", "hyperion"]
LOADER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "release-scope-load.cjs")


def load(rev, pack):
    js = f"process.stdout.write(JSON.stringify(require('{LOADER}')('{S}/{rev}/public/atlas/packs/{pack}.js')))"
    return json.loads(subprocess.check_output(["node", "-e", js]))


def records(p, pack):
    out = {}
    for wi, w in enumerate(p.get("worlds", [])):
        for si, s in enumerate(w.get("sites", []) or []):
            site = {k: v for k, v in s.items() if k != "scene"}
            sc = s.get("scene")
            if sc:
                site["scene"] = {k: v for k, v in sc.items() if k != "landmarks"}
            out[f"{pack}/{w['id']}/{s['id']}"] = ("site", f"worlds[{wi}].sites[{si}]", site)
            for li, l in enumerate((sc or {}).get("landmarks", []) or []):
                out[f"{pack}/{w['id']}/{s['id']}/{l['id']}"] = (
                    "landmark", f"worlds[{wi}].sites[{si}].scene.landmarks[{li}]", l)
    for ei, e in enumerate(p.get("events", [])):
        out[f"{pack}/event/{e['id']}"] = ("event", f"events[{ei}]", e)
    for ci, c in enumerate(p.get("codex", []) or []):
        cid = c.get("id") or c.get("title") or str(ci)
        out[f"{pack}/codex/{cid}"] = ("codex", f"codex[{ci}]", c)
    for wi, w in enumerate(p.get("worlds", [])):
        wl = {k: v for k, v in w.items() if k != "sites"}
        out[f"{pack}/world/{w['id']}"] = ("world", f"worlds[{wi}]", wl)
    return out


def text_of(kind, o):
    if kind == "event":
        return (o.get("title", "") + " — " + o.get("text", "")).strip(" —")
    if kind in ("landmark", "site"):
        return o.get("desc", "") or ""
    return json.dumps(o, ensure_ascii=False)[:160]


led = json.load(open(os.path.join(D, "seven-place-ledger-2026-11-07.json")))
ledger_sel = {r["identity"]: r for r in led["records"]}
ledger_uns = {}
for g in led["groups"]:
    for i in g["unselected"]:
        ledger_uns[i] = g["name"]
hist = {}
for r in csv.DictReader(open(os.path.join(S, "sample.csv"))):
    if r["kind"] == "event":
        ident = f"{r['pack']}/event/{r['object_id']}"
    else:
        ident = f"{r['pack']}/{r['historical_world']}/{r['historical_site']}/{r['object_id']}"
    hist[ident] = r
cross = {}
for r in csv.DictReader(open(os.path.join(D, "cosmere-supplement-crosswalk.csv"))):
    if r["kind"] == "event":
        cross[f"cosmere/event/{r['object_id']}"] = r
    else:
        cross[f"cosmere/{r['world']}/{r['site']}/{r['object_id']}"] = r

ACCEPT_LEDGER = {"narrow", "retain"}
QUAL_LEDGER = {"narrow-commentary"}
ACCEPT_CROSS = {"supported-text", "accepted-return-carried", "clarification-carried"}
QUAL_CROSS = {"partial-primary", "commentary-assisted"}

rows = []
for pack in PACKS:
    b, h = records(load("base", pack), pack), records(load("head", pack), pack)
    for ident in sorted(set(b) | set(h)):
        kind, sel, o = h.get(ident) or b.get(ident)
        if ident in b and ident in h:
            change = "unchanged" if b[ident][2] == h[ident][2] else "changed"
        elif ident in h:
            change = "added"
        else:
            change = "removed"
        if change == "unchanged":
            continue
        fields = ""
        if change == "changed":
            bo, ho = b[ident][2], h[ident][2]
            fields = ",".join(sorted(k for k in set(bo) | set(ho) if bo.get(k) != ho.get(k)))
        evid, cls = [], None
        if ident in ledger_sel:
            d = ledger_sel[ident]["disposition"]
            evid.append(f"ledger {ledger_sel[ident]['review_id']} {d}")
            if change == "removed" or ident not in h:
                cls = "O"
            elif d in ACCEPT_LEDGER:
                cls = "A"
            elif d in QUAL_LEDGER:
                cls = "Q"
        if ident in cross:
            v = cross[ident]["current_verdict"]
            evid.append(f"crosswalk {cross[ident]['supplement_id']} {v}")
            if cls is None and ident in h:
                cls = "A" if v in ACCEPT_CROSS else ("Q" if v in QUAL_CROSS else None)
        if ident in hist:
            hp = hist[ident]["historical_primary_comparison"]
            evid.append(f"sample {hist[ident]['sample_id']} {hp}")
            if cls is None and ident in h and hp != "not-compared":
                cls = "Q" if hp == "partial-or-corrective" else "A"
        if ident in ledger_uns:
            evid.append(f"ledger-unselected {ledger_uns[ident]}")
        if cls is None:
            cls = "O" if change == "removed" else "U"
        rows.append({
            "identity": ident, "pack": pack, "kind": kind, "selector_at_head": sel if ident in h else "",
            "change_vs_base": change, "changed_fields": fields, "class": cls, "evidence": "; ".join(evid),
            "head_text": text_of(kind, h[ident][2]) if ident in h else "",
            "books": json.dumps((h.get(ident) or b.get(ident))[2].get("books", (h.get(ident) or b.get(ident))[2].get("book"))),
        })

with open(OUT, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

c = collections.Counter((r["pack"], r["kind"], r["change_vs_base"], r["class"]) for r in rows)
print("rows", len(rows))
summary = collections.defaultdict(collections.Counter)
for r in rows:
    summary[(r["pack"], r["kind"])][r["change_vs_base"] + ":" + r["class"]] += 1
fc = collections.Counter((r["kind"], r["changed_fields"]) for r in rows if r["change_vs_base"] == "changed")
for k, v in fc.most_common(25):
    print("  fields", k, v)
for k in sorted(summary):
    print(k, dict(summary[k]))
print("classes", collections.Counter(r["class"] for r in rows))
# 139 reconciliation
present = {r["identity"]: r for r in rows}
uns = collections.Counter()
for i, g in ledger_uns.items():
    if i in present:
        uns[present[i]["class"] + "/" + present[i]["change_vs_base"]] += 1
    else:
        uns["absent-or-unchanged-vs-base"] += 1
print("139:", dict(uns))
missing = [i for i in ledger_uns if i not in present]
print("139 not in delta:", missing[:20])
print("ledger selected:", collections.Counter((present[i]["class"] if i in present else "not-in-delta") for i in ledger_sel))
