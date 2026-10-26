// Decorates artificial worldship bodies.
import * as THREE from 'three';
import { TYPES } from '../celestial-catalog.ts';
import { seeded } from '../physics/body-math.ts';
import { disposeObject } from '../scene/dispose.ts';
import type { Body } from '../state/types.ts';

export function dressWorldship(b: Body) {
  for (const child of [...b.mesh.children])
    if (child !== b.label) {
      b.mesh.remove(child);
      disposeObject(child);
    }
  const ship = new THREE.Group();
  ship.name = 'worldshipModel';
  const hull = new THREE.MeshStandardMaterial({ color: 0x6b6156, metalness: 0.55, roughness: 0.5, emissive: 0x221a14 }),
    trim = new THREE.MeshStandardMaterial({ color: 0x9a7a4a, metalness: 0.8, roughness: 0.32, emissive: 0x3a2608 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.78, 0.22, 64), hull);
  ship.add(base);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.84, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2), hull);
  dome.position.y = 0.1;
  dome.scale.y = 0.72;
  ship.add(dome);
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.05, 8, 64), trim);
  crown.rotation.x = Math.PI / 2;
  crown.position.y = 0.1;
  ship.add(crown);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.2, 2.1, 20), trim);
  spire.rotation.x = Math.PI;
  spire.position.y = -1.15;
  ship.add(spire);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2,
      tower = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.32 + ((i * 5) % 3) * 0.09, 8), trim);
    tower.position.set(Math.cos(a) * 0.9, 0.28, Math.sin(a) * 0.9);
    ship.add(tower);
    const hang = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.5 + ((i * 7) % 4) * 0.12, 8), hull);
    hang.rotation.x = Math.PI;
    hang.position.set(Math.cos(a) * 0.62, -0.38, Math.sin(a) * 0.62);
    ship.add(hang);
  }
  const lights = new Float32Array(700 * 3);
  for (let i = 0; i < 700; i++) {
    const u = seeded(b.id + i, 3),
      v = seeded(b.id + i, 5),
      theta = u * Math.PI * 2,
      phi = Math.acos(1 - v * 0.95),
      r = 0.86;
    lights[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    lights[i * 3 + 1] = 0.1 + Math.cos(phi) * r * 0.72;
    lights[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
  }
  const lightGeometry = new THREE.BufferGeometry();
  lightGeometry.setAttribute('position', new THREE.BufferAttribute(lights, 3));
  ship.add(
    new THREE.Points(
      lightGeometry,
      new THREE.PointsMaterial({
        color: 0xffc36b,
        size: 0.022,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    ),
  );
  const engine = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xb79bff, toneMapped: false }),
  );
  engine.position.set(-1, 0, 0);
  ship.add(engine);
  const wake = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 6, 32, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x8d7cff,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  wake.name = 'warpWake';
  wake.rotation.z = -Math.PI / 2;
  wake.position.x = -3.9;
  ship.add(wake);
  ship.scale.setScalar(TYPES[b.kind].radius * 1.05);
  b.mesh.add(ship);
}

/** A human warship: a long dark hull with cathedral-like spires, nose along +x and engines at -x. */
export function dressWarship(b: Body) {
  for (const child of [...b.mesh.children])
    if (child !== b.label) {
      b.mesh.remove(child);
      disposeObject(child);
    }
  const ship = new THREE.Group();
  ship.name = 'warshipModel';
  const hull = new THREE.MeshStandardMaterial({ color: 0x5d636e, metalness: 0.7, roughness: 0.38, emissive: 0x0d1018 }),
    trim = new THREE.MeshStandardMaterial({ color: 0xb9b2a2, metalness: 0.85, roughness: 0.28, emissive: 0x1a1812 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.22, 0.34), hull);
  ship.add(body);
  const prow = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.7, 4), hull);
  prow.rotation.z = -Math.PI / 2;
  prow.rotation.x = Math.PI / 4;
  prow.position.x = 1.18;
  ship.add(prow);
  const keel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.12), trim);
  keel.position.set(-0.1, -0.16, 0);
  ship.add(keel);
  for (let i = 0; i < 6; i++) {
    const height = 0.22 + ((i * 5 + b.id) % 4) * 0.08 + (i === 2 ? 0.22 : 0),
      spire = new THREE.Mesh(new THREE.ConeGeometry(0.05, height, 6), trim);
    spire.position.set(0.55 - i * 0.22, 0.11 + height / 2, 0);
    ship.add(spire);
  }
  const lights = new Float32Array(60 * 3);
  for (let i = 0; i < 60; i++) {
    lights[i * 3] = (seeded(b.id + i, 11) - 0.5) * 1.6;
    lights[i * 3 + 1] = (seeded(b.id + i, 13) - 0.5) * 0.2;
    lights[i * 3 + 2] = seeded(b.id + i, 17) > 0.5 ? 0.175 : -0.175;
  }
  const lightGeometry = new THREE.BufferGeometry();
  lightGeometry.setAttribute('position', new THREE.BufferAttribute(lights, 3));
  ship.add(
    new THREE.Points(
      lightGeometry,
      new THREE.PointsMaterial({
        color: 0xfff0c8,
        size: 0.03,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    ),
  );
  for (const z of [-0.1, 0.1]) {
    const engine = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x8fd0ff, toneMapped: false }),
    );
    engine.position.set(-0.88, 0, z);
    ship.add(engine);
  }
  ship.scale.setScalar(TYPES[b.kind].radius);
  b.mesh.add(ship);
}
