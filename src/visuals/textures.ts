// Procedural canvas textures (glow, corona, clouds).
import * as THREE from 'three';
import { seeded } from '../physics/body-math.ts';
import { isCompact } from '../scene/setup.ts';

export function glowTexture(color: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!,
    g = x.createRadialGradient(128, 128, 2, 128, 128, 128);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.055, '#ffffff');
  g.addColorStop(0.2, color);
  g.addColorStop(0.52, `${color}66`);
  g.addColorStop(1, 'transparent');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
export function coronaTexture(color: string, seed = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  x.translate(128, 128);
  x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 56; i++) {
    const a = seeded(seed, i) * Math.PI * 2,
      length = 54 + seeded(seed, i + 90) * 67,
      width = 0.3 + seeded(seed, i + 160) * 1.4,
      g = x.createLinearGradient(0, 0, length, 0);
    g.addColorStop(0, '#ffffffcc');
    g.addColorStop(0.24, `${color}82`);
    g.addColorStop(1, 'transparent');
    x.save();
    x.rotate(a);
    x.fillStyle = g;
    x.globalAlpha = 0.12 + seeded(seed, i + 210) * 0.2;
    x.fillRect(12, -width / 2, length, width);
    x.restore();
  }
  const core = x.createRadialGradient(0, 0, 2, 0, 0, 125);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.1, color);
  core.addColorStop(0.34, `${color}99`);
  core.addColorStop(0.72, `${color}20`);
  core.addColorStop(1, 'transparent');
  x.globalAlpha = 1;
  x.fillStyle = core;
  x.fillRect(-128, -128, 256, 256);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
export function cloudTexture(color: string, seed = 1, dark = false) {
  const size = isCompact ? 256 : 384,
    c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d')!,
    image = x.createImageData(size, size),
    data = image.data,
    tint = new THREE.Color(color);
  for (let py = 0; py < size; py++)
    for (let px = 0; px < size; px++) {
      const nx = (px / size - 0.5) * 2,
        ny = (py / size - 0.5) * 2,
        r = Math.hypot(nx * 0.82, ny),
        angle = Math.atan2(ny, nx),
        radial = Math.max(0, 1 - r),
        w1 = Math.sin(nx * 7.3 + Math.sin(ny * 4.7 + seed) * 2.1),
        w2 = Math.sin(ny * 11.1 + Math.cos(nx * 5.2 - seed) * 2.7),
        w3 = Math.sin((nx + ny) * 18.3 + seed * 3.1),
        w4 = Math.sin(nx * 29.7 - ny * 23.1 + seed * 5.7) * 0.5,
        filament = 0.5 + 0.23 * w1 + 0.17 * w2 + 0.1 * w3 + 0.055 * w4,
        density = Math.max(
          0,
          Math.min(1, radial * (0.18 + filament * 1.42) - 0.12 + Math.sin(angle * 3 + r * 9 + seed) * 0.07),
        ),
        i = (py * size + px) * 4,
        light = 0.42 + density * 0.78;
      data[i] = Math.min(255, tint.r * 255 * light);
      data[i + 1] = Math.min(255, tint.g * 255 * light);
      data[i + 2] = Math.min(255, tint.b * 255 * light);
      data[i + 3] = Math.pow(density, dark ? 1.32 : 1.78) * 255 * (dark ? 0.68 : 0.88);
    }
  x.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}
