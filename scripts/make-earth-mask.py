"""Regenerate public/atlas/earth-base.png, the atlas Earth land mask (TA-01).

Source: Natural Earth 1:10m land polygons (public domain),
https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson

Output: 4096x2048 (plus a 2048x1024 *-2048.png copy for phones) equirectangular grayscale (north up, lon -180 at the left edge).
Value = clamp(0.5 + signed coast distance / RAMP): 0.5 on the coastline, rising
inland and falling offshore. RAMP matches the ramp of the original 1024x512 mask
(about 8 degrees from deep sea to inland), so the engine shader and the solar
bake keep their look; only the coastline gets sharper and more accurate.

Usage: python3 scripts/make-earth-mask.py ne_10m_land.geojson public/atlas/earth-base.png
Needs numpy, scipy and Pillow (about 2 GB of memory).
"""

import json
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

SRC_W, SRC_H = 16384, 8192  # rasterisation size (4x supersampled)
MID_W, MID_H = 8192, 4096  # distance-transform size
OUT_W, OUT_H = 4096, 2048
RAMP_DEG = 23 * 360 / 1024  # ~8.1 degrees, fitted to the original mask


def rasterise(path):
    data = json.load(open(path))
    img = Image.new("L", (SRC_W, SRC_H), 0)
    draw = ImageDraw.Draw(img)

    def px(ring):
        return [((x + 180) / 360 * SRC_W, (90 - y) / 180 * SRC_H) for x, y in ring]

    holes = []
    for feature in data["features"]:
        geom = feature["geometry"]
        polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        for poly in polys:
            draw.polygon(px(poly[0]), fill=255)
            holes += poly[1:]
    for ring in holes:
        draw.polygon(px(ring), fill=0)
    return img.resize((MID_W, MID_H), Image.BOX)


def signed_distance_deg(land):
    pad = MID_W // 8  # wrap across the antimeridian
    wrapped = np.concatenate([land[:, -pad:], land, land[:, :pad]], 1)
    to_land = ndimage.distance_transform_edt(~wrapped)[:, pad:-pad]
    to_sea = ndimage.distance_transform_edt(wrapped)[:, pad:-pad]
    return (to_sea - to_land) * (360 / MID_W)


def main(src, out):
    land = np.array(rasterise(src)) > 127
    sd = signed_distance_deg(land)
    sd = sd.reshape(OUT_H, MID_H // OUT_H, OUT_W, MID_W // OUT_W).mean((1, 3))
    value = np.clip(0.5 + sd / RAMP_DEG, 0, 1)
    img = Image.fromarray(np.round(value * 255).astype(np.uint8), "L")
    img.save(out, optimize=True)
    # phones and low-memory devices load the half-size copy (engine.js loadEarth)
    img.resize((OUT_W // 2, OUT_H // 2), Image.BOX).save(out.replace(".png", "-2048.png"), optimize=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
