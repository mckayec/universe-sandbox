"""Rasterise the built-in Earth land mask used by atlas packs with base:"earth".

Source data (public domain, Natural Earth, https://www.naturalearthdata.com/):
  - land:  Natural Earth 1:10m land, as packaged in world-atlas@2.0.2 (land-10m.json, TopoJSON)
  - lakes: Natural Earth 1:10m lakes (ne_10m_lakes.geojson from nvkelso/natural-earth-vector)

Usage (from the repo root, with the two data files downloaded to a scratch folder):
  npm pack world-atlas@2.0.2      # unpack; use package/land-10m.json (read here as plain data)
  python3 tools/build_earth_mask.py LAND-10M.json NE_10M_LAKES.geojson

Writes public/atlas/earth-hi.png (8192x4096) and public/atlas/earth-hi-4k.png (4096x2048):
8-bit grayscale equirectangular masks, 255 = land, 0 = sea or lake, with anti-aliased
coastlines (drawn at 2x and downsampled) so a 0.5 threshold traces a smooth shore.
Row 0 is 90N, column 0 is 180W. The small public/atlas/earth-base.png is unchanged.
"""

import json
import sys

from PIL import Image, ImageDraw

SS = 2  # supersampling factor


def rings(geom):
    t = geom["type"]
    if t == "Polygon":
        yield geom["coordinates"]
    elif t == "MultiPolygon":
        yield from geom["coordinates"]
    elif t == "GeometryCollection":
        for g in geom["geometries"]:
            yield from rings(g)


def topo_arcs(topo):
    """Decode quantized, delta-encoded TopoJSON arcs to [lon, lat] lists."""
    tr = topo.get("transform")
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for p in arc:
            if tr:
                x += p[0]
                y += p[1]
                pts.append([x * tr["scale"][0] + tr["translate"][0], y * tr["scale"][1] + tr["translate"][1]])
            else:
                pts.append([p[0], p[1]])
        out.append(pts)
    return out


def topo_ring(arcs, idxs):
    ring = []
    for i in idxs:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        ring.extend(a[1:] if ring else a)
    return ring


def topo_geoms(topo):
    arcs = topo_arcs(topo)
    out = []

    def conv(g):
        if g["type"] == "GeometryCollection":
            for s in g["geometries"]:
                conv(s)
        elif g["type"] == "Polygon":
            out.append({"type": "Polygon", "coordinates": [topo_ring(arcs, r) for r in g["arcs"]]})
        elif g["type"] == "MultiPolygon":
            polys = [[topo_ring(arcs, r) for r in p] for p in g["arcs"]]
            out.append({"type": "MultiPolygon", "coordinates": polys})

    for obj in topo["objects"].values():
        conv(obj)
    return out


def features(path):
    data = json.load(open(path))
    if data.get("type") == "Topology":
        return topo_geoms(data)
    if data.get("type") == "FeatureCollection":
        return [f["geometry"] for f in data["features"] if f.get("geometry")]
    return [data.get("geometry", data)]


def unwrap(ring):
    """Make longitudes continuous across the antimeridian. A ring that circles a pole
    (Antarctica) ends 360 degrees from where it started; close it along that pole."""
    out = [list(ring[0])]
    for p in ring[1:]:
        lon = p[0]
        prev = out[-1][0]
        while lon - prev > 180:
            lon -= 360
        while lon - prev < -180:
            lon += 360
        out.append([lon, p[1]])
    span = out[-1][0] - out[0][0]
    if abs(span) > 180:
        pole = -90.0 if sum(p[1] for p in out) < 0 else 90.0
        out += [[out[-1][0], pole], [out[0][0], pole]]
    return out


def draw(draw_ctx, geoms, w, h, land_value, hole_value):
    def px(pt, off):
        return ((pt[0] + off + 180.0) / 360.0 * w, (90.0 - pt[1]) / 180.0 * h)

    for g in geoms:
        for poly in rings(g):
            for i, ring in enumerate(poly):
                if len(ring) < 3:
                    continue
                ring = unwrap(ring)
                for off in (-360.0, 0.0, 360.0):
                    pts = [px(p, off) for p in ring]
                    if max(x for x, _ in pts) < 0 or min(x for x, _ in pts) > w:
                        continue
                    draw_ctx.polygon(pts, fill=land_value if i == 0 else hole_value)


def build(land_path, lakes_path, out_w):
    w, h = out_w * SS, out_w // 2 * SS
    im = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(im)
    draw(d, features(land_path), w, h, 255, 0)
    draw(d, features(lakes_path), w, h, 0, 255)
    return im.resize((out_w, out_w // 2), Image.LANCZOS)


def main():
    land, lakes = sys.argv[1], sys.argv[2]
    hi = build(land, lakes, 8192)
    hi.save("public/atlas/earth-hi.png", optimize=True)
    hi.resize((4096, 2048), Image.LANCZOS).save("public/atlas/earth-hi-4k.png", optimize=True)


if __name__ == "__main__":
    main()
