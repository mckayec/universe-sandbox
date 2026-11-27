#!/usr/bin/env python3
"""SC4-E1 repair: lossless metric pass (METRIC=1 run of evidence-harness-sc4e1-r.mjs; no video recording).

Usage: python3 -I evidence-metric-sc4e1-r.py <outDir>   (reads metric-runs.json and stills/*.png)
Each still is an unclipped full-frame screenshot taken while a labelled window is held; crops follow the host body's
probe screen position recorded with that still. Consecutive-still mean absolute luminance change and left/right
asymmetry are reported per window. Writes metric.json.
"""
import json, os, sys
import numpy as np
from PIL import Image

out = sys.argv[1]
runs = json.load(open(os.path.join(out, 'metric-runs.json')))
res = {}
for r in runs:
    sc = r['scenario']
    w, h = sc['vp']['width'], sc['vp']['height']
    half = round(min(w, h) * (0.22 if sc['id'] == 'isolated' else 0.12))
    per, prev, prev_label = {}, None, None
    for s in r['stills']:
        a = np.asarray(Image.open(os.path.join(out, 'stills', s['file'])).convert('RGB'), np.float32)
        c = s['hostScreen'] or [w / 2, h / 2]
        x = int(max(0, min(w - 2 * half, c[0] - half))); y = int(max(0, min(h - 2 * half, c[1] - half)))
        L = 0.2126 * a[y:y + 2 * half, x:x + 2 * half, 0] + 0.7152 * a[y:y + 2 * half, x:x + 2 * half, 1] + 0.0722 * a[y:y + 2 * half, x:x + 2 * half, 2]
        row = {'file': s['file'], 'logS': s['logMs'] / 1000, 'paused': s['paused'], 'speed': s['speed'], 'count': s['count'],
               'tide': s['tide'], 'center': [round(c[0], 1), round(c[1], 1)],
               'asym': round(float((L[:, :half].sum() - L[:, half:].sum()) / max(1, L.sum())), 4)}
        if prev is not None and prev_label == s['label']:
            row['diff'] = round(float(np.abs(L - prev).mean()), 3)
        prev, prev_label = L, s['label']
        per.setdefault(s['label'], []).append(row)
    res[f"{sc['id']}-{w}x{h}"] = per
json.dump(res, open(os.path.join(out, 'metric.json'), 'w'), indent=1)
for t, per in res.items():
    for l, rows in per.items():
        print(t, l, 'n', len(rows), 'paused', {r['paused'] for r in rows}, 'speed', {r['speed'] for r in rows},
              'diff', [r.get('diff') for r in rows], 'asym', [r['asym'] for r in rows], 'tide', [r['tide'] for r in rows][-1])
