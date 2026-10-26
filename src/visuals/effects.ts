// Transient visual effects: flashes, bursts, impacts, supernovae, ignition, accretion, bow shocks.
import * as THREE from 'three';
import { seeded } from '../physics/body-math.ts';
import { removeTransientObject } from '../scene/dispose.ts';
import { isCompact, scene } from '../scene/setup.ts';
import { app, transients } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { addRelativisticJets } from './jets.ts';
import { NOISE_GLSL } from './materials.ts';
import { SUPERNOVA_CLOUD_SEEDS, cloudTexture, coronaTexture, glowTexture } from './textures.ts';

function transient(object: THREE.Object3D, duration: number, update: (life: number, dt: number) => void) {
  scene.add(object);
  transients.push({ object, age: 0, duration, update });
}
function triggerFlash(intensity: number) {
  app.flashEnergy = Math.max(app.flashEnergy, intensity * (app.effectsMode === 'gentle' ? 0.28 : 1));
}
export function particleBurst(position: THREE.Vector3, color: number, count: number, power: number, duration = 2.4) {
  const actualCount = Math.max(8, Math.floor(count * (app.effectsMode === 'gentle' ? 0.42 : 1))),
    geo = new THREE.BufferGeometry(),
    pos = new Float32Array(actualCount * 3),
    vel: Array<THREE.Vector3> = [];
  for (let i = 0; i < actualCount; i++) {
    const v = new THREE.Vector3(Math.random() - 0.5, (Math.random() - 0.35) * 0.45, Math.random() - 0.5)
      .normalize()
      .multiplyScalar(power * (0.35 + Math.random() * 0.85));
    vel.push(v);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color,
      size: 0.16,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  pts.position.copy(position);
  transient(pts, duration, (life, dt) => {
    const a = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < actualCount; i++) {
      a.setXYZ(i, a.getX(i) + vel[i].x * dt, a.getY(i) + vel[i].y * dt, a.getZ(i) + vel[i].z * dt);
      vel[i].multiplyScalar(0.992);
    }
    a.needsUpdate = true;
    (pts.material as THREE.PointsMaterial).opacity = (1 - life) * 0.9;
  });
}
export function impactEffect(position: THREE.Vector3, color: number, intensity = 1) {
  triggerFlash(0.1 * intensity);
  const flare = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: coronaTexture('#fff1bb', 19),
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  flare.position.copy(position);
  flare.scale.setScalar(2.5 * intensity);
  transient(flare, 0.6, (life, dt) => {
    flare.scale.set((2.5 + life * 7) * intensity, (2.1 + life * 5) * intensity, 1);
    (flare.material as THREE.SpriteMaterial).opacity = Math.pow(1 - life, 1.7);
    (flare.material as THREE.SpriteMaterial).rotation += dt * 0.34;
  });
  particleBurst(position, color, isCompact ? 28 : 58, 2.8 * intensity, 1.65);
}
function supernovaBlastMaterial(seed: number, shell = false) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      life: { value: 0 },
      seed: { value: seed },
      shell: { value: shell ? 1 : 0 },
      hot: { value: new THREE.Color(shell ? 0x8cbcff : 0xffffff) },
      warm: { value: new THREE.Color(shell ? 0xff5e38 : 0xff8b2f) },
    },
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: `varying vec3 vP;varying vec3 vN;varying float vNoise;uniform float time;uniform float life;uniform float seed;uniform float shell;${NOISE_GLSL}void main(){vec3 p=position;float broad=noise(normal*2.3+vec3(time*.7,seed,0.));float detail=noise(normal*7.1-vec3(0.,time*1.15,seed));vNoise=broad*.72+detail*.28;p+=normal*((broad-.5)*.92+(detail-.5)*.28)*(1.-life*.5)*(1.+shell*.75);vP=normal;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec3 vP;varying vec3 vN;varying float vNoise;uniform float time;uniform float life;uniform float seed;uniform float shell;uniform vec3 hot;uniform vec3 warm;${NOISE_GLSL}void main(){float facing=abs(vN.z);float rim=pow(1.-facing,2.4);float knots=noise(vP*10.+vec3(seed,time*.45,0.));float filaments=smoothstep(.42,.78,vNoise+knots*.3);float inner=1.-smoothstep(.18,.98,life);vec3 color=mix(warm,hot,filaments*.62+inner*.35);float coreAlpha=(.36+filaments*.64)*pow(1.-life,2.25);float shellFade=1.-smoothstep(.14,.28,life);float shellAlpha=(rim*.13+filaments*.035)*pow(1.-life,1.18)*smoothstep(.01,.16,life)*shellFade;float alpha=mix(coreAlpha,shellAlpha,shell);if(alpha<.006)discard;float energy=mix(1.2+filaments*1.25+inner*1.5,.62+filaments*.56,shell);gl_FragColor=vec4(color*energy,alpha);}`,
  });
}
export function supernovaEffect(position: THREE.Vector3) {
  triggerFlash(isCompact ? 1.65 : 2.05);
  const root = new THREE.Group();
  root.position.copy(position);
  const seed = Math.random() * 20,
    cloudSeed = SUPERNOVA_CLOUD_SEEDS[Math.floor(seed) % SUPERNOVA_CLOUD_SEEDS.length],
    coreMat = supernovaBlastMaterial(seed),
    shellMat = supernovaBlastMaterial(seed + 8, true);
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, isCompact ? 28 : 48, isCompact ? 20 : 32), coreMat);
  root.add(core);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, isCompact ? 32 : 56, isCompact ? 22 : 36), shellMat);
  root.add(shell);
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: coronaTexture('#f4f8ff', 91),
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  flash.scale.setScalar(18);
  root.add(flash);
  const fireball = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture('#ff6f32'),
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  fireball.scale.setScalar(8);
  root.add(fireball);
  const remnant = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: cloudTexture('#ff673d', cloudSeed),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      rotation: seed,
    }),
  );
  remnant.scale.set(10, 8, 1);
  root.add(remnant);
  const hotRemnant = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: cloudTexture('#8eb8ff', cloudSeed + 7),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      rotation: -seed * 0.7,
    }),
  );
  hotRemnant.scale.set(8, 11, 1);
  root.add(hotRemnant);
  const lobeData: Array<{ mesh: THREE.Mesh; direction: THREE.Vector3; speed: number; twist: number }> = [];
  const lobeCount = Math.max(4, Math.floor((isCompact ? 6 : 10) * (app.effectsMode === 'gentle' ? 0.58 : 1)));
  for (let i = 0; i < lobeCount; i++) {
    const angle = (i / lobeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.58,
      direction = new THREE.Vector3(
        Math.cos(angle),
        (0.15 + Math.random() * 0.58) * (i % 2 ? 1 : -1),
        Math.sin(angle),
      ).normalize();
    const material = new THREE.MeshBasicMaterial({
      color: i % 3 === 0 ? 0xc7ddff : i % 3 === 1 ? 0xffd08a : 0xff6b37,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, isCompact ? 1 : 2), material);
    mesh.scale.set(1.2, 0.5, 0.5);
    root.add(mesh);
    lobeData.push({ mesh, direction, speed: 9 + Math.random() * 15, twist: (Math.random() - 0.5) * 3 });
  }
  const count = Math.floor((isCompact ? 460 : 1150) * (app.effectsMode === 'gentle' ? 0.45 : 1)),
    positions = new Float32Array(count * 3),
    colors = new Float32Array(count * 3),
    velocities: Array<THREE.Vector3> = [],
    delays = new Float32Array(count);
  const axes = Array.from({ length: 4 }, (_, i) =>
    new THREE.Vector3(
      Math.cos(seed + i * Math.PI * 0.73),
      (i - 1.5) * 0.13,
      Math.sin(seed + i * Math.PI * 0.73),
    ).normalize(),
  );
  for (let i = 0; i < count; i++) {
    const axis = axes[i % axes.length],
      direction = axis
        .clone()
        .multiplyScalar(0.62 + Math.random() * 0.82)
        .add(new THREE.Vector3(Math.random() - 0.5, (Math.random() - 0.5) * 0.75, Math.random() - 0.5))
        .normalize(),
      speed = (5 + Math.random() * 22) * (i % 13 === 0 ? 1.75 : 1);
    velocities.push(direction.multiplyScalar(speed));
    delays[i] = Math.random() * 0.18;
    const color = new THREE.Color(i % 7 === 0 ? 0xdbeaff : i % 3 === 0 ? 0xffd17f : 0xff6438);
    colors.set([color.r, color.g, color.b], i * 3);
  }
  const ejectaGeo = new THREE.BufferGeometry();
  ejectaGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  ejectaGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const ejecta = new THREE.Points(
    ejectaGeo,
    new THREE.PointsMaterial({
      size: isCompact ? 0.26 : 0.34,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    }),
  );
  root.add(ejecta);
  transient(root, 8.5, (life, dt) => {
    coreMat.uniforms.time.value += dt;
    coreMat.uniforms.life.value = Math.min(1, life * 2.75);
    shellMat.uniforms.time.value += dt;
    shellMat.uniforms.life.value = life;
    const burst = 1 - Math.pow(1 - Math.min(1, life * 3.2), 2.4);
    core.scale.set(2.2 + burst * 13, 2 + burst * 10.5, 2.2 + burst * 12);
    core.rotation.x += dt * 0.38;
    core.rotation.y += dt * 0.63;
    shell.scale.set(3 + life * 39, 2.6 + life * 31, 3 + life * 37);
    shell.rotation.x += dt * 0.055;
    shell.rotation.y -= dt * 0.07;
    flash.scale.setScalar(18 + Math.pow(life, 0.45) * 86);
    (flash.material as THREE.SpriteMaterial).opacity = Math.pow(Math.max(0, 1 - life * 2.8), 2.1);
    fireball.scale.setScalar(8 + Math.pow(life, 0.55) * 42);
    (fireball.material as THREE.SpriteMaterial).opacity = Math.pow(Math.max(0, 1 - life * 2.4), 1.35) * 0.88;
    const remnantRise = THREE.MathUtils.smoothstep(life, 0, 0.12);
    remnant.scale.set(10 + life * 50, 8 + life * 39, 1);
    hotRemnant.scale.set(8 + life * 37, 11 + life * 52, 1);
    (remnant.material as THREE.SpriteMaterial).rotation += dt * 0.055;
    (hotRemnant.material as THREE.SpriteMaterial).rotation -= dt * 0.038;
    (remnant.material as THREE.SpriteMaterial).opacity = remnantRise * Math.pow(1 - life, 1.28) * 0.24;
    (hotRemnant.material as THREE.SpriteMaterial).opacity = remnantRise * Math.pow(1 - life, 1.45) * 0.14;
    for (const lobe of lobeData) {
      const travel = Math.pow(life, 0.72) * lobe.speed;
      lobe.mesh.position.copy(lobe.direction).multiplyScalar(travel);
      lobe.mesh.rotation.y += dt * lobe.twist;
      lobe.mesh.scale.set(1.7 + life * 3.3, 0.55 + life * 0.8, 0.55 + life * 0.8);
      (lobe.mesh.material as THREE.MeshBasicMaterial).opacity = Math.pow(1 - life, 1.55) * 0.46;
    }
    const attr = ejectaGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      if (life < delays[i]) continue;
      attr.setXYZ(
        i,
        attr.getX(i) + velocities[i].x * dt,
        attr.getY(i) + velocities[i].y * dt,
        attr.getZ(i) + velocities[i].z * dt,
      );
      velocities[i].multiplyScalar(0.996);
    }
    attr.needsUpdate = true;
    (ejecta.material as THREE.PointsMaterial).opacity = Math.pow(1 - life, 0.72);
  });
}
export function compactBirthJetEffect(position: THREE.Vector3, outcome: 'pulsar' | 'blackhole') {
  const root = new THREE.Group();
  root.position.copy(position);
  const length = outcome === 'blackhole' ? 22 : 16,
    jets = addRelativisticJets(
      root,
      'birthJets',
      outcome === 'blackhole' ? 0xb89cff : 0x9ee9ff,
      length,
      Math.floor(position.x * 19 + position.z * 7 + 97),
      1,
    ),
    core = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coronaTexture('#ffffff', 117),
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
  core.scale.setScalar(outcome === 'blackhole' ? 8 : 6);
  root.add(core);
  transient(root, 6.5, (life, dt) => {
    jets.scale.set(1 + life * 0.7, 0.08 + Math.pow(life, 0.52) * 1.65, 1 + life * 0.7);
    jets.traverse(child => {
      const material = (child as THREE.Mesh).material;
      if (material instanceof THREE.ShaderMaterial && material.uniforms.intensity) {
        material.uniforms.time.value += dt;
        material.uniforms.intensity.value = Math.pow(1 - life, 0.72);
      }
      if (child.name === 'jetKnot' && material instanceof THREE.MeshBasicMaterial)
        material.opacity = Math.pow(1 - life, 1.2) * 0.34;
    });
    core.scale.setScalar((outcome === 'blackhole' ? 8 : 6) + life * 24);
    (core.material as THREE.SpriteMaterial).opacity = Math.pow(1 - life, 2.4);
    jets.rotation.y += dt * 0.42;
    jets.rotation.z += Math.sin(life * 18) * dt * 0.08;
  });
}
export function planetaryNebulaEffect(position: THREE.Vector3) {
  triggerFlash(0.62);
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: coronaTexture('#ffffff', 71),
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  flash.position.copy(position);
  flash.scale.setScalar(9);
  transient(flash, 2.1, (life, dt) => {
    flash.scale.setScalar(9 + life * 42);
    (flash.material as THREE.SpriteMaterial).opacity = Math.pow(1 - life, 2.3);
    (flash.material as THREE.SpriteMaterial).rotation += dt * 0.12;
  });
  for (let i = 0; i < 4; i++) {
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 22),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x73e2e8 : i === 1 ? 0xd58cff : 0x6b78ff,
        transparent: true,
        opacity: 0.25 - i * 0.035,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    shell.position.copy(position);
    shell.rotation.set(seeded(i + 4, 1) * Math.PI, seeded(i + 4, 2) * Math.PI, seeded(i + 4, 3) * Math.PI);
    transient(shell, 5.5 + i * 1.15, (life, dt) => {
      shell.scale.set(1.6 + life * (10 + i * 3), 1 + life * (6 + i * 1.7), 1.6 + life * (10 + i * 3));
      shell.rotation.y += dt * (i % 2 ? 0.08 : -0.06);
      (shell.material as THREE.MeshBasicMaterial).opacity = Math.pow(1 - life, 1.35) * (0.25 - i * 0.035);
    });
  }
  for (const sign of [-1, 1]) {
    const lobe = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 5, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: sign < 0 ? 0x66d9ff : 0xe692ff,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    lobe.position.copy(position);
    lobe.rotation.z = sign < 0 ? Math.PI : 0;
    transient(lobe, 6.8, life => {
      lobe.position.y = position.y + sign * life * 9;
      lobe.scale.set(1 + life * 3, 0.8 + life * 2.8, 1 + life * 3);
      (lobe.material as THREE.MeshBasicMaterial).opacity = Math.pow(1 - life, 1.4) * 0.24;
    });
  }
  particleBurst(position, 0x8ce5df, isCompact ? 100 : 220, 3.1, 5.8);
  particleBurst(position, 0xd78cff, isCompact ? 70 : 150, 2.2, 7.2);
}
export function stellarIgnitionEffect(position: THREE.Vector3, color: number, mass: number) {
  const strength = THREE.MathUtils.clamp(mass / 175, 0.75, 1.55);
  triggerFlash(0.86 * strength);
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: coronaTexture('#ffffff', 37),
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  flash.position.copy(position);
  flash.scale.setScalar(7 * strength);
  transient(flash, 1.55, (life, dt) => {
    flash.scale.set((7 + life * 35) * strength, (7 + life * 27) * strength, 1);
    (flash.material as THREE.SpriteMaterial).opacity = Math.pow(1 - life, 2.35) * 0.96;
    (flash.material as THREE.SpriteMaterial).rotation += dt * 0.24;
  });
  const fireball = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 4),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  fireball.position.copy(position);
  transient(fireball, 1.8, (life, dt) => {
    const contraction =
      life < 0.22 ? THREE.MathUtils.lerp(3.4, 0.78, life / 0.22) : THREE.MathUtils.lerp(0.78, 10, (life - 0.22) / 0.78);
    fireball.scale.setScalar(contraction * strength);
    fireball.rotation.x += dt * 0.7;
    fireball.rotation.y -= dt * 0.9;
    (fireball.material as THREE.MeshBasicMaterial).opacity = Math.pow(1 - life, 1.4) * 0.82;
  });
  for (let i = 0; i < 3; i++) {
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xffffff : color,
        wireframe: i === 2,
        transparent: true,
        opacity: 0.26,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    shell.position.copy(position);
    transient(shell, 2.3 + i * 0.35, (life, dt) => {
      const delay = Math.max(0, life - i * 0.055),
        pulse = THREE.MathUtils.smootherstep(delay, 0, 0.18);
      shell.scale.setScalar((0.35 + pulse * (13 + i * 3)) * strength);
      shell.rotation.x += dt * (0.22 + i * 0.08);
      shell.rotation.y -= dt * (0.18 + i * 0.06);
      (shell.material as THREE.MeshBasicMaterial).opacity = Math.sin(Math.min(1, delay) * Math.PI) * (0.28 - i * 0.055);
    });
  }
  particleBurst(position, 0xffffff, isCompact ? 70 : 140, 7.2 * strength, 2.2);
  particleBurst(position, color, isCompact ? 115 : 250, 4.8 * strength, 3.4);
}
export function nebulaAccretionEffect(cloud: Body, target: Body, density: number) {
  const start = cloud.mesh.position.clone(),
    end = target.mesh.position.clone(),
    axis = end.clone().sub(start),
    perp = new THREE.Vector3(-axis.z, 0, axis.x).normalize(),
    count = isCompact ? 8 : 15,
    geo = new THREE.BufferGeometry(),
    positions = new Float32Array(count * 3),
    phases = new Float32Array(count);
  for (let i = 0; i < count; i++) phases[i] = Math.random() * 0.74;
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: target.kind === 'blackhole' ? 0xffb06a : 0xd68cff,
      size: 0.1 + density * 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  transient(points, 0.72, life => {
    const attr = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const t = Math.min(1, phases[i] + life * 0.62),
        p = start.clone().lerp(end, t),
        curl = Math.sin((t * 4 + i) * 2.4) * (1 - t) * (0.35 + density * 0.9);
      p.addScaledVector(perp, curl).setY(0.12 + Math.sin(i * 2.1 + life * 9) * 0.12);
      attr.setXYZ(i, p.x, p.y, p.z);
    }
    attr.needsUpdate = true;
    (points.material as THREE.PointsMaterial).opacity = Math.sin(Math.PI * life) * (0.38 + density * 0.5);
  });
  const flare = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(target.kind === 'blackhole' ? '#ff9a4d' : '#cf80ff'),
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  flare.position.copy(end).setY(0.12);
  flare.scale.setScalar(0.8 + target.radius * 0.7);
  transient(flare, 0.48, life => {
    flare.scale.multiplyScalar(1 + 0.04 * (1 - life));
    (flare.material as THREE.SpriteMaterial).opacity = (1 - life) * 0.62 * density;
  });
}

export function nebulaBowShockEffect(cloud: Body, target: Body) {
  const relative = target.velocity.clone().sub(cloud.velocity),
    angle = Math.atan2(relative.z, relative.x),
    shock = new THREE.Mesh(
      new THREE.SphereGeometry(target.radius * 1.25, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.48),
      new THREE.MeshBasicMaterial({
        color: 0x8ee8ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
  shock.position.copy(target.mesh.position).setY(0.08);
  shock.rotation.set(0, angle - Math.PI / 2, Math.PI / 2);
  transient(shock, 1.05, life => {
    shock.scale.set(1 + life * 1.7, 0.72 + life * 0.8, 1 + life * 1.7);
    (shock.material as THREE.MeshBasicMaterial).opacity = Math.pow(1 - life, 1.5) * 0.42;
  });
}

export function updateTransients(dt: number) {
  for (let i = transients.length - 1; i >= 0; i--) {
    const e = transients[i];
    e.age += dt;
    const life = Math.min(1, e.age / e.duration);
    e.update(life, dt);
    if (life >= 1) {
      removeTransientObject(e.object);
      transients.splice(i, 1);
    }
  }
}

/** A ship running at warp: a violet tear in space racing from `from` to `to` over `duration` seconds. */
export function warpStreakEffect(from: THREE.Vector3, to: THREE.Vector3, duration = 1.1) {
  const direction = to.clone().sub(from),
    length = direction.length(),
    angle = Math.atan2(-direction.z, direction.x),
    streak = new THREE.Group();
  const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1, 10, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xe4dcff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    ),
    sheath = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 1, 18, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x8d6cff,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
  for (const part of [core, sheath]) part.rotation.z = Math.PI / 2;
  streak.add(core, sheath);
  streak.rotation.y = angle;
  streak.position.copy(from);
  const tail = Math.min(length, 26);
  transient(streak, duration + 0.6, life => {
    const t = life * (duration + 0.6),
      head = Math.min(1, t / duration) * length,
      fade = t > duration ? 1 - (t - duration) / 0.6 : 1,
      start = Math.max(0, head - tail),
      span = Math.max(0.01, head - start);
    streak.position.copy(from).addScaledVector(direction, (start + span / 2) / length);
    core.scale.y = sheath.scale.y = span;
    (core.material as THREE.MeshBasicMaterial).opacity = 0.95 * fade;
    (sheath.material as THREE.MeshBasicMaterial).opacity = 0.12 * fade;
  });
  triggerFlash(0.12);
}
/** A ship dropping out of warp: a white flash and a gravity-wave ring rippling outward. */
export function warpEmergenceEffect(position: THREE.Vector3, reach: number, intensity = 1) {
  triggerFlash(0.22 * intensity);
  impactEffect(position, 0xc8b8ff, intensity);
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.975, 1, 160),
      new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xf2ecff : 0x9a7bff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(position).setY(position.y + 0.05);
    const delay = i * 0.18;
    transient(ring, 1.6 + delay, life => {
      const t = Math.max(0, life * (1.6 + delay) - delay) / 1.6,
        radius = 0.5 + t * reach;
      ring.scale.set(radius, radius, 1);
      (ring.material as THREE.MeshBasicMaterial).opacity = t > 0 ? Math.pow(1 - t, 1.4) * 0.55 * intensity : 0;
    });
  }
}
