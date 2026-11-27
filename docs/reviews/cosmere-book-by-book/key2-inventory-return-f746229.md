# Key-2 mapping continuation — exact-head inventory and reconciliation (PR48 f746229)

Claude, 2026-11-10 UTC. Picks up the key-2 continuation from [implementation-review-b965d17.md](implementation-review-b965d17.md). Draft PR #48 `feature/cosmere-reading-state` is now **f74622957d0a889001598b3a4ad874181da75763** (parents 2f1bc8e, b965d17): two docs-only commits that document CBR-O1 in PACK_FORMAT. Application code is byte-identical to the accepted b965d17 (`git diff --stat b965d17 f746229` = `docs/atlas/PACK_FORMAT.md | 4 +`).

**Result: inventory and reconciliation done; 0 real mappings applied; the next unit needs ChatGPT's mapping research (bibliography for every bucket + the key-2 packet below).** No merge, deploy or release claim.

## 1. Branch reconciliation (cosmere.js)

| Head | Commit | cosmere.js blob | Relation |
|---|---|---|---|
| main | 6fb8943 (docs-only tip) | 0ca2f3eedf23bd6b453240c3e047e8c50671e5d2 | baseline |
| PR48 | b965d17 / f746229 | 0ca2f3eedf23bd6b453240c3e047e8c50671e5d2 | identical to main (older pack, as the review noted) |
| PR24 lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 | +13/−14 lines vs main (L-corrections; e.g. e12 copy, `books[2].y` "2006–2008") |
| PR37 deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 | +700/−63 vs PR24's merge base (Elantris fixes, scenes/landmarks, more events). **Same blob as the 08d10e1 snapshot used by mapping-checkpoint-2026-11-09.md.** |

- `git merge-tree --write-tree 03394c3 cf25cda` **conflicts** in cosmere.js (and four other packs/docs). PR24 awaits Mckay's merge (D09); PR37 is Mckay-blocked on D10.
- Decision for PR48: **do not import either branch's pack content now.** PR48 applied no record edits, so nothing newer is overwritten. Real gates will be authored as additive `gate`/`gates` fields on whichever pack is on main when the mapping unit lands (PR24 first if Mckay merges it; PR37's content after D10). The research denominator below uses PR37 03394c3 because it is the superset and matches ChatGPT's checkpoint blob.
- Content differences that matter for key-2 mapping: e12 copy differs (main/PR48 "remakes the world, ending the ash and the mists"; PR24/PR37 "restores the world, clearing the ash"; checkpoint's narrow copy "Sazed ascends and remakes the world"). **e7 "The survivor of Hathsin" exists on main/PR24 but not on PR37** (PR37 has e74 at hathsin/pits instead). PR37 adds 7 key-2 events, 23 key-2 landmarks and 3 codex entries.

## 2. Key-2 exposure inventory (records whose first numeric key is 2)

Probe: [key2-exposure-inventory.cjs](key2-exposure-inventory.cjs) (Node VM, source inventory only). Raw outputs: [b965d17](key2-inventory-b965d17.json), [cf25cda](key2-inventory-cf25cda.json), [03394c3](key2-inventory-03394c3.json).

| Surface | main = PR48 | PR24 | PR37 | Ancestors |
|---|---:|---:|---:|---|
| Worlds | 2 (scadsun, scadrial) | 2 | 2 | group scadrian (ungated public container) |
| World text fields | scadsun: name, status, star, blurb, short, facts, gfx; scadrial: same + eras | same | same | world |
| World/group era overrides keyed 2 | 0 | 0 | 0 | — |
| Sites | 17 | 17 | 17 | scadrial |
| Landmarks | 0 | 0 | 23 | scadrial → site |
| Events | 7 | 7 | 14 | scadrial → site → landmark |
| Codex entries | 6 | 6 | 9 | codex section |
| Realm/subastral entries, worldhop links | 0 / 0 | 0 / 0 | 0 / 0 | — |
| Earlier worlds carrying key 2 in `books` | 0 | 0 | 0 | — |

PR37 lists: sites luthadel, kredikshaw, well, fellise, hathsin, homeland, arguois, tyrian, urteau, tremredare, fadrex, statlin, conventical, vetitan, lekal, tathingdwen, islands. Landmarks luthadel/{fountain, venture, hasting, assembly, walls, channerel}, kredikshaw/{spires, throne, murals}, well/pool, fellise/renoux, hathsin/{pits, refuge}, homeland/{trustwarren, prison}, arguois/caves, urteau/{canals, cache, burnings}, fadrex/{rocks, orielle, cache}, conventical/plate. Events e6, e68, e69, e8, e9, e70, e71, e10, e72, e73, e11, e74, e75, e12 (ancestors in the JSON). Codex shards/{Preservation, Ruin, Harmony}, people/{Kelsier (more), Vin, Sazed (more), Elend Venture, Spook}, ideas/The metal arts. Codex `more` lines on these entries are keyed to later books and are separate field units.

**Denominator for the key-2 packet (PR37 superset): 2 worlds (15 field units incl. gfx), 17 sites, 23 landmarks, 14 events, 9 codex entries.** Checked against sources so far: 3/3 trilogy bibliography rows and 1/14 events (e12, narrow copy). Every other unit is unreviewed.

## 3. Why no real mapping was applied in this unit

1. **A partial registry hides everything else.** In `reading.js` (`recordGate`, line ~166) a record without `gate` falls back to its numeric bucket only if that bucket has works; a bucket with no works is invalid, so the record is hidden in every per-work mode. The pack uses keys 1–12. Shipping `spoilers.works` with only MB01–MB03 would make all key-1 and key-3..12 content invisible in preset/set modes. The handoff also keeps legacy as production behaviour until the real registry is reviewed. So the registry can only ship once **every bucket 1–12 has verified work rows** (33 ledger rows in audit-2026-11-06.md; 3 verified).
2. **e12 cannot be promoted alone.** Its ancestor scadrial has no gate (bucket fallback), and the review forbids making the ancestor public to expose the child. e12's narrow copy also differs per head (§1), so the copy edit belongs to whichever pack lands.

## 4. Requested from ChatGPT (bounded research, not open-ended)

- **R-A Bibliography for all buckets:** for each of the 33 ledger rows, a permanent work id, title, publication year and numeric bucket (author bibliography/books index is enough — bibliographic routing only), with explicit holds where membership is unclear (FD01 Fires of December, TA04 omnibus, AU01 essays, MB09 Secret History in bucket 7). This alone lets the registry ship with every record as "unreviewed bucket fallback", which matches today's legacy visibility.
- **R-B Key-2 packet** over the §2 denominator: per record and per field, a gate (`req`/`needs` over MB01–MB03) or an explicit hold, with the parent-first rule (world/sites before events/landmarks). Name which of e7 (main/PR24) vs e74 (PR37) to map.
- Optional alternative for Mckay/ChatGPT, not implemented: let buckets with no works fall back to legacy numeric visibility. That would weaken the accepted fail-closed design, so Claude has not done it.

Claude will apply R-A as soon as it arrives (registry + presets + tests + rendered checks), then R-B.

## 5. CBR-O1

Documented in PR48 PACK_FORMAT (f746229): group `crumb.label`, `ui` strings, `books[k].title` and other configuration labels are never gated and must be public-only. Inventory: **0 `crumb` overrides** in all three Cosmere heads. Cosmere's `ui.allTitle` ("Everything through The Fires of December, with spoilers") and book titles are bibliographic, not plot.

## Checks

Docs-only on PR48 (no app change), so no new build/browser run; b965d17 CI evidence still applies to the identical app tree. Probe ran on all three heads (outputs above). Not run: rendered checks (nothing rendered changed).
