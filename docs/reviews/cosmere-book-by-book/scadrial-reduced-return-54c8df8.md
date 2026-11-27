# Scadrial reduced-parent return

Claude · 2026-11-16 UTC · implements the [finite reduced-parent disposition](scadrial-disposition-2026-11-16.md) (ChatGPT, supplied by Mckay in a live session). **The parent is still held. No record visibility changed, nothing was promoted, merged or deployed.**

PR48 `feature/cosmere-reading-state` head **`54c8df8fd3105694ef2c793a1be6926d4e571a99`** (parent: accepted `55e28bd7af1a7b1074f59765982ccee1f922804b`). Not merged.

| Input at 54c8df8 | Git blob |
|---|---|
| `public/atlas/packs/cosmere.js` | `b985c656ef036333c43b649eeff81ecbcabcf936` |
| `public/atlas/engine.js` | `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0` |
| `public/atlas/reading.js` (unchanged) | `4d9bc177294e5e33accf6f19825ef467f0bb90d4` |
| `tests/atlas-scadrial-reduced.test.ts` (new) | `ae5441357e480302578f1bffd768aaa660520d3d` |

## Exact diff (4 files)

**Pack.** Comparing the 55e28bd and 54c8df8 packs in Node, the only Scadrial properties that change are `status`, `gates`, `facts`, `model` (new), `eras.6.status`, `eras.6.facts` and `eras.10.status`. Removing Scadrial from both packs leaves them identical.

| Payload | Before (55e28bd) | After (54c8df8) |
|---|---|---|
| `scadrial.status` | `First planet · the Final Empire` | `The Final Empire` |
| `scadrial.facts` | Order `1st from the sun · no moon`; Shards `Preservation and Ruin`; Magic `Allomancy, Feruchemy, Hemalurgy`; Ruler `The Lord Ruler` | Ruler `The Lord Ruler` only |
| `scadrial.gates.facts` | absent (inherits the bucket fallback) | `{in:["mistborn-the-final-empire"],req:"mistborn-the-final-empire"}`: the same expression already accepted for `blurb`/`short`. Restriction only. Because it is an ancestor field gate, it also applies to `eras[k].facts`. |
| `scadrial.model` (new) | — | `Artist’s model: this surface and the colour of its sun are illustrations made for the atlas, not a verified map or measurement from the books.` |
| `eras[6].status` | `First planet · Harmony’s world · the Elendel Basin` | `Harmony’s world · the Elendel Basin` |
| `eras[6].facts` | Order / Shards `Harmony (Ruin and Preservation)` / Magic / Era | Era `Industrial, about 300 years after Mistborn` only |
| `eras[10].status` | `First planet · Harmony’s world · under threat from outside` | `Harmony’s world · under threat from outside` |

The era changes apply the same removals to the overrides, so no later child can bring back a removed claim. The overrides stay separately held: there are no era gates, no new early permission, and the era blurbs and gfx are unchanged.

**Engine.** I added `modelNote(w)`, which renders an optional world `model` string as `<p class="srcnote model">` under the facts. It goes through the existing `fOk(w,"model",worldChain(w))`: it inherits the world chain, a present-invalid `gates.model` fails closed, and legacy/All show it. It grants no visibility to anything. I added one line to `docs/atlas/PACK_FORMAT.md` §10 documenting it.

**Tests.** `tests/atlas-scadrial-reduced.test.ts` (17 tests) runs the actual engine selectors cut from `engine.js` against the real pack and reading helper.

## The six held fields plus the extra exposures: what this unit did

| Surface | Treatment at 54c8df8 | Fallback when the parent is hidden (per-work) |
|---|---|---|
| `name` | Unchanged. No field gate, no MB01 or public exception. | `An unrevealed world` (dossier, galaxy label); world not selectable |
| `status` | Ordinal removed from the base and both era overrides. Record restrictions unchanged. | empty (no chip) |
| `star` | Object unchanged and still held. Its colour is now covered by the `model` note. No named-star promotion. | Star row omitted |
| `facts` | Reduced to the ruler fact under its own MB01 gate. Era 6 reduced to the Era fact. | omitted |
| `eras` | Not flattened; 6 and 10 stay separately held. Removals applied to base and overrides together. | `eraOn(world,6)` false; status/facts overrides skipped |
| `gfx` | Unchanged. Labelled an artist's model through `model`. No certification of the map or transforms. | Existing barren fallback when `gates.gfx` is denied (unchanged; Scadrial has no `gates.gfx`) |
| `realms.cognitive` | Unchanged and still held. The global `first:4` / subastral `first:7` difference is not resolved. No Secret History assignment. | CBR-04 generic card and look when denied (accepted) |
| `distText`, `map`, group label, neighbours, star colours | Unchanged and still held (see residuals). | — |
| Luthadel (`lat:70`/`lon:0`, `until:6`, gates) | Unchanged. The test asserts the values. | `An unrevealed place`; cannot open the parent |

## Checks at 54c8df8

- `pnpm format`, `pnpm check`: **178/178** unit tests (161 before plus 17 new), check:dist 115 files OK. `pnpm test:pages`: 12 pages × 2 viewports pass.
- [Unit output](scadrial-reduced-unit-54c8df8.txt), **17/17**:
  - Payload and no-threshold-change assertions: record gate absent; books/first/name/group/star/Cognitive/subastral `first:7`/global `first:4`/Luthadel gates and geometry unchanged.
  - All 8 original-trilogy subsets (none selected through MB01+02+03): the parent is visible only for the complete set. When hidden: placeholder name, and no status, facts, blurb, star, model note, `Scadrial` or subastral name. When shown: reduced copy only.
  - Later-era-only (bucket 6 without the trilogy): hidden, and the era-6 child cannot bypass the parent. Trilogy plus bucket 6: reduced era-6 status and facts.
  - Descendants: every Scadrial site and event is hidden for every incomplete subset.
  - Legacy `#book=2/6/10` and All: reduced payloads under the unchanged numeric rule.
  - Fixture-only `gates.model` (unread, invalid, satisfied): fails closed or opens as expected.
- Rendered: [scadrial-reduced-probe.mjs](scadrial-reduced-probe.mjs) (Playwright, swiftshader, built site, real engine and pack, **no fixtures**) at 1440×900 and 390×844. [Head output](scadrial-reduced-rendered-54c8df8.txt): **169/169**. [Negative control at parent 55e28bd](scadrial-reduced-rendered-negative-55e28bd.txt): **125/169**.
  - On the parent, all 44 failures are payload checks in visible states (complete trilogy, trilogy + bucket 6, realm switch, legacy, All). Every hidden-state check passes on both heads, which supports the claim that visibility did not change.
  - States covered: none selected plus the 7 incomplete subsets (not selectable, placeholder label, no removed claim on the page, Luthadel cannot open the parent); complete trilogy in the galaxy and on the surface (status chip `The Final Empire`, facts = Star/Ruler/Distance, model note, clean desktop tooltip); bucket-6-only; trilogy + bucket 6; legacy 2/6/10; All.
  - Realm switching with retained selection: trilogy + The Way of Kings, Physical → Cognitive → Physical. Scadrial stays selected, removed claims are absent in both realms, and the held Cognitive card is unchanged.
  - No page errors in any state.
- Screenshots (complete-trilogy set): [1440 galaxy](shots/scadrial-reduced-galaxy-1440x900.jpg), [1440 surface](shots/scadrial-reduced-surface-1440x900.jpg), [390 galaxy](shots/scadrial-reduced-galaxy-390x844.jpg), [390 surface](shots/scadrial-reduced-surface-390x844.jpg), [390 dossier expanded](shots/scadrial-reduced-dossier-390x844.jpg).
- Not run: `pnpm test:browser`. Its Save/Load wait is the known pre-existing failure, and the strict repair is still under simulator-clarity review. No independent reviewer run is claimed. The builder ran every rendered result above.

## Residual exposures (not changed; for review)

Removing a claim from Scadrial's own status/facts does not remove it from other records. These still carry overlapping content under their own holds:

1. **`distText` (`ORR`):** the Distance row reads “System drawn enlarged; planet order from the system chart”. This is a source statement about order that is visible in the screenshots. Per the disposition, a text-only change cannot close the astronomy hold, so I left it unchanged.
2. **`eras[6].blurb`** names Harmony, Ruin and Preservation (bucket 6; held blurb, unchanged).
3. **Codex `Harmony`** (`first:2`, books 2/6/10): its description reads “Sazed holding both Preservation and Ruin…”. This is a separate codex record and is not covered by this unit.
4. **`scadsun`** (status “Star of the Scadrian system”, the blurb about old/new orbits, facts listing the planets) and **`aagalnod`/`aagaluch`/dwarf planets** (“2nd/3rd from the sun”, `first:7`): neighbouring records that imply the ordinal. Their gates are unchanged.
5. **The `star.col` and `gfx` colours themselves** still drive the sunlight, sprite and galaxy marker. They are now labelled as illustration, not removed.

## Accounting (unchanged)

4/10 listed parent fields narrowed and 6/10 held; 0/2 parent promotions; 2/7 PR48 key-2 events mapped; PR37 ledger 8/148 narrow field candidates and 140 holds; 0/33 full-work approvals. This unit carries out the finite dispositions for status, facts, eras and gfx/star labelling. It does not close any of the six holds.

## Return

implementation/claude → **implementation-review/chatgpt**. ChatGPT inspects the exact 54c8df8 diff and evidence and accepts it or returns a finite correction. The residuals above are its call: hold them, or give them their own dispositions. ChatGPT then continues the individual-work source review. No merge, deploy or release approval.
