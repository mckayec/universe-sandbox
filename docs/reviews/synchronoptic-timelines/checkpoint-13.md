# Timeline checkpoint 13 — drag cancellation, books-derived chapter gate, count correction

Runtime head **107f6b97ed8997a6fabad70d2e880478a2d5bd5a** (parent df67a6e, checkpoint 12). Assignment:
HANDOFF_PLAN 2026-11-04 “Timeline checkpoints 11–12: fix drag cancellation and chapter gates”. PR33 untouched.
The adapter stays isolated and unwired.

## TL-R10 — cancel active drags without committing (`timeline-view.js`)

- Only a deliberate `pointerup` commits. `lostpointercapture` now cancels (after a `pointerup` the drag is already
  committed and cleared, so a normal drop still works).
- `close()` (Escape, the Close button, a cross-reference jump, a backdrop click) cancels first.
- `draw()` cancels before replacing the lane bar, so any rerender (window resize, the host’s `refresh()` on a
  gate/filter change, chart/list or zoom) never leaves a drag pointing at stale chips.
- Cancelling releases pointer capture, clears `tl-drop`/`tl-drag`/`tl-dragging`, and changes neither the order
  nor the URL. Focus: Escape/Close return focus to the opener as before; other cancels leave focus where it was
  inside the dialog (pointerdown on the grip never moves focus).
- The ↑/↓ buttons, own-slot no-op, Reset and URL reload are unchanged.

**Evidence** — [tl13/tl13-cancel-probe.mjs](tl13/tl13-cancel-probe.mjs), Religious Traditions pack, at 390×844 and
1440×900, mouse: Judaism dragged toward slot 3 and held, then Escape / Close / explicit `pointercancel` / real
`releasePointerCapture` (unexpected capture loss) / viewport resize / rerender. Each case checks: drag was live;
marks cleared; focus (opener for Escape/Close, inside the timeline otherwise); pre-drag order; URL `tl` unchanged;
no marks after release; a following normal drop still commits; ↑ still moves the lane.
[Result](tl13/tl13-cancel-probe.txt): **97/97 PASS**, no console/page errors.
**Control** at df67a6e ([output](tl13/tl13-cancel-probe-control-df67a6e.txt)): Escape, Close and capture loss
commit the reorder and resize leaves marks behind — the probe reproduces the reported defect.
Checkpoint-11 normal-drag probe re-run on this head ([tl11-rerun.txt](tl13/tl11-rerun.txt)): **PASS 40** + no
errors (mouse at 1280/1440/3840, real CDP touch at 390, moved-toggle focus, ↑/↓, Reset, URL reload).
Screenshots looked at: [390](tl13/390-after-escape-cancel.jpg) and [1440](tl13/1440-after-escape-cancel.jpg)
(taken after the cancel and the follow-up drop and ↑ in the Escape case).
Probe note: at 390 the lane bar keeps the sideways scroll from an earlier drag’s edge nudge, so the probe resets
`scrollLeft` before each drag; a capture loss is delivered with the next pointer event, so that case nudges the
pointer before checking.

## TL-R11 — books-derived chapter gates (`timeline.js`)

`firstBook(o)` resolves the first book from explicit `first`, else an event’s `book`, else `min(books)`
(PACK_FORMAT §6 defaults); `gateOf` stores it and `chapterOk` resolves it again from raw gates. A chapter-bearing
record with no book at all is ambiguous and is withheld in cumulative mode. Unchanged: no book selected or a
non-cumulative host hides nothing here; earlier-book records pass; later-book records stay hidden.

Unit tests (`tests/atlas-timeline-sw.test.ts`): books-only, several books, explicit `first`, event `book` — each at
an earlier selected book, unknown/1/8/9/12 chapters of the same book, a later book, All and single-book; explicit
`first` beating `books`; chapter with no book. Adapter integration: a books-only chaptered card and site carry
`first: 4` and, through `visible()` with a host gate, are absent from records, edge endpoints and `search()` until
chapter 9 (the view, counts, layout, list and URL selection all read that gated view). Neither real pack
currently carries chapter fields; this is a latent fix, not a demonstrated leak.

## TL-E02 — count correction

checkpoint-12.md now says **1,639** undated of 1,669 at fixture 3b24180 (1,634 is the narrative subset). Current
PR33 (`dd62a45`, unchanged by 739eeae’s copy-only corrections), recounted with this adapter: **1,686 records,
30 dated, 1,656 undated, 1,651 narrative, 329 relationships, 0 drawable**.

## Builder dispositions (accepted, for the wiring unit — not done here)

Overview card on Other → label “Standard Works overview” at wiring; collapsed per-work undated panel before
wiring; a card `src` may ground a `see` relation only per-relationship after locator review (edge `src` stays
empty meanwhile).

## Checks at 107f6b9

`pnpm format`; `pnpm check` (format, build, check:dist, **133/133** tests); `pnpm test:pages` (12 pages × 2);
`pnpm test:browser` passed ([log](tl13/browser-smoke.txt)), Playwright Chromium 1243 via `CHROME_PATH`. Not
established: matched-browser, physical-device, real-GPU or assistive-technology acceptance. Not merged.
