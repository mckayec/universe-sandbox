// Relativistic jets for black holes and pulsars.
import * as THREE from 'three';
import { seeded } from '../physics/body-math.ts';
import { isCompact } from '../scene/setup.ts';
import { app, matterStreams } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { jetMaterial } from './materials.ts';
import { glowTexture } from './textures.ts';

export function addRelativisticJets(
  parent: THREE.Group,
  name: string,
  color: number,
  length: number,
  seed: number,
  baseline = 0,
) {
  const jets = new THREE.Group(),
    blackHoleJet = name === 'blackHoleJets' || name === 'birthJets';
  jets.name = name;
  jets.userData.spin = (seed % 2 ? 1 : -1) * (blackHoleJet ? 0.035 : 0.16);
  jets.userData.baseline = baseline;
  jets.userData.length = length;
  jets.rotation.z = blackHoleJet ? 0.035 + (seeded(seed, 31) - 0.5) * 0.07 : 0.2 + (seeded(seed, 31) - 0.5) * 0.38;
  for (const sign of [-1, 1]) {
    const lobe = new THREE.Group();
    lobe.position.y = sign * length * 0.5;
    lobe.rotation.z = sign < 0 ? Math.PI : 0;
    const sheathRadius = blackHoleJet ? length * 0.022 : length * 0.06,
      spineRadius = blackHoleJet ? Math.max(0.018, length * 0.006) : length * 0.018,
      sheath = new THREE.Mesh(
        new THREE.CylinderGeometry(sheathRadius * 0.58, sheathRadius, length, 20, 1, true),
        jetMaterial(color, blackHoleJet ? 0.24 : 0.36),
      ),
      spine = new THREE.Mesh(
        new THREE.CylinderGeometry(spineRadius * 0.72, spineRadius, length * 0.99, 14, 1, true),
        jetMaterial(0xffffff, blackHoleJet ? 1 : 0.82, blackHoleJet),
      );
    sheath.name = 'jetSheath';
    spine.name = 'jetSpine';
    lobe.add(sheath, spine);
    if (!blackHoleJet)
      for (let i = 1; i <= 3; i++) {
        const knot = new THREE.Mesh(
          new THREE.TorusGeometry(length * (0.035 + i * 0.006), Math.max(0.018, length * 0.003), 6, 32),
          new THREE.MeshBasicMaterial({
            color: i === 1 ? 0xffffff : color,
            transparent: true,
            opacity: 0.24,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          }),
        );
        knot.rotation.x = Math.PI / 2;
        knot.position.y = -length * 0.48 + i * length * 0.23;
        knot.name = 'jetKnot';
        lobe.add(knot);
      }
    jets.add(lobe);
  }
  const count = isCompact ? (blackHoleJet ? 30 : 38) : blackHoleJet ? 64 : 86,
    positions = new Float32Array(count * 3),
    phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const sign = i % 2 ? 1 : -1,
      phase = seeded(seed, i + 210),
      spread = blackHoleJet ? 0.055 : 0.18;
    phases[i] = phase;
    positions.set(
      [(seeded(seed, i + 430) - 0.5) * spread, sign * (0.3 + phase * length), (seeded(seed, i + 620) - 0.5) * spread],
      i * 3,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color,
      size: isCompact ? 0.065 : blackHoleJet ? 0.075 : 0.11,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  particles.name = 'jetParticles';
  particles.userData.phases = phases;
  particles.userData.length = length;
  jets.add(particles);
  if (blackHoleJet) {
    const launch = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture('#fff8df'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    launch.scale.set(1.2, 2.8, 1);
    launch.name = 'jetLaunchFlare';
    jets.add(launch);
  }
  jets.traverse(child => {
    child.raycast = () => {};
  });
  parent.add(jets);
  return jets;
}
export function animateRelativisticJets(jets: THREE.Object3D, body: Body, dt: number, pulsar = false) {
  let streamEnergy = 0;
  for (const stream of matterStreams.values())
    if (stream.receiverId === body.id) streamEnergy = Math.max(streamEnergy, stream.intensity);
  const baseline = Number(jets.userData.baseline ?? 0),
    pulse = pulsar ? 0.62 + 0.38 * Math.pow(Math.max(0, Math.sin(app.elapsed * 6.4 + body.id)), 8) : 1,
    rawIntensity = pulsar ? baseline : baseline + Math.pow(streamEnergy, 0.72) * 1.18,
    intensity = THREE.MathUtils.clamp(rawIntensity * pulse, 0, 1);
  jets.visible = intensity > 0.018;
  jets.rotation.y += dt * Number(jets.userData.spin ?? 0.16);
  if (pulsar) {
    jets.rotation.z = 0.35 + Math.sin(app.elapsed * 2.7 + body.id) * 0.19;
    jets.rotation.x = Math.sin(app.elapsed * 1.9 + body.id * 0.7) * 0.12;
  }
  if (!pulsar)
    body.mesh.traverse(child => {
      if (!child.name.startsWith('accretionDisk')) return;
      const material = (child as THREE.Mesh).material;
      if (material instanceof THREE.ShaderMaterial && material.uniforms.activity)
        material.uniforms.activity.value = THREE.MathUtils.lerp(
          material.uniforms.activity.value,
          Math.max(Number(child.userData.baseActivity ?? 0.12), intensity),
          Math.min(1, dt * 2.8),
        );
    });
  jets.traverse(child => {
    const material = (child as THREE.Mesh).material;
    if (material instanceof THREE.ShaderMaterial && material.uniforms.intensity) {
      material.uniforms.intensity.value = intensity;
      material.uniforms.time.value += dt;
    }
    if (child.name === 'jetKnot' && material instanceof THREE.MeshBasicMaterial)
      material.opacity = 0.07 + 0.28 * intensity;
    if (child.name === 'jetLaunchFlare' && child instanceof THREE.Sprite) {
      child.scale.set(0.8 + intensity * 1.5, 1.7 + intensity * 3.4, 1);
      (child.material as THREE.SpriteMaterial).opacity = 0.12 + intensity * 0.72;
    }
    if (child.name === 'jetParticles' && child instanceof THREE.Points) {
      const attribute = child.geometry.getAttribute('position') as THREE.BufferAttribute,
        length = Number(child.userData.length ?? 10);
      for (let i = 0; i < attribute.count; i++) {
        const sign = attribute.getY(i) >= 0 ? 1 : -1;
        let y = attribute.getY(i) + sign * dt * length * (0.72 + intensity * 1.65);
        if (Math.abs(y) > length) y = sign * 0.28;
        attribute.setXYZ(
          i,
          attribute.getX(i) + Math.sin(app.elapsed * 9 + i) * dt * 0.004,
          y,
          attribute.getZ(i) + Math.cos(app.elapsed * 7 + i) * dt * 0.004,
        );
      }
      attribute.needsUpdate = true;
      (material as THREE.PointsMaterial).opacity = 0.12 + 0.78 * intensity;
    }
  });
}
