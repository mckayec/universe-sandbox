# Fixing round 6 — T5-1 (desktop Earth-surface start blocked the main thread)

PR #39 branch `pack/abrahamic-world-religions`, new head **813061f482c729429dd8ee9f194ca406a931cde9** (parent 33dffd0, the merge head audited in audit-final.md 22:40Z). Engine and test changes only; **no pack data changed** (`public/atlas/packs/abrahamic-world-religions.js` is byte-identical to 33dffd0).

## Diagnosis (measured, SwiftShader, 1440x900, built `dist/`)

- CPU profile of the load: 67.7 s of the ~70 s before the shell was observable was native `(program)` time (GL calls waiting on the software rasteriser); JS self time was small (readRenderTargetPixels 3.8 s, the rest under 0.3 s each).
- Long tasks at 33dffd0: 4.0 s, **33.8 s**, 9.5 s, 7.0 s, 5.9 s, 4.4 s, … — each the cost of one HD bake strip. The strip controller in `bakeStep()` started each job at full scale (1.9 M px per frame at 4096 wide) and only shrank 30 % per slow frame, so the first strip alone stalled the page for half a minute, and Playwright's rAF-based `waitForSelector` could not observe the shell until ~66 s.
- With strips bounded, frames under SwiftShader still cost ~2 s each at 1440x900 (the lit planet render itself), so software GL cannot complete a 4096 bake in reasonable time no matter how it is sliced.

## Fix (engine, generic — applies to every Earth/surface pack)

1. **Software-GL light path.** `SOFTGL` detects SwiftShader / llvmpipe / softpipe / "Software" / Microsoft Basic Render via `WEBGL_debug_renderer_info`; `LIGHT = LOWMEM || SOFTGL` gets the 1024 bake and 2048 vector maps (the path low-memory devices already used). Real GPUs are unaffected.
2. **Bounded, proportional bake strips.** Each new bake job starts from a probe strip (`BAKE_PROBE = .06` of the old budget), and the next strip scales by `20 ms / last frame time` (clamped .1–1.15 per frame) instead of ×0.7 / ×1.15 steps. One slow strip on a weak GPU is corrected immediately.
3. **Earth mask follows the bake size** (`HD<4096` → `earth-base-2048.png`), equivalent to the previous rule for phones/low-memory/small MAXTEX and still honouring the `__HD` capture override.
4. `christian-apocrypha` added to the `test:pages` matrix (audit observation). No test timeout changed.

## Results at 813061f

| Check | Result |
|---|---|
| Shell observable (SwiftShader, 1440x900) | **11.3–22 s** (was 66.6 s at 33dffd0; variance is machine load) |
| Longest single task after shell | ~2.3 s (was 33.8 s) |
| `pnpm format && pnpm check` | pass — 158/158 unit tests (two earth-mask tests updated/added for T5-1), check:dist pass |
| `pnpm test:pages` (CHROME_PATH = Playwright Chromium 1243) | **14 pages × 2 viewports pass**, incl. abrahamic and christian-apocrypha desktop + mobile |
| `pnpm test:browser` | simulator Save/Load step times out at `browser-smoke.mjs:88` — the same pre-existing main issue dispositioned earlier; no simulator files changed |
| Page errors during captures | none at any size |

Captures (load-time state, 12 s after the shell appears, preview surface + "Charting surface" progress visible): `shots/t5-813061f-3840.jpg`, `-1440.jpg`, `-1280.jpg`, `-390.jpg`. Inspected: header, back link, dossier, layer filter, year range, chronicle and markers render; nothing overlaps or clips; phone layout unchanged.

## Disclosed limits

- Under software GL the finished surface is now 1024 px rather than 4096 px; on such machines that trade is the point. The real-GPU desktop path (4096 bake, 8192/4096 maps) is unchanged apart from strip sizing, so the earlier finished-surface 4K captures (fixing-round4/5, made with the `__HD` override path) still represent GPU desktops. No physical-device timing exists yet.
- CI on PR branches does not run the Pages workflow; the deploy-workflow page check is reproduced locally with the same script and Chromium flags.

## Handoff

Stage `final-audit`, owner chatgpt: same-head canon/data recheck at 813061f (expected trivial — no pack data changed). Claude then re-confirms Technical at that head.
