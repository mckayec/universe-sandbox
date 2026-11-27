#!/usr/bin/env bash
# R0 scope check (deep-worlds). Usage: r0-scope-check.sh <base-ref> <candidate-ref> [pr37-ref]
# Lists every path the candidate changes against the base and fails if any is outside the R0 allowlist, in particular
# anything under public/atlas/packs/ (pack data), the Society application/assets (society.*, atlas/tex/,
# society-transitions test), solar.js, src/ (simulator) or docs/. Also confirms the four places modules are
# byte-identical to PR37 and that pack/Society trees hash identically on both sides.
set -euo pipefail
BASE=${1:?base ref}
CAND=${2:?candidate ref}
PR37=${3:-03394c32816fcb5c95261bf6a9ea4520381a5838}
echo "base      $(git rev-parse "$BASE")"
echo "candidate $(git rev-parse "$CAND")"
echo "pr37      $(git rev-parse "$PR37")"
ALLOW='^(package\.json|public/atlas/engine\.js|public/atlas/engine\.css|public/atlas/index\.html|public/atlas/places\.js|public/atlas/places-lm\.js|public/atlas/places-fx\.js|public/atlas/places-audio\.js|tests/atlas-pack-validator\.mjs)$'
DENY='^(public/atlas/packs/|public/atlas/society|public/atlas/tex/|public/atlas/solar|tests/society-transitions|tests/check-dist|src/|docs/)'
fail=0
echo "--- changed paths (git diff --name-status base..candidate)"
git diff --name-status "$BASE" "$CAND"
while IFS= read -r p; do
  if [[ "$p" =~ $DENY ]]; then echo "FAIL denied path changed: $p"; fail=1;
  elif [[ ! "$p" =~ $ALLOW ]]; then echo "FAIL path outside R0 allowlist: $p"; fail=1;
  else echo "ok   $p"; fi
done < <(git diff --name-only "$BASE" "$CAND")
echo "--- protected trees (git tree hash base vs candidate)"
for t in public/atlas/packs public/atlas/society.js public/atlas/society.html public/atlas/society.css public/atlas/society-fonts.css public/atlas/solar.js src; do
  a=$(git rev-parse "$BASE:$t" 2>/dev/null || echo absent); b=$(git rev-parse "$CAND:$t" 2>/dev/null || echo absent)
  if [[ "$a" == "$b" ]]; then echo "ok   $t $a"; else echo "FAIL $t $a != $b"; fail=1; fi
done
if git rev-parse "$CAND:public/atlas/tex" >/dev/null 2>&1; then echo "FAIL public/atlas/tex exists on candidate"; fail=1; else echo "ok   public/atlas/tex absent (as on base)"; fi
echo "--- places modules vs PR37 (blob hash)"
for f in places.js places-lm.js places-fx.js places-audio.js; do
  a=$(git rev-parse "$PR37:public/atlas/$f"); b=$(git rev-parse "$CAND:public/atlas/$f")
  if [[ "$a" == "$b" ]]; then echo "ok   $f $b"; else echo "FAIL $f $a != $b"; fail=1; fi
done
echo "--- pack data: scene/landmark/fx/lm/places keys on candidate (expect none)"
n=$(git grep -cE '(^[[:space:]]*|[{,][[:space:]]*)(scene|landmarks|fx|lm|places)[[:space:]]*:' "$CAND" -- 'public/atlas/packs/*.js' 'public/atlas/packs/**/*.js' | wc -l || true)
if [[ "$n" == "0" ]]; then echo "ok   0 pack files carry scene/landmarks/fx/lm/places keys"; else echo "FAIL $n pack files carry PACK_FORMAT 22 keys"; git grep -lE '(^[[:space:]]*|[{,][[:space:]]*)(scene|landmarks|fx|lm|places)[[:space:]]*:' "$CAND" -- 'public/atlas/packs/'; fail=1; fi
echo "--- diff stat"
git diff --stat "$BASE" "$CAND"
if [[ $fail == 0 ]]; then echo "RESULT PASS"; else echo "RESULT FAIL"; fi
exit $fail
