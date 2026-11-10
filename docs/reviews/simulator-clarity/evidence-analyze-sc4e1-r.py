#!/usr/bin/env python3
"""SC4-E1 repair: offline frame analysis for evidence-harness-sc4e1-r.mjs recordings.

Usage: python3 -I evidence-analyze-sc4e1-r.py <outDir>   (reads <outDir>/runs.json and the .webm clips)

Every decoded frame (ffmpeg, passthrough timing, presentation timestamps from showinfo) is labelled by the harness
marker swatch it shows (top-left 40x40 block). Per transition, the measured offset is log seconds minus the PTS of
the first frame showing that marker. Probe samples are mapped to frames through the offset of the latest transition
at or before the sample, never a clip-wide constant. Crops follow the host body's probe screen position.
Writes alignment.json, metrics.json, and contact sheets (JPEG) to <outDir>.
"""
import json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

MARKERS = {
    'startup': (128, 128, 128), 'restored-paused': (255, 255, 0), '1x': (0, 200, 0), '10x': (0, 0, 255),
    'approach': (255, 0, 255), 'recession': (0, 255, 255), 'merged-10x': (255, 128, 0),
    'paused-after-merger': (255, 0, 0),
}


def classify(rgb):
    best, bd = None, 1e9
    for k, c in MARKERS.items():
        d = sum((a - b) ** 2 for a, b in zip(rgb, c)) ** 0.5
        if d < bd:
            best, bd = k, d
    return best if bd < 90 else None


def decode(clip, w, h):
    err = clip + '.showinfo.txt'
    with open(err, 'w') as ef:
        p = subprocess.Popen(['ffmpeg', '-v', 'info', '-i', clip, '-vf', 'showinfo', '-fps_mode', 'passthrough',
                              '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE, stderr=ef)
        size = w * h * 3
        while True:
            buf = p.stdout.read(size)
            if len(buf) < size:
                break
            yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
        p.wait()


def pts_list(clip):
    txt = open(clip + '.showinfo.txt').read()
    return [float(m) for m in re.findall(r'n:\s*\d+\s+pts:\s*\d+\s+pts_time:([\d.]+)', txt)]


class Stash:
    """Second decoding pass that returns only requested frames (by decode index)."""

    def __init__(self, clip, w, h):
        self.clip, self.w, self.h, self.cache = clip, w, h, {}

    def need(self, idx):
        want = set(idx) - set(self.cache)
        if want:
            for i, f in enumerate(decode(self.clip, self.w, self.h)):
                if i in want:
                    self.cache[i] = f.copy()

    def __getitem__(self, i):
        self.need([i])
        return self.cache[i]


def lum(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def crop(frame, c, half):
    h, w, _ = frame.shape
    x = int(max(0, min(w - 2 * half, c[0] - half)))
    y = int(max(0, min(h - 2 * half, c[1] - half)))
    return frame[y:y + 2 * half, x:x + 2 * half], (x, y)


def main(out):
    runs = json.load(open(os.path.join(out, 'runs.json')))
    alignment, metrics = {}, {}
    for r in runs:
        sc = r['scenario']
        w, h = sc['vp']['width'], sc['vp']['height']
        tag = f"{sc['id']}-{w}x{h}"
        half = round(min(w, h) * (0.22 if sc['id'] == 'isolated' else 0.12))
        samples = r['samples']
        frames_meta = []
        for i, f in enumerate(decode(r['clip'], w, h)):
            sw = f[8:32, 8:32].reshape(-1, 3).mean(0)
            label = classify(sw)
            blank = float(f[40:].std()) < 2.0  # below the marker strip
            frames_meta.append({'i': i, 'label': label, 'blank': blank})
        stash = Stash(r['clip'], w, h)
        pts = pts_list(r['clip'])
        for m, t in zip(frames_meta, pts):
            m['pts'] = t
        frames_meta = [m for m in frames_meta if 'pts' in m]
        # Run-length segments in the video.
        segs = []
        for m in frames_meta:
            if segs and segs[-1]['label'] == m['label']:
                segs[-1]['lastPts'] = m['pts']; segs[-1]['frames'] += 1; segs[-1]['blank'] += m['blank']
            else:
                segs.append({'label': m['label'], 'firstPts': m['pts'], 'lastPts': m['pts'], 'frames': 1, 'blank': int(m['blank'])})
        offsets = []
        for tr in r['transitions']:
            first = next((m for m in frames_meta if m['label'] == tr['label']), None)
            offsets.append({'label': tr['label'], 'logS': tr['logMs'] / 1000, 'firstPts': first and first['pts'],
                            'offsetS': first and round(tr['logMs'] / 1000 - first['pts'], 3)})
        alignment[tag] = {'clip': os.path.basename(r['clip']), 'frames': len(frames_meta), 'segments': segs,
                          'transitionOffsets': offsets,
                          'unlabelledFrames': sum(1 for m in frames_meta if m['label'] is None),
                          'blankFrames': sum(1 for m in frames_meta if m['blank'])}

        def to_pts(log_ms):
            prior = [o for o in offsets if o['offsetS'] is not None and o['logS'] * 1000 <= log_ms]
            return log_ms / 1000 - prior[-1]['offsetS'] if prior else None

        smap = [(to_pts(s['logMs']), s) for s in samples]
        smap = [(p, s) for p, s in smap if p is not None]

        def sample_at(p):
            if not smap:
                return None
            best = min(smap, key=lambda ps: abs(ps[0] - p))
            return best[1] if abs(best[0] - p) <= 0.3 else None  # no probe sample near this frame (e.g. startup)

        wanted = []
        for seg in segs:
            inside = [m for m in frames_meta if m['label'] == seg['label']]
            last = -9
            for m in inside:
                if m['pts'] - last >= 0.5 or m is inside[-1]:
                    wanted.append(m['i']); last = m['pts']
            wanted += [m['i'] for m in inside[::max(1, len(inside) // 6)]]
        stash.need(wanted + [m['i'] for m in frames_meta][-1:])
        # Per labelled window: frames inside [first+0.5s, last-0.5s], one every ~0.5 s.
        per = {}
        for seg in segs:
            if seg['label'] in (None, 'startup'):
                continue
            inside = [m for m in frames_meta if m['label'] == seg['label'] and seg['firstPts'] + 0.5 <= m['pts'] <= seg['lastPts'] - 0.5]
            picked, last = [], -9
            for m in inside:
                if m['pts'] - last >= 0.5:
                    picked.append(m); last = m['pts']
            rows = []
            prev = None
            for m in picked:
                s = sample_at(m['pts'])
                c = (s and s['hostScreen']) or [w / 2, h / 2]
                cr, xy = crop(stash[m['i']], c, half)
                L = lum(cr.astype(np.float32))
                row = {'pts': m['pts'], 'sampleLogS': s and s['logMs'] / 1000, 'center': [round(c[0], 1), round(c[1], 1)],
                       'sep': s and s['sep'] and round(s['sep'], 3), 'tide': s and s['tide'], 'count': s and s['count'],
                       'paused': s and s['paused'], 'speed': s and s['speed'],
                       'asym': round(float((L[:, :half].sum() - L[:, half:].sum()) / max(1, L.sum())), 4),
                       'mean': round(float(L.mean()), 2)}
                if prev is not None and prev.shape == L.shape:
                    row['diff'] = round(float(np.abs(L - prev).mean()), 3)
                prev = L
                rows.append(row)
            per.setdefault(seg['label'], []).append(rows)
        metrics[tag] = per

        # Contact sheet: per window, 4 evenly spaced frames (full frame + tracked host crop), labelled with
        # marker, PTS and the mapped probe sample.
        tiles = []
        for seg in segs:
            if seg['label'] is None:
                continue
            inside = [m for m in frames_meta if m['label'] == seg['label'] and seg['firstPts'] <= m['pts'] <= seg['lastPts']]
            if len(inside) < 2:
                continue
            idx = [inside[round(k * (len(inside) - 1) / 3)] for k in range(4)]
            if seg['label'] in ('approach', 'recession'):
                # Closest approach: last approach frame / first recession frame are always included.
                idx = idx if seg['label'] == 'approach' else idx
            tiles.append((seg['label'], idx))
        tw = 300
        th = round(tw * h / w)
        cs = 150
        cols = 4
        stash.need([m['i'] for _, ms in tiles for m in ms])
        sheet = Image.new('RGB', (cols * (tw + cs), len(tiles) * (max(th, cs) + 18)), (16, 16, 16))
        d = ImageDraw.Draw(sheet)
        for row_i, (label, ms) in enumerate(tiles):
            y0 = row_i * (max(th, cs) + 18)
            for k, m in enumerate(ms):
                f = stash[m['i']]
                x0 = k * (tw + cs)
                sheet.paste(Image.fromarray(f).resize((tw, th)), (x0, y0 + 18))
                s = sample_at(m['pts'])
                c = (s and s['hostScreen']) or [w / 2, h / 2]
                cr, _ = crop(f, c, half)
                sheet.paste(Image.fromarray(cr).resize((cs, cs)), (x0 + tw, y0 + 18))
                info = f"{label} pts {m['pts']:.2f}s"
                if s and s.get('sep'):
                    info += f" sep {s['sep']:.1f}"
                if s and s.get('tide') is not None:
                    info += f" tide {s['tide']:.2f}"
                d.text((x0 + 4, y0 + 3), info, fill=(255, 255, 255))
        sheet.save(os.path.join(out, f'sc4e1r-{tag}-sheet.jpg'), quality=70)
        # Closest-approach frame for flyby (minimum mapped separation among labelled frames).
        if sc['id'].startswith('flyby') and smap:
            best = min((s for p, s in smap if s['sep']), key=lambda s: s['sep'])
            p = to_pts(best['logMs'])
            m = min(frames_meta, key=lambda m: abs(m['pts'] - p))
            Image.fromarray(stash[m['i']]).save(os.path.join(out, f'sc4e1r-{tag}-closest.jpg'), quality=72)
            alignment[tag]['closest'] = {'sep': round(best['sep'], 3), 'tide': best['tide'], 'sampleLogS': best['logMs'] / 1000,
                                         'framePts': m['pts'], 'frameLabel': m['label']}
        del stash
    json.dump(alignment, open(os.path.join(out, 'alignment.json'), 'w'), indent=1)
    json.dump(metrics, open(os.path.join(out, 'metrics.json'), 'w'))


if __name__ == '__main__':
    main(sys.argv[1])
