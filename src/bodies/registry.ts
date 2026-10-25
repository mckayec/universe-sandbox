// Creating bodies: names, labels, trails and addBody.
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { stellarBirthStage } from '../simulation-model.ts';
import { TYPES, VARIANT_COUNTS, type Kind, type Placeable } from '../celestial-catalog.ts';
import { updateCount, updateScale } from './lifecycle.ts';
import { formatMass, seeded } from '../physics/body-math.ts';
import { isCompact, scene } from '../scene/setup.ts';
import { app, bodies, trails } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { createVisual } from '../visuals/create-visual.ts';
import { dressWorldship } from '../visuals/worldship.ts';

export function nameFor(kind: Kind, id: number) {
  return `${({ asteroid: 'Aster', comet: 'Comet', moon: 'Luna', dwarf: 'Nix', rocky: 'Terra', gas: 'Jovia', brown: 'Ember', star: 'Helios', protostar: 'Seed', pulsar: 'Beacon', blackhole: 'Void', nebula: 'Cloud' } as Record<Kind, string>)[kind]} ${String(id).padStart(2, '0')}`;
}
function makeBodyLabel(name: string) {
  const el = document.createElement('div');
  el.className = 'object-label';
  el.innerHTML = `<strong>${name}</strong><span></span><em></em>`;
  const label = new CSS2DObject(el);
  label.center.set(0.5, 1);
  return label;
}
export function updateBodyLabel(b: Body) {
  const title = b.label.element.querySelector('strong'),
    metrics = b.label.element.querySelector('span'),
    life = b.label.element.querySelector('em');
  if (title) title.textContent = b.name;
  if (metrics) metrics.textContent = `${formatMass(b.mass)} M⊕ · Ø${(b.radius * 2).toFixed(1)}u`;
  if (life) {
    life.textContent = b.lifeLevel === 'none' ? '' : `LIFE · ${b.lifeLevel.toUpperCase()}`;
    life.classList.toggle('show', b.lifeLevel !== 'none');
  }
  b.label.position.set(0, TYPES[b.kind].radius + 2.1, 0);
}
function trailMaterial(color: number) {
  return new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, opacity: { value: 0.34 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: `attribute float trailAge;varying float vAge;void main(){vAge=trailAge;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform vec3 color;uniform float opacity;varying float vAge;void main(){float fade=smoothstep(0.,.22,vAge)*(.22+.78*vAge*vAge);gl_FragColor=vec4(color*(.7+.45*vAge),opacity*fade);}`,
  });
}
export function makeTrail(b: Body) {
  if (b.kind === 'nebula') return;
  const capacity = isCompact ? 42 : 72,
    geo = new THREE.BufferGeometry(),
    positions = new Float32Array(capacity * 3),
    ages = new Float32Array(capacity);
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('trailAge', new THREE.BufferAttribute(ages, 1));
  geo.setDrawRange(0, 1);
  const line = new THREE.Line(geo, trailMaterial(TYPES[b.kind].color));
  line.frustumCulled = false;
  line.visible = app.trailsEnabled;
  scene.add(line);
  trails.set(b.id, { line, points: [b.mesh.position.clone()], accumulator: 0 });
}
export function addBody(kind: Kind, pos: THREE.Vector3, vel = new THREE.Vector3(), o: Partial<Body> = {}) {
  const t = TYPES[kind],
    id = app.nextId++,
    name = nameFor(kind, id),
    variant = o.variant ?? (id * 7 + kind.length) % (VARIANT_COUNTS[kind as Placeable] ?? 10),
    mass = o.mass ?? t.mass,
    stage = kind === 'star' ? (o.stage ?? stellarBirthStage(mass)) : undefined,
    b: Body = {
      id,
      name,
      mesh: createVisual(kind, stage ?? 'red dwarf', variant + id * 60),
      label: makeBodyLabel(name),
      velocity: vel.clone(),
      mass,
      birthMass: o.birthMass ?? t.mass,
      radius: t.radius,
      kind,
      variant,
      locked: o.locked ?? false,
      buildLocked: o.buildLocked ?? false,
      age: o.age ?? 0,
      stage,
      stageAge: o.stageAge ?? 0,
      stageTransition: o.stageTransition,
      nebulaTimer: o.nebulaTimer ?? 0,
      accretionFx: o.accretionFx ?? 0,
      nebulaTidal: o.nebulaTidal ?? 0,
      nebulaCompression: o.nebulaCompression ?? 0,
      nebulaAngle: o.nebulaAngle ?? 0,
      nebulaContactId: o.nebulaContactId,
      hostId: o.hostId,
      protoAngle: o.protoAngle ?? Math.random() * Math.PI * 2,
      protoOrbit: o.protoOrbit ?? 1,
      protoDrift: o.protoDrift ?? (seeded(id, 41) - 0.5) * 0.18,
      tidalStretch: o.tidalStretch ?? 0,
      tidalAngle: o.tidalAngle ?? 0,
      tidalPartnerId: o.tidalPartnerId,
      tidalStrain: o.tidalStrain,
      tidalWarned: o.tidalWarned,
      debris: o.debris,
      lifeScore: o.lifeScore ?? 0,
      lifeLevel: o.lifeLevel ?? 'none',
      habitabilityShock: o.habitabilityShock ?? 0,
      habitatStatus: o.habitatStatus ?? 'No temperate conditions detected',
      surfaceTemperature: o.surfaceTemperature ?? 0,
      atmosphere: o.atmosphere ?? 0,
      water: o.water ?? 0,
      magnetosphere: o.magnetosphere ?? 0,
      collisionCooldown: o.collisionCooldown ?? 0,
      lastEvent: o.lastEvent ?? 'Placed in the simulation',
      artificial: o.artificial,
      warpBoost: o.warpBoost,
      exhibitSystemId: o.exhibitSystemId,
      exhibitAnchor: o.exhibitAnchor,
      holdStage: o.holdStage,
      satelliteHostId: o.satelliteHostId,
      satelliteOrbit: o.satelliteOrbit,
      satelliteAngle: o.satelliteAngle,
      satelliteRate: o.satelliteRate,
    };
  b.mesh.add(b.label);
  b.mesh.position.copy(pos);
  scene.add(b.mesh);
  bodies.push(b);
  if (b.artificial === 'worldship') dressWorldship(b);
  updateScale(b);
  makeTrail(b);
  updateCount();
  return b;
}
