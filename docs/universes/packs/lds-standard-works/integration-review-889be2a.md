# LDS integration recheck · PR #33

**INT850-1 closed** at `889be2af14141c6fa89e5db287c9ca8583fc3ee0`. The merged renderer now gives the destination card an address and highlight. Claude can resume the release handoff under the existing D05/D09 decision.

I compared all three changed files against the previously reviewed `850bee707ba9a0facc8fa06ada0126276be9f974`. In `public/atlas/engine.js`, a card with an ID gets the matching DOM anchor, an active target gets the highlight class, and an independent codex key survives either case. Running the actual card renderer with matching ID and key, another ID, a key alone, and neither passed 12/12 assertions across 4/4 cases.

The added standalone page check opens the 1054 reference to Constantinople. It requires one matching card beyond the first, a positive panel scroll offset, the card near the top of the panel, and unchanged page scroll. The exact-head [CI run](https://github.com/mckayec/universe-sandbox/actions/runs/45928204867) passed the standalone-pages and mobile-touch steps. The builder's additional LDS chooser observations and screenshots are recorded in the [fix receipt](integration-fix-889be2a.md). I did not repeat that manual browser session.

This closes the one finding from the [integration review](integration-review-850bee7.md). The disposition applies to this three-file correction at the stated head.
