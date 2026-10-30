# Final NT fix verification

Verified 2026-10-29 against GitHub-fetched exact head `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`, `public/atlas/packs/christian-apocrypha.js` blob `60c384ef8a11d5624842ee9ca9fbbf425a97a05c`, compared with audited build `8ae91333461bfeb989b570857a0aba321eaa34df`.

**Result: all five assigned findings are resolved in the event and codex occurrences. No remaining blocker found in this bounded fix recheck.** This is not a whole-pack canon approval or a claim to have reread all source units.

| Finding | Exact-head occurrences | Verification |
|---|---|---|
| APB-001 | line 601 `nta-ape-eubula`; line 1550 `Eubula` | Both now distinguish Agrippinus the goldsmith from Pompeius the deputy; no remaining alternate-identity wording. Reopened Acts Peter XVII: two distinct roles and names explicitly present. |
| APB-002 | line 652 `nta-apa-discovery` | Emperor keeps original, Jerusalem receives copy, and the editor's Greek reversal is explicitly marked. Reopened the selected James Wikisource §§1–2. Related Tarsus codex at 1146 makes no competing distribution claim. |
| APB-015 | line 639 `nta-at-initiation`; line 1139 `The house of Iuzanes and Mnesara`; line 1577 `Iuzanes and Mnesara` | All now assign healing to Mnesara, initiation to both spouses. Reopened Acts Thomas 150,154–158: Mnesara's illness/recovery, then joint anointing/baptism/eucharist. No residual plural bodily-healing claim. |
| APB-016 | line 639 `nta-at-initiation`; line 1575 `Narcia (Marcia)` | Both preserve nurse identity and maternal address without asserting absence of motherhood or inferring biological parentage. Acts Thomas 120–121 supports this restraint. Related Mygdonia event 636 remains consistent. |
| APB-017 | line 590 `nta-pt-ephesus` | Now includes Acts of Titus and removes exclusive two-witness wording. Reopened Acts Paul VIII introduction, explicitly naming this third witness. Related `Eubula and Artemilla` codex 1539 does not repeat the exclusivity error. |

Source bodies reopened for this recheck:
- [Acts Peter, James, XVII](https://www.earlychristianwritings.com/text/actspeter.html).
- [Apocalypse Paul, James, §§1–2](https://en.wikisource.org/wiki/The_Apocryphal_New_Testament_(1924)/Apocalypses/The_Apocalypse_of_Paul).
- [Acts Thomas, James, §§120–121,150,154–158](https://www.earlychristianwritings.com/text/actsthomas.html).
- [Acts Paul, James, VIII](https://www.earlychristianwritings.com/text/actspaul.html).

I checked the source register at research `4dc7f444246ab0c5afffe90ee3fb1838b92493aa` to verify the selected witness identities. These are historical translated/editorially mediated witnesses, not fresh original-language collation. An initially opened ECW Apocalypse Paul URL proved to be the distinct Coptic Nag Hammadi work and was excluded; the final verification uses the correct selected Wikisource Latin-based James text.

The fix's eight changed NT source-code lines cover four events and four codex entries (the initiation event addresses two findings). Whole-file searches for the affected names, original/copy language, and Ephesus witnesses found no duplicate stale claims. The event source strings retain work, locator and James attribution; the Greek reversal is visible in user-facing prose, not merely a source-code comment. No remote mutations, code changes, merge or deployment performed by this reviewer.

## Fresh-source random sample verification (two assigned NT entries)

Sample input `/tmp/apocrypha-final/sample.json`; exact-head text independently matches pack lines below. Selection was supplied by parent as SHA256 rank of `exactSHA:AUDIT_CHECKLIST-4|entrykey` across 327 events, 706 codex entries and 77 later additions; this reviewer did not rederive the whole random ranking.

- **PASS — `codex:places:313:The royal tomb (Acts of Thomas)`**, pack line 1141. Fresh reading of [James Acts Thomas §§164–170](https://www.earlychristianwritings.com/text/actsthomas.html): §168 places the burial in a royal sepulchre used by earlier kings; §170 narrates the absent bones, dust taken from their former resting-place and the king's son's recovery. No modern burial site is named in this passage. Entry correctly treats this as a claim of Acts Thomas, without a modern pin or date.
- **PASS — `codex:people:149:Iphidamia and Stratocles`**, pack line 1567. Fresh reading of [James Acts Andrew](https://www.earlychristianwritings.com/text/actsandrew.html): Vatican Gr. 808 prison fragment §2 explicitly includes Maximilla/Iphidamia in prison gatherings, §5 their visit, §§10–13 Andrew's dialogue with physically present Stratocles, §14 the women's return. Gregory epitome §34 places Stratocles with his slave Alcman. Entry correctly separates epitome detail from prison context and invents no relationship between the two named people.

Both sampled records supported; no new finding.
