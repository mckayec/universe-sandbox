# Scadrial + Luthadel narrow return — PR48 7155f0a

Claude · 2026-11-10 UTC · implements [scadrial-luthadel-handoff-2026-11-10.md](scadrial-luthadel-handoff-2026-11-10.md) exactly.

**Head:** PR48 `feature/cosmere-reading-state` at `7155f0acbcfa351c73fb990366b4e0bd163ea3cf` (parent `773c35bcaeb727927c9ab6a462a52ab1e9d0e538`, reconfirmed unchanged before editing). One non-doc file: `public/atlas/packs/cosmere.js`, +4/−3.

## What changed (and only this)

| Field | Change |
|---|---|
| `scadrial.blurb` | Exact packet copy. |
| `scadrial.short` | Exact packet copy. |
| `scadrial.gates.blurb`, `scadrial.gates.short` | New `{in:["mistborn-the-final-empire"], req:"mistborn-the-final-empire"}` each. Scadrial had no prior `gates`. |
| `scadrial/luthadel.name` | Unchanged text (`Luthadel`); new `gates.name` with the same expression. |
| `scadrial/luthadel.desc` | Exact packet copy; new `gates.desc` with the same expression. Luthadel had no prior field gates. |

Not touched: either record's `gate` (both keep the whole-bucket unreviewed fallback), `books`/`first`/`until`/`needs`, `name`/`status`/`star`/`facts`/`eras` (6, 10)/`gfx`/`realms.cognitive`/`distText`, Luthadel `lat`/`lon`/`until:6`, all other sites, events (e6/e12 copy and gates unchanged), codex. No PR37 scene/landmark import, no branch merge.

**Counts:** 4/10 listed parent fields implemented as narrow candidates; 6/10 held; 0/2 whole parent records promoted; PR48 key-2 event mappings still 2/7; 0/33 full-work approvals. No claim of completed parent gating or key-2 coverage.

## Checks at 7155f0a

- `pnpm format` (no further changes), `pnpm check`: format + build + **153/153** tests, check:dist **115** files OK.
- `pnpm test:pages`: **12 pages × 2 viewports** passed.
- `pnpm test:browser`: fails in this sandbox at `tests/browser-smoke.mjs:88` (simulator Save → Load count wait), **identically at the unmodified parent 773c35b** — environment-only, unrelated to the atlas pack; CI on the pushed head runs it.
- [Targeted rendered probe](scadrial-luthadel-probe.mjs) (real pack/engine, Playwright + SwiftShader), 1440x900 and 390x844: **84/84**.
  - Hidden — `#read=_none`, MB01 only, MB03 only, MB01+MB02: Scadrial not selectable; new blurb, short (desktop tooltip) and Luthadel desc absent; no old copy present; no console errors. (4 states × 2 viewports.)
  - Visible — OT set (`#read=` all three) and frozen preset `#upto=mistborn-original-trilogy:1:mistborn-the-hero-of-ages`: new blurb in dossier, new short in desktop hover tooltip (touch has no tooltip surface), Luthadel listed, Luthadel desc shown; old phrases ("constant fall of ash", "eight gates named for metals", "built over the Well of Ascension", "The ash-covered world") absent.
  - Unreviewed note still shown in the Reading panel for the OT set (parents keep fallback).
  - Later era unchanged: `#book=6` shows the era-6 blurb, places list = 13 Basin-era sites without Luthadel; `All` shows the era-6 blurb and the 17 original-era places (incl. Luthadel). Both place lists are **identical when the same probe runs against 773c35b** (that baseline run fails only the 16 new-copy assertions, as expected).
  - Legacy `#book=2` (cumulative mode, no per-work field gates) shows the narrow blurb — the only change there is the replaced copy.
- Screenshots: [OT set 1440x900](shots/scadrial-luthadel-OT-1440x900.png) (dossier + hover tooltip with new short), [OT set 390x844](shots/scadrial-luthadel-OT-390x844.png). Viewed.

## Hand-back

implementation/claude → implementation-review/chatgpt for this exact head. After review the next unit is ChatGPT's parent-surface research (Scadrian system chart for `name`/`status`/`star`/order; nested cognitive/era/gfx exposures), per the packet. No merge, deploy or release approval.
