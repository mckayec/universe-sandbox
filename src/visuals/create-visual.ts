// Builds the Three.js group for each body kind and stage.
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { buildNebulaVisual } from '../nebula-hd.ts';
import {
  BLACK_HOLE_VARIANTS,
  DWARF_VARIANTS,
  GAS_VARIANTS,
  MOON_VARIANTS,
  ROCKY_VARIANTS,
  STAGES,
  TYPES,
  type Kind,
} from '../celestial-catalog.ts';
import { seeded } from '../physics/body-math.ts';
import { deviceTier, isCompact } from '../scene/setup.ts';
import { app } from '../state/app-state.ts';
import type { Stage } from '../state/types.ts';
import { addRelativisticJets } from './jets.ts';
import {
  NOISE_GLSL,
  addGlow,
  atmosphereMaterial,
  blackHoleDiskMaterial,
  gasMaterial,
  protostarDiskMaterial,
  rockyMaterial,
  stellarMaterial,
} from './materials.ts';
import { coronaTexture } from './textures.ts';

export function createVisual(kind: Kind, stage: Stage = 'red dwarf', seed = 1) {
  const t = TYPES[kind],
    group = new THREE.Group();
  group.userData.kind = kind;
  if (kind === 'nebula')
    return buildNebulaVisual(group, seed, { tier: deviceTier, compact: isCompact, quality: app.qualityScale });
  if (kind === 'blackhole') {
    const variant = seed % BLACK_HOLE_VARIANTS.length,
      spin = variant % 2 ? 1 : -1,
      diskScale = [0.84, 1, 1.14, 1.32][variant],
      diskTilt = [2.38, 2.52, 2.28, 2.62][variant],
      segments = isCompact ? 112 : 192,
      baseActivity = [0.08, 0.26, 0.56, 0.78][variant];
    const horizon = new THREE.Mesh(
      new THREE.SphereGeometry(t.radius * 0.7, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        fog: false,
        toneMapped: false,
        transparent: true,
        opacity: 1,
        // Depth-tested so bodies in front of the black hole hide it; the high renderOrder still draws it over
        // the additive disks (which never write depth), keeping the shadow-on-disk look.
        depthTest: true,
        depthWrite: false,
      }),
    );
    horizon.name = 'eventHorizon';
    horizon.renderOrder = 30;
    group.add(horizon);
    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(t.radius * 1.28, 48, 34),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { time: { value: 0 } },
        vertexShader: `varying vec3 n;varying vec3 p;void main(){n=normalize(normalMatrix*normal);p=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 n;varying vec3 p;uniform float time;void main(){float rim=pow(1.-abs(n.z),5.6);float arcs=.5+.5*sin(atan(p.y,p.x)*5.+time*.22);vec3 tint=mix(vec3(1.,.46,.12),vec3(1.,.96,.78),arcs);float alpha=rim*(.1+arcs*.16);gl_FragColor=vec4(tint*(.72+arcs*.7),alpha);}`,
        toneMapped: false,
      }),
    );
    lens.name = 'lensingShell';
    lens.raycast = () => {};
    group.add(lens);
    const tilt = Math.PI / diskTilt,
      inner = t.radius * 0.86,
      hotOuter = t.radius * 4.9 * diskScale,
      disk = new THREE.Mesh(
        new THREE.RingGeometry(inner, hotOuter, segments, 18),
        blackHoleDiskMaterial(inner, hotOuter, 0, variant),
      );
    disk.rotation.set(tilt, 0, 0.1);
    disk.name = 'accretionDiskHot';
    disk.userData.spin = spin * (0.88 + variant * 0.12);
    disk.userData.baseActivity = baseActivity;
    disk.renderOrder = 5;
    disk.raycast = () => {};
    group.add(disk);
    const midInner = t.radius * 1.35,
      midOuter = t.radius * 7.4 * diskScale,
      midDisk = new THREE.Mesh(
        new THREE.RingGeometry(midInner, midOuter, segments, 16),
        blackHoleDiskMaterial(midInner, midOuter, 1, variant),
      );
    midDisk.rotation.set(tilt + 0.018, -0.012, -0.2);
    midDisk.name = 'accretionDiskMid';
    midDisk.userData.spin = -spin * (0.31 + variant * 0.05);
    midDisk.userData.baseActivity = baseActivity;
    midDisk.renderOrder = 4;
    midDisk.raycast = () => {};
    group.add(midDisk);
    const dustInner = t.radius * 2.45,
      dustOuter = t.radius * 11.8 * diskScale,
      dustDisk = new THREE.Mesh(
        new THREE.RingGeometry(dustInner, dustOuter, segments, isCompact ? 12 : 20),
        blackHoleDiskMaterial(dustInner, dustOuter, 2, variant),
      );
    dustDisk.rotation.set(tilt - 0.025, 0.018, 0.34);
    dustDisk.name = 'accretionDiskDust';
    dustDisk.userData.spin = spin * (0.08 + variant * 0.018);
    dustDisk.userData.baseActivity = baseActivity;
    dustDisk.renderOrder = 2;
    dustDisk.raycast = () => {};
    group.add(dustDisk);
    const photon = new THREE.Mesh(
      new THREE.TorusGeometry(t.radius * 0.91, t.radius * 0.045, 10, 128),
      new THREE.MeshBasicMaterial({
        color: 0xfff8dd,
        transparent: true,
        opacity: 0.96,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    photon.rotation.x = tilt;
    photon.name = 'photonRing';
    photon.raycast = () => {};
    group.add(photon);
    for (const [tiltOffset, color, opacity] of [
      [-0.36, 0xffa844, 0.25],
      [0.36, 0xfff0bd, 0.38],
    ] as const) {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(t.radius * 1.35, 0.026, 7, 112, Math.PI * 1.46),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      arc.rotation.set(tilt, tiltOffset, tiltOffset * 0.32);
      arc.name = 'lensingArc';
      arc.raycast = () => {};
      group.add(arc);
    }
    const count = isCompact ? 52 : 108,
      pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2,
        r = t.radius * (1.25 + Math.random() * 5.2 * diskScale);
      pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.16, Math.sin(a) * r], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const inflow = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: variant > 1 ? 0xfff0c2 : 0xffb057,
        size: 0.1,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    inflow.name = 'inflow';
    inflow.userData.phase = Math.random() * 10;
    inflow.raycast = () => {};
    group.add(inflow);
    addRelativisticJets(
      group,
      'blackHoleJets',
      variant === 3 ? 0xf4f5ff : 0xd8efff,
      10.5 + variant * 3.2,
      seed,
      variant >= 2 ? 0.28 + variant * 0.08 : 0,
    );
    const warmGlow = addGlow(group, '#ff8a33', t.radius * (6.2 + variant * 0.7), 0.075),
      innerGlow = addGlow(group, '#fff6de', t.radius * 3.2, 0.16);
    warmGlow.name = 'blackHoleWarmGlow';
    innerGlow.name = 'blackHoleInnerGlow';
    warmGlow.raycast = innerGlow.raycast = () => {};
    return group;
  }
  const stellar = STAGES.find(s => s.stage === stage)!,
    material =
      kind === 'star'
        ? stellarMaterial(stellar.color, stellar, seed)
        : kind === 'brown'
          ? stellarMaterial(t.color, undefined, seed)
          : kind === 'gas'
            ? gasMaterial(seed)
            : kind === 'rocky' || kind === 'dwarf' || kind === 'moon'
              ? rockyMaterial(seed)
              : kind === 'pulsar' || kind === 'protostar'
                ? stellarMaterial(t.color, undefined, seed)
                : new THREE.MeshStandardMaterial({
                    color: t.color,
                    roughness: kind === 'comet' ? 0.72 : 0.96,
                    metalness: kind === 'asteroid' ? 0.12 : 0.02,
                    flatShading: kind === 'asteroid' || kind === 'comet',
                  }),
    geometry =
      kind === 'asteroid' || kind === 'comet'
        ? new THREE.DodecahedronGeometry(t.radius, kind === 'comet' ? 1 : 0)
        : new THREE.SphereGeometry(
            t.radius,
            kind === 'rocky' || kind === 'dwarf' || kind === 'moon' ? 32 : 48,
            kind === 'rocky' || kind === 'dwarf' || kind === 'moon' ? 24 : 36,
          ),
    sphere = new THREE.Mesh(geometry, material);
  sphere.name = 'bodySurface';
  if (kind === 'asteroid') sphere.scale.set(1.3, 0.72, 0.92);
  if (kind === 'comet') sphere.scale.set(1.18, 0.76, 0.88);
  group.add(sphere);
  if (kind === 'star') {
    const haloSize = t.radius * stellar.glowSize;
    addGlow(group, stellar.css, haloSize, stellar.glowOpacity);
    const coronaRays = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coronaTexture(stellar.css, Math.abs(Math.floor(seed)) % 3),
        transparent: true,
        opacity: 0.2 + stellar.glowOpacity * 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        rotation: seeded(seed, 90) * Math.PI,
      }),
    );
    coronaRays.scale.setScalar(haloSize * (stage === 'giant' || stage === 'hypergiant' ? 1.3 : 1.05));
    coronaRays.name = 'coronaRays';
    group.add(coronaRays);
    if (stellar.temperature >= 8000) {
      const vertical = addGlow(group, stellar.css, haloSize * 1.15, stellar.temperature > 12000 ? 0.3 : 0.2),
        horizontal = addGlow(group, '#ffffff', haloSize * 0.9, stellar.temperature > 12000 ? 0.22 : 0.13);
      vertical.scale.set(haloSize * 0.13, haloSize * 1.65, 1);
      horizontal.scale.set(haloSize * 1.35, haloSize * 0.1, 1);
    }
    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(t.radius * (1 + stellar.corona), 40, 30),
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(stellar.color) },
          frequency: { value: stellar.granules * 0.75 },
          activity: { value: 0.7 + stellar.turbulence * 4 },
        },
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `varying vec3 n;varying vec3 p;void main(){n=normalize(normalMatrix*normal);p=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 n;varying vec3 p;uniform float time;uniform vec3 color;uniform float frequency;uniform float activity;${NOISE_GLSL}void main(){float rim=pow(1.-abs(n.z),2.25);float f=.3+.7*noise(p*frequency+time*(.18+activity*.15));gl_FragColor=vec4(color*(1.05+f*activity),rim*f*(.25+activity*.16));}`,
        toneMapped: false,
      }),
    );
    corona.name = 'stellarCorona';
    group.add(corona);
    if (stage === 'giant' || stage === 'hypergiant') {
      const shellCount = stage === 'hypergiant' ? 2 : 1;
      for (let i = 0; i < shellCount; i++) {
        const shell = new THREE.Mesh(
          new THREE.SphereGeometry(t.radius * (1.12 + i * 0.11), 28, 20),
          new THREE.MeshBasicMaterial({
            color: stellar.color,
            transparent: true,
            opacity: 0.035 - i * 0.009,
            side: THREE.BackSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          }),
        );
        shell.name = 'stellarShell';
        group.add(shell);
      }
    }
    const hz = new THREE.Mesh(
      new THREE.RingGeometry(1, 2, 128),
      new THREE.MeshBasicMaterial({
        color: 0x55d6a0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.042,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    hz.rotation.x = -Math.PI / 2;
    hz.name = 'habitableZone';
    hz.visible = false;
    hz.raycast = () => {};
    group.add(hz);
    const zoneLabelElement = document.createElement('div');
    zoneLabelElement.className = 'habitable-zone-label';
    zoneLabelElement.textContent = 'POTENTIAL LIQUID-WATER ZONE';
    const zoneLabel = new CSS2DObject(zoneLabelElement);
    zoneLabel.name = 'habitableZoneLabel';
    zoneLabel.visible = false;
    group.add(zoneLabel);
    for (let i = 0; i < stellar.prominences; i++) {
      const spread = stellar.prominences > 4 ? 0.12 : 0.08,
        prom = new THREE.Mesh(
          new THREE.TorusGeometry(
            t.radius * (1.06 + i * spread),
            Math.max(0.025, 0.025 + stellar.turbulence * 0.12),
            7,
            38,
            Math.PI * (0.35 + Math.random() * 0.55),
          ),
          new THREE.MeshBasicMaterial({
            color: stellar.color,
            transparent: true,
            opacity: 0.48 + stellar.turbulence,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          }),
        );
      prom.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      prom.name = 'prominence';
      prom.userData.spin = 0.08 + Math.random() * 0.18;
      group.add(prom);
    }
  } else if (kind === 'protostar') {
    const glow = addGlow(group, t.css, t.radius * 3.2, 0.24);
    glow.name = 'protoGlow';
    glow.userData.baseOpacity = 0.24;
    const inner = t.radius * 1.32,
      outer = t.radius * 5.1,
      disk = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 88, 10), protostarDiskMaterial(inner, outer));
    disk.rotation.x = Math.PI / 2.38;
    disk.scale.setScalar(0.06);
    disk.name = 'protoDisk';
    group.add(disk);
    const jets = new THREE.Group();
    for (const sign of [-1, 1]) {
      const jet = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 2.7, 14, 1, true),
        new THREE.MeshBasicMaterial({
          color: 0x8fd8ff,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        }),
      );
      jet.position.y = sign * 1.35;
      jet.rotation.z = sign < 0 ? Math.PI : 0;
      jets.add(jet);
    }
    jets.name = 'protoJets';
    jets.scale.setScalar(0.05);
    group.add(jets);
  } else if (kind === 'pulsar') {
    addGlow(group, t.css, t.radius * 6, 0.5);
    addRelativisticJets(group, 'pulsarBeams', 0x9edcff, 10.5, seed, 0.72);
    const equator = new THREE.Mesh(
      new THREE.TorusGeometry(t.radius * 1.35, 0.05, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x9edcff, blending: THREE.AdditiveBlending, toneMapped: false }),
    );
    equator.rotation.x = Math.PI / 2;
    group.add(equator);
  } else if (kind === 'brown') {
    addGlow(group, t.css, t.radius * 5.2, 0.28);
    const belt = new THREE.Mesh(
      new THREE.TorusGeometry(t.radius * 1.08, 0.035, 7, 64),
      new THREE.MeshBasicMaterial({
        color: 0xff9a5f,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    belt.rotation.x = Math.PI / 2;
    group.add(belt);
  } else if (kind === 'asteroid') {
    for (let i = 0; i < 3; i++) {
      const crater = new THREE.Mesh(
        new THREE.TorusGeometry(t.radius * (0.1 + seeded(seed, i) * 0.08), 0.012, 5, 14),
        new THREE.MeshBasicMaterial({ color: 0x312e2b, transparent: true, opacity: 0.65 }),
      );
      crater.position.set(
        (seeded(seed, i + 10) - 0.5) * t.radius * 1.3,
        (seeded(seed, i + 20) - 0.5) * t.radius * 0.7,
        t.radius * 0.72,
      );
      crater.rotation.set(seeded(seed, i + 30) - 0.5, 0, (seeded(seed, i + 40) - 0.5) * Math.PI);
      crater.name = 'asteroidCrater';
      group.add(crater);
    }
  } else if (kind === 'comet') {
    const coma = addGlow(group, '#bdeeff', t.radius * 5.6, 0.2);
    coma.name = 'cometComa';
    const count = isCompact ? 48 : 90,
      positions = new Float32Array(count * 3),
      colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = Math.pow(seeded(seed, i + 70), 0.58) * (5.5 + seeded(seed, i + 160) * 3),
        spread = 0.12 + x * 0.12,
        a = seeded(seed, i + 250) * Math.PI * 2,
        r = seeded(seed, i + 340) * spread;
      positions.set([x, Math.cos(a) * r, Math.sin(a) * r], i * 3);
      const c = new THREE.Color(i % 4 ? 0x8fd9ff : 0xffffff);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const tailGeometry = new THREE.BufferGeometry();
    tailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    tailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const tail = new THREE.Points(
      tailGeometry,
      new THREE.PointsMaterial({
        size: isCompact ? 0.1 : 0.13,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    tail.name = 'cometTail';
    tail.userData.baseOpacity = 0.7;
    group.add(tail);
  } else if (kind === 'dwarf' || kind === 'moon') {
    const variant = seed % (kind === 'moon' ? MOON_VARIANTS.length : DWARF_VARIANTS.length);
    if (kind === 'dwarf' && [1, 3, 4].includes(variant)) {
      const colors = [0, 0xaed8f2, 0, 0xdce8ff, 0x83dce8],
        atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(t.radius * 1.04, 28, 20),
          atmosphereMaterial(colors[variant], variant === 4 ? 0.16 : 0.09, seed, variant === 4),
        );
      atmosphere.name = 'planetAtmosphere';
      group.add(atmosphere);
    }
    if (kind === 'dwarf' && variant === 2) {
      sphere.scale.set(1.42, 0.7, 0.92);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(t.radius * 1.3, t.radius * 2.05, 64),
        new THREE.MeshBasicMaterial({
          color: 0xb8aa9d,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.26,
          depthWrite: false,
        }),
      );
      ring.rotation.x = Math.PI / 2.4;
      ring.rotation.z = 0.22;
      group.add(ring);
    }
    if (kind === 'moon' && variant === 2) addGlow(group, '#ff7a3c', t.radius * 2.3, 0.08);
  } else if (kind === 'gas') {
    const variant = seed % GAS_VARIANTS.length,
      atmosphereColor = [
        0xf2c98b, 0xf5dfb0, 0x9de7ed, 0x69aef2, 0xff8c62, 0xf4eee2, 0x4f9eff, 0xffc459, 0xf29abb, 0x7cc7cc,
      ][variant];
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(t.radius * 1.055, 36, 26),
      atmosphereMaterial(
        atmosphereColor,
        variant === 4 ? 0.3 : 0.19,
        seed,
        variant === 1 || variant === 5 || variant === 9,
      ),
    );
    atmosphere.name = 'planetAtmosphere';
    group.add(atmosphere);
    if (variant === 1 || variant === 7 || seeded(seed, 8) > 0.72) {
      const outer = variant === 1 ? 2.45 : variant === 7 ? 2.8 : 2.08,
        ring = new THREE.Mesh(
          new THREE.RingGeometry(t.radius * 1.38, t.radius * outer, 72),
          new THREE.MeshBasicMaterial({
            color: variant === 1 ? 0xe8d2a7 : variant === 7 ? 0xdca84f : 0xaecbd4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: variant === 1 ? 0.38 : variant === 7 ? 0.27 : 0.16,
            depthWrite: false,
          }),
        );
      ring.rotation.x = Math.PI / (2.25 + seeded(seed, 3) * 0.7);
      ring.rotation.z = (seeded(seed, 5) - 0.5) * 0.45;
      group.add(ring);
    }
  } else if (kind === 'rocky') {
    const variant = seed % ROCKY_VARIANTS.length;
    if ([2, 3, 4].includes(variant)) {
      const colors = [0, 0, 0xffd58a, 0x65b9ff, 0xbdefff],
        atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(t.radius * 1.045, 32, 24),
          atmosphereMaterial(colors[variant], variant === 2 ? 0.32 : 0.2, seed, variant === 2 || variant === 3),
        );
      atmosphere.name = 'planetAtmosphere';
      group.add(atmosphere);
    }
    if (variant === 5) addGlow(group, '#ff4b1e', t.radius * 3.2, 0.13);
  }
  return group;
}
