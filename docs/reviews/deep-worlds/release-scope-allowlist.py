#!/usr/bin/env python3
"""Deep Worlds R1 field-level allowlist and virtual construction check (RS1-RS4 of
release-scope-review-03394c3.md).

Packaging of existing acceptance records only: no new source reading, no application edit.
Every allowlisted leaf names its accepted value, the acceptance record and the fields that
remain unresolved (model/geometry/labels). The script then builds R1 virtually on the
PR24-integrated baseline (cf25cda pack files; main + accepted lore corrections) and checks
dependency closure.

Usage: release-scope-allowlist.py <dir with base/ head/ pr24/ pack .js files and load.cjs>
       <deep-worlds docs dir> <out csv> <out txt>
"""
import copy, csv, json, os, re, subprocess, sys

S, D, OUT_CSV, OUT_TXT = sys.argv[1:5]
PACKS = ["dune", "foundation", "sun-eater", "cosmere", "expanse", "hyperion"]


def load(rev, pack):
    js = (f"process.stdout.write(JSON.stringify(require('{S}/load.cjs')"
          f"('{S}/{rev}/{pack}.js')))")
    return json.loads(subprocess.check_output(["node", "-e", js]))


P = {rev: {pk: load(rev, pk) for pk in PACKS} for rev in ("base", "head", "pr24")}


def find(pack, ident):
    """Return the live object for an identity (pack/world/site[/lm], pack/event/id,
    pack/world/<id>, pack/codex/<id>)."""
    parts = ident.split("/")
    if parts[1] == "event":
        return next((e for e in pack.get("events", []) if e["id"] == parts[2]), None)
    if parts[1] == "codex":
        return next((c for c in pack.get("codex", []) if c.get("id") == parts[2]), None)
    if parts[1] == "world":
        return next((w for w in pack["worlds"] if w["id"] == parts[2]), None)
    w = next((w for w in pack["worlds"] if w["id"] == parts[1]), None)
    s = next((s for s in (w or {}).get("sites", []) or [] if s["id"] == parts[2]), None)
    if len(parts) == 3 or s is None:
        return s
    return next((l for l in ((s.get("scene") or {}).get("landmarks") or []) if l["id"] == parts[3]), None)


def get(rev, ident):
    return find(P[rev][ident.split("/")[0]], ident)


led = {r["review_id"]: r for r in json.load(open(os.path.join(D, "seven-place-ledger-2026-11-07.json")))["records"]}
cw = {r["supplement_id"]: r for r in csv.DictReader(open(os.path.join(D, "cosmere-supplement-crosswalk.csv")))}


def led_after(sp, field):
    r = led[sp]
    for c in r["proposed_leaf_changes"]:
        if c["field"] == field:
            return None if c.get("remove") else c["after"]
    return r["current_text"]  # scoped retain: the retained prose itself


def cw_value(cs):
    r = cw[cs]
    m = re.search(r"(?:replacement|Carry exact optional replacement): (.+)$", r["disposition"])
    return m.group(1).strip() if m else r["current_text"]


EL = "../cosmere-book-by-book/implementation-review-ffc8ba7.md (Elantris return accepted)"
SEVEN = "seven-place-review-2026-11-07.md"
SUPP = "supplement-review-60176e7.md / implementation-review-232fef1.md (crosswalk returns)"
LM_UNRES = "name, kind, at, h, books/first gates, col (model/label; not covered by the prose approval)"
EV_UNRES_ADDED = "title, book gate, world/site placement (not covered by the text approval)"

# kind, identity, field, op, accepted value (None = take from source column), source, record, evidence class, unresolved, decision
ROWS = []


def row(identity, field, op, value, source, record, evclass, unresolved, decision, note=""):
    ROWS.append(dict(identity=identity, field=field, op=op, accepted_value=value, source=source,
                     acceptance_record=record, evidence_class=evclass, unresolved_fields=unresolved,
                     r1_decision=decision, note=note))


# --- 14 A landmarks (RS1: hotel/tower out) -------------------------------------------------
LM = [
    ("dune/arrakis/arrakeen/residency", "SP01", None),
    ("foundation/trantor/commission/court", "SP06", None),
    ("sun-eater/delos/devilsrest/bluff", "SP17", None),
    ("sun-eater/delos/devilsrest/study", "SP18", None),
    ("cosmere/scadrial/luthadel/venture", "SP21", None),
    ("cosmere/scadrial/luthadel/walls", "SP22", None),
    ("cosmere/roshar/kholinar/palace", "SP25", "CS01"),
    ("cosmere/roshar/kholinar/windblades", "SP26", None),
    ("cosmere/scadrial/luthadel/channerel", None, "CS03"),
    ("cosmere/nalthis/ttelir/docks", None, "CS09"),
    ("cosmere/nalthis/ttelir/wall", None, "CS10"),
    ("cosmere/nalthis/courtofgods/arena", None, "CS13"),
    ("cosmere/nalthis/courtofgods/lawn", None, "CS14"),
    ("cosmere/nalthis/courtofgods/enclave", None, "CS15"),
]
for ident, sp, cs in LM:
    if sp:
        val, src = led_after(sp, "desc"), f"ledger {sp} {led[sp]['disposition']}"
        rec, evc = SEVEN, led[sp]["evidence_class"]
        if cs:
            src += f"; crosswalk {cs} {cw[cs]['current_verdict']} (optional conservative replacement)"
    else:
        val, src = cw_value(cs), f"crosswalk {cs} {cw[cs]['current_verdict']}"
        rec, evc = SUPP, cw[cs]["evidence"][:60]
    unres = LM_UNRES + ("; modeled river course not certified (crosswalk geometry)" if cs == "CS03" else "")
    row(ident, "desc", "add-landmark", val, src, rec, evc, unres, "include (prose leaf only)")

row("foundation/trantor/hotel/tower", "desc", "omit", None, "ledger SP05 narrow", SEVEN,
    "authorized_translation_narrative", "host site hotel absent on main", "exclude",
    "RS1 option (a): host site is PR37-added (U); no relocation")

# --- events ----------------------------------------------------------------------------------
EV = [
    ("foundation/event/f1b", "text", "SP08", None, None),
    ("sun-eater/event/b1b", "text", "SP19", None, None),
    ("cosmere/event/e9", "text", "SP23", None, None),
    ("cosmere/event/e9", "title", "SP23", None, None),
    ("cosmere/event/e17", "text", "SP27", None, None),
    ("cosmere/event/e6", "text", None, "CS05", None),
    ("cosmere/event/e15", "text", None, "CS21", None),
    ("cosmere/event/e16", "text", None, "CS23", None),
]
for ident, field, sp, cs, _ in EV:
    if sp:
        row(ident, field, "set", led_after(sp, field), f"ledger {sp} {led[sp]['disposition']}", SEVEN,
            led[sp]["evidence_class"], "lm link (not in accepted leaf)", "include")
    else:
        row(ident, field, "set", cw_value(cs), f"crosswalk {cs} {cw[cs]['current_verdict']}", SUPP,
            cw[cs]["evidence"][:60], "lm link (not in accepted leaf)", "include")
row("cosmere/event/e6", "title", "set", "Kelsier meets Vin", "crosswalk CS05 accepted-return-carried (title carried with returned text)",
    SUPP, "returned text", "none", "include", "title accepted with the CS05 return; flag if ChatGPT reads CS05 as text-only")
row("cosmere/event/e13", "text", "set", "Siri of Idris arrives at the Court of Gods to marry the God King of Hallandren.",
    "implementation-review-ffc8ba7.md CS18/e13 accepted (supersedes CS18 partial-primary join)",
    "implementation-review-ffc8ba7.md", "Chapter-4 scope comparison", "lm palace (target is Q, excluded)", "include (RS3)")
# Elantris return (EL01-05, EL08 A-E): U in the 03394c3 classifier but accepted corrections of main records
EL_ROWS = [
    ("cosmere/event/e2", "text", "set", "EL05"),
    ("cosmere/event/e4", "text", "set", "EL03"),
    ("cosmere/event/e4", "site", "remove", "EL03"),
    ("cosmere/event/e5", "text", "set", "EL04"),
    ("cosmere/sel/elantris", "desc", "set", "EL01"),
    ("cosmere/sel/widor", "desc", "set", "EL02"),
    ("cosmere/sel/pool", "name", "set", "EL08-C"),
    ("cosmere/sel/pool", "desc", "set", "EL08-C"),
    ("cosmere/world/sel", "status", "set", "EL08-A"),
    ("cosmere/world/sel", "facts", "remove-entry:Order", "EL08-A"),
    ("cosmere/world/sel", "realms", "remove", "EL08-B"),
    ("cosmere/codex/shards", "list", "remove-entry:Adonalsium", "EL08-E"),
    ("cosmere/codex/shards", "list", "remove-entry:Devotion and Dominion", "EL08-D"),
]
for ident, field, op, el in EL_ROWS:
    row(ident, field, op, None, f"Elantris {el}", EL, "handoff-elantris-2026-11-07 sources",
        "remaining Sel prose/geography unaudited (EL08 limits)", "include (RS3 Elantris reconciliation)")

# A-classified rows that carry no accepted changed leaf, or excluded by RS1/RS3
row("foundation/event/f1a2", "*", "omit", None, "ledger SP07 retain", SEVEN, "authorized_translation_narrative",
    "site hotel / lm tower absent in R1", "exclude", "RS1: added event depends on PR37-added hotel site")
row("cosmere/event/e1", "lm", "keep-main", None, "historical SM46 narrative-supported (text, unchanged); EL06 retain",
    EL, "text only", "lm gate targets U landmark", "exclude change", "only changed leaf is lm:gate, not an accepted leaf")
for ident, rec, note in [
    ("sun-eater/event/b1k", "ledger SP20 narrow", "added event: accepted text leaf; title/gate/site unresolved"),
    ("cosmere/event/e77", "crosswalk CS20 accepted-return-carried", "added event: returned text; title/gate/site unresolved"),
    ("cosmere/event/e78", "crosswalk CS22 accepted-return-carried", "added event: returned composite; title/gate/site unresolved"),
]:
    row(ident, "text", "add-event", None, rec, SEVEN if "SP" in rec else SUPP, "see source", EV_UNRES_ADDED,
        "ChatGPT choice (default exclude)", note)
for ident, rec in [("cosmere/event/e70", "ledger SP24 narrow-commentary"), ("cosmere/event/e102", "ledger SP28 narrow-commentary")]:
    row(ident, "*", "omit", None, rec, SEVEN, "commentary_or_short_quote_only", EV_UNRES_ADDED, "exclude",
        "RS3: accepted conservative wording with weaker evidence, not rejected; wording/anchor-removal binding if later included")
for ident, rec in [("dune/event/d1", "historical SM30 partial-or-corrective"), ("cosmere/event/e35", "historical SM199 partial-or-corrective")]:
    row(ident, "text", "keep-main", None, rec, "none found", "historical sample label only", "head narrowing", "undecided",
        "no acceptance record located for the head narrowing; R1 keeps main text; no revert of an accepted correction")
for lm in ["dune/caladan/castle/keep", "foundation/trantor/hotel/terminal", "sun-eater/delos/devilsrest/castle",
           "cosmere/nalthis/courtofgods/palace", "cosmere/nalthis/courtofgods/palaces", "cosmere/nalthis/courtofgods/tunnels",
           "cosmere/nalthis/denir/statues", "cosmere/nalthis/ttelir/highlands", "cosmere/nalthis/ttelir/markets",
           "cosmere/roshar/yeddaw/gate"]:
    row(lm, "*", "omit", None, "Q landmark", "release-scope-review-03394c3.md RS3", "-", "-", "exclude", "Q landmarks out")
row("sun-eater/event/b1p", "*", "omit", None, "historical SM06 partial-or-corrective (Q added)", "-", "-", EV_UNRES_ADDED,
    "exclude", "Q added event outside the slice; not rejected")

# --- 10/10 O provenance (RS4) --------------------------------------------------------------
O = [
    ("sun-eater/event/b7c", "lore-corrections L1/IR1 (PR24 commit 6ce5fc5: Auctor unmapped, kept as book-VII codex text); PR24 approved head, D07", "already absent in PR24 baseline cf25cda"),
    ("cosmere/event/e7", "implementation-review-232fef1.md: CS02/CS06 omitted 2/2 as requested (supplement-review-60176e7 CS06 conservative omit)", "no other references in pack (fix-return-232fef1)"),
    ("expanse/event/b3f", "canon-disposition-5bfde31.md hold SP11 (ledger SP15) -> accepted omission-review-c8159ae.md 14/14", "closure with drumring landmark (PR37-added) and dependent b3i"),
    ("expanse/event/b3i", "canon-disposition-5bfde31.md SP09 dependency -> omission-review-c8159ae.md 14/14", "dependent of b3f/drumring"),
    ("expanse/event/b7d", "canon-disposition-5bfde31.md SP10 dependency -> omission-review-c8159ae.md 14/14", "dependent of b3o (PR37-added)/engineering"),
    ("hyperion/event/b1n", "canon-disposition-5bfde31.md SP15 (ledger SP11) -> omission-review-c8159ae.md 14/14", "-"),
    ("hyperion/event/b2b", "canon-disposition-5bfde31.md SP16 (ledger SP12) -> omission-review-c8159ae.md 14/14", "-"),
    ("hyperion/event/b2k", "canon-disposition-5bfde31.md SP13 site dependency -> omission-review-c8159ae.md 14/14", "dependent of hyperion/sphinx site"),
    ("hyperion/event/b3b", "canon-disposition-5bfde31.md SP13 site dependency -> omission-review-c8159ae.md 14/14", "dependent of hyperion/sphinx site"),
    ("hyperion/hyperion/sphinx", "canon-disposition-5bfde31.md SP13 (duplicate Sphinx site with nested scene) -> omission-review-c8159ae.md 14/14", "site; dependents b1i2 (PR37-added), b2k, b3b"),
]
for ident, rec, closure in O:
    row(ident, "*", "omit-record", None, "O (absent at head)", rec, "editorial omission, not a falsity claim", closure, "include omission")

# --- construction -----------------------------------------------------------------------------
R1 = copy.deepcopy(P["pr24"])
log, fails = [], []


def ensure_scene_models():
    """Copy each head scene model object (no landmarks) onto sites that exist in the baseline."""
    n = 0
    for pk in PACKS:
        for w in R1[pk]["worlds"]:
            hw = next((x for x in P["head"][pk]["worlds"] if x["id"] == w["id"]), None)
            for s in w.get("sites", []) or []:
                hs = next((x for x in (hw or {}).get("sites", []) or [] if x["id"] == s["id"]), None)
                if hs and hs.get("scene"):
                    s["scene"] = {k: v for k, v in hs["scene"].items() if k != "landmarks"}
                    s["scene"]["landmarks"] = []
                    n += 1
    return n


nscenes = ensure_scene_models()
for r in ROWS:
    ident, pk = r["identity"], r["identity"].split("/")[0]
    head_obj, base_obj = get("head", ident), get("base", ident)
    f = r["field"]
    hv = head_obj.get(f) if (head_obj is not None and f not in ("*",)) else None
    if r["accepted_value"] is None and r["op"] in ("set",):
        r["accepted_value"] = hv
    r["head_value"] = json.dumps(hv, ensure_ascii=False)[:300] if f != "*" else ("present" if head_obj else "absent")
    r["main_value"] = json.dumps(base_obj.get(f) if (base_obj and f != "*") else None, ensure_ascii=False)[:300] if f != "*" else ("present" if base_obj else "absent")
    if r["op"] == "set" or r["op"] == "add-landmark":
        r["leaf_matches_head"] = str(hv == r["accepted_value"])
        if hv != r["accepted_value"]:
            fails.append(f"value mismatch {ident}.{f}")
    elif r["op"] == "remove":
        r["leaf_matches_head"] = str(hv is None)
    elif r["op"].startswith("remove-entry:"):
        key = r["op"].split(":", 1)[1]
        inhead = any((x[0] if isinstance(x, list) else x.get("name")) == key for x in (hv or []))
        r["leaf_matches_head"] = str(not inhead)
    elif r["op"] == "omit-record":
        r["leaf_matches_head"] = str(head_obj is None)
    else:
        r["leaf_matches_head"] = "n/a"
    if not r["r1_decision"].startswith("include"):
        continue
    tgt = find(R1[pk], ident) if r["op"] != "add-landmark" else None
    if r["op"] == "add-landmark":
        parts = ident.split("/")
        site = find(R1[pk], "/".join(parts[:3]))
        if site is None:
            fails.append(f"host site missing in baseline: {ident}")
            continue
        site.setdefault("scene", {"landmarks": []}).setdefault("landmarks", []).append(copy.deepcopy(head_obj))
    elif r["op"] == "set":
        tgt[f] = r["accepted_value"]
    elif r["op"] == "remove":
        tgt.pop(f, None)
    elif r["op"].startswith("remove-entry:"):
        key = r["op"].split(":", 1)[1]
        tgt[f] = [x for x in tgt[f] if (x[0] if isinstance(x, list) else x.get("name")) != key]
    elif r["op"] == "omit-record":
        parts = ident.split("/")
        if parts[1] == "event":
            R1[pk]["events"] = [e for e in R1[pk]["events"] if e["id"] != parts[2]]
        else:
            w = next(w for w in R1[pk]["worlds"] if w["id"] == parts[1])
            w["sites"] = [s for s in w["sites"] if s["id"] != parts[2]]

# dependency closure on the constructed result
refs = dangling = 0
lm_in = {}
for pk in PACKS:
    worlds = {w["id"]: w for w in R1[pk]["worlds"]}
    for e in R1[pk]["events"]:
        w = worlds.get(e.get("world"))
        if e.get("site"):
            refs += 1
            s = next((s for s in (w or {}).get("sites", []) or [] if s["id"] == e["site"]), None)
            if s is None:
                dangling += 1; fails.append(f"dangling site {pk}/event/{e['id']} -> {e['site']}")
            if e.get("lm"):
                refs += 1
                ids = [l["id"] for l in ((s or {}).get("scene") or {}).get("landmarks", [])]
                if e["lm"] not in ids:
                    dangling += 1; fails.append(f"dangling lm {pk}/event/{e['id']} -> {e['site']}/{e['lm']}")
                else:
                    lm_in.setdefault(f"{pk}/{e['world']}/{e['site']}/{e['lm']}", []).append(e["id"])
        elif e.get("lm"):
            dangling += 1; fails.append(f"lm without site {pk}/event/{e['id']}")

# incoming references to omitted ids anywhere in the constructed R1 pack (tours/routes/keys)
omit_refs = {}
for ident, _, _ in O:
    pk, key = ident.split("/")[0], ident.split("/")[-1]
    txt = json.dumps(R1[pk], ensure_ascii=False)
    n = len(re.findall(r'"' + re.escape(key) + r'"', txt))
    omit_refs[ident] = n

# leaf-level difference of R1 vs head for included records, and empty-scene count
empty = sum(1 for pk in PACKS for w in R1[pk]["worlds"] for s in w.get("sites", []) or []
            if s.get("scene") and not s["scene"].get("landmarks"))
lms = sum(len((s.get("scene") or {}).get("landmarks", [])) for pk in PACKS for w in R1[pk]["worlds"] for s in w.get("sites", []) or [])

with open(OUT_CSV, "w", newline="", encoding="utf8") as fh:
    cols = ["identity", "field", "op", "r1_decision", "accepted_value", "head_value", "main_value", "leaf_matches_head",
            "source", "acceptance_record", "evidence_class", "unresolved_fields", "note"]
    wr = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
    wr.writeheader()
    for r in ROWS:
        r["accepted_value"] = r["accepted_value"] if isinstance(r["accepted_value"], str) or r["accepted_value"] is None else json.dumps(r["accepted_value"], ensure_ascii=False)
        wr.writerow(r)

with open(OUT_TXT, "w", encoding="utf8") as fh:
    def p(*a):
        print(*a, file=fh)
    p("allowlist rows:", len(ROWS))
    from collections import Counter
    p("decisions:", dict(Counter(r["r1_decision"] for r in ROWS)))
    p("included set/add leaves matching head:", sum(1 for r in ROWS if r["r1_decision"].startswith("include") and r["leaf_matches_head"] == "True"),
      "/", sum(1 for r in ROWS if r["r1_decision"].startswith("include")))
    p("scene model objects copied onto baseline sites:", nscenes, "; landmarks in R1:", lms, "; scenes with 0 landmarks:", empty)
    p("event site/lm references checked:", refs, "; dangling:", dangling)
    p("included landmarks with incoming event lm links:", json.dumps(lm_in))
    p("omitted ids: quoted occurrences remaining in constructed R1 packs (0 = no incoming refs):", json.dumps(omit_refs))
    p("failures:", len(fails))
    for x in fails:
        p("  ", x)
print(open(OUT_TXT).read())
