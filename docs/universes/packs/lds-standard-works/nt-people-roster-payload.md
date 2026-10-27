# New Testament dense roster and relationship payload

2026-10-26. [nt-people-roster-payload.csv](nt-people-roster-payload.csv) supplies **191 source-specific typed assertions from20 chapter units**. This closes member/relationship extraction for the rosters below; it is not191 new people. Repeated Gospel witnesses deliberately remain separate assertion rows. Each row carries the exact verse URL, a local payload key, subject, relation, object, qualifier and actual retained source-capture hash.

## Completed scope

| Source | Extracted payload |
|---|---|
| Matthew10:1–4; Mark3:13–19; Luke6:12–16 | Each complete Twelve list, explicit aliases, fathers/brothers, Matthew’s occupation, Boanerges and Judas’s identification. |
| Acts1:13–26 | Eleven, Mary and accompanying groups, two nominated replacements, Joseph’s two aliases and Matthias’s selection. |
| Acts6:3–6;13:1–3;20:4–6 | Seven distribution appointees, five Antioch prophets/teachers and seven travel companions with stated origins. |
| 1Corinthians16:10–24 | Timotheus/Apollos conditional travel; Stephanas household; three visitors; Aquila/Priscilla house church. |
| 2Timothy4:9–22; Titus3:12–15 | Every named coworker, destination, requested/actual travel distinction, occupation, household and greeting. |
| Colossians4:7–18; Philemon1 | Named messengers, prisoners, greetings, kinship wording, households, addressees and Onesimus’s source-specific relationship. |
| Philippians4:2–3;2Timothy1:5,15–18;2:17–18;3John | Women coworkers, Timothy’s mother/grandmother, supporters/opponents and letter-local Gaius/Diotrephes/Demetrius. |
| Matthew13:55–56;Mark6:3;Acts16:1–2;1Peter5:12–13 | Jesus’s named brothers/unnamed sisters and mother; Timothy’s unnamed parents in Acts; Silvanus/Marcus letter roles. |

Root-owned Matthew1, Luke3 and Romans16 extraction is deliberately not duplicated. Divine invocations, generic unnamed brethren and salutation formulas are not expanded into repeated new person records. Named Barnabas, Herod and parents can appear as relationship targets rather than additional duplicate membership rows.

## Identity and interpretation boundaries

- `association_first:2` gates these New Testament assertions, **not the earliest shared entity**. Reuse existing person IDs through the shared identity register. Payload keys identify assertions; they are not a competing canonical person namespace.
- The three Twelve lists have12 memberships each; Acts1 initially has11. Lebbaeus/Thaddaeus and Luke’s Judas brother of James are kept in their source lists. No automatic harmonization identifies every similarly situated name. James son of Zebedee and James son of Alphaeus remain distinct.
- Colossians4:10 preserves KJV “sister’s son” and the retrieved official footnote’s Greek cousin/kinsman alternative. The payload does not enforce nephew-only genealogy. Luke/Acts’s Judas relationship likewise retains published wording rather than silently substituting another translation.
- Religious brother/son/fellowsoldier language is not automatically biological. Apphia is not assigned as Philemon’s wife; Archippus is not assigned as their son. Lois is Timothy’s grandmother, without an explicit maternal/paternal branch supplied by2Timothy1:5.
- Gaius, Alexander, Demetrius, Jesus Justus, Joseph Justus, Simon and James require contextual identity. No same-name rule merges these. Alias decisions already supported elsewhere (such as Prisca/Priscilla or Silas/Silvanus) may be reused transparently.
- Titus3’s Artemas **or** Tychicus is an alternative plan, not two completed missions. Requests to bring Mark or host Apollos do not prove arrival. Moral accusations and commendations remain attributed to their letters; departure of Crescens/Titus does not inherit the criticism explicitly directed at Demas.
- Jesus’s brothers are given as the hometown speakers name them. No full/half/step-sibling harmonization, unnamed-sister names or later biographies are invented. Household greeting does not establish Onesiphorus’s death.

## Source reading and validation

The actual retained official Church verse bodies for all listed passages were reread, including the entire short Philemon and3John bodies. Colossians4:10’s official annotation was separately inspected. The parsed working index `/tmp/nt-official-parsed.json` was used to locate numbered verses, backed by durable chapter bundles in `/workspace/lds-source-evidence/20261026/nt/bundles/`. The CSV records the individual bundle path and SHA256; source hashes are provenance, not substitutes for semantic reading. These are extracted web responses, not original manuscript or publisher HTML bytes. No raw edition dump is committed.

All assertion source verses are present in the retained official body index; all referenced capture files exist. The membership counts and unique assertion keys were checked. This closes the scoped roster extraction gap, without claiming independent authorship/historicity verification or every conceivable New Testament social relation. No primary-text access blocker remains for this payload.
