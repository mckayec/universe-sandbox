# Decisions waiting on Mckay

Items that only Mckay can move (speed rule R1, HANDOFF_PLAN.md "Speed amendment"). Each item here has `owner: mckay`, `blocked-on: mckay` in its `status.md`. Either AI adds a row; when Mckay answers, record the answer and date in the Answer column and move the item on. Keep one question per row.

| ID | Item | Question | Options + recommendation | Blocks what | Opened | Answer |
|---|---|---|---|---|---|---|
| D01 | Review: disks-accretion-galaxies (PR #43) | Release PR #43 (slow accretion save/restore fixes, exhibit wording) to the live site? | Yes: Claude merges pinned to c7c6be8 and confirms deploy / No: say what to change. Recommend yes: ChatGPT approved, technical acceptance passed (docs/reviews/disks-accretion-galaxies/acceptance-c7c6be8.md); Known gaps: no real-device run, smoke-test Save/Load race. | Merge and go-live of PR #43 | 2026-11-06 | |
