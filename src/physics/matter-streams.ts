// Matter streams between bodies (Roche-lobe overflow, accretion ribbons).
import * as THREE from 'three';
import { removeMatterStream } from '../bodies/lifecycle.ts';
import { isCompact, scene } from '../scene/setup.ts';
import { app, bodies, matterStreams } from '../state/app-state.ts';
import type { Body, MatterStream } from '../state/types.ts';
import { diskSpinFromOrbit, setDiskSpin } from '../visuals/disk-flow.ts';
import { transferDiskMaterial } from '../visuals/materials.ts';

/** Tilt of a transfer disk around a star, pulsar or white dwarf: close to the orbital plane, opened toward the camera. */
const TRANSFER_TILT = Math.PI / 2.45;
import { glowTexture } from '../visuals/textures.ts';

export function ensureMatterStream(donor: Body, receiver: Body, kind: MatterStream['kind'], intensity: number) {
  const key = `${donor.id}>${receiver.id}`;
  let stream = matterStreams.get(key);
  if (stream && stream.kind !== kind) {
    removeMatterStream(stream);
    stream = undefined;
  }
  if (!stream) {
    const color = kind === 'nebula' ? 0xd98cff : kind === 'debris' ? 0xffa54d : 0xffd69a,
      lineCount = isCompact ? 34 : 58,
      particleCount = isCompact ? 42 : 88,
      group = new THREE.Group(),
      lineGeo = new THREE.BufferGeometry(),
      particleGeo = new THREE.BufferGeometry(),
      phases = new Float32Array(particleCount),
      ribbonSegments = isCompact ? 24 : 38,
      ribbonGeo = new THREE.BufferGeometry(),
      ribbonPositions = new Float32Array((ribbonSegments + 1) * 6),
      ribbonIndices: number[] = [];
    for (let i = 0; i < ribbonSegments; i++) {
      const a = i * 2,
        b = a + 1,
        c = a + 2,
        d = a + 3;
      ribbonIndices.push(a, c, b, b, c, d);
    }
    ribbonGeo.setAttribute('position', new THREE.BufferAttribute(ribbonPositions, 3));
    ribbonGeo.setIndex(ribbonIndices);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineCount * 3), 3));
    particleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    for (let i = 0; i < particleCount; i++) phases[i] = i / particleCount + Math.random() * 0.08;
    const ribbon = new THREE.Mesh(
      ribbonGeo,
      new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    ribbon.frustumCulled = false;
    group.add(ribbon);
    const line = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    line.frustumCulled = false;
    group.add(line);
    const points = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: kind === 'plasma' ? 0xfff3d1 : color,
        size: kind === 'nebula' ? 0.3 : 0.28,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    points.frustumCulled = false;
    group.add(points);
    const disk = new THREE.Mesh(
        new THREE.RingGeometry(0.75, 3.55, isCompact ? 72 : 112, 8),
        transferDiskMaterial(kind, 0),
      ),
      outerDisk = new THREE.Mesh(
        new THREE.RingGeometry(2.1, 4.75, isCompact ? 64 : 96, 6),
        transferDiskMaterial(kind, 1),
      );
    for (const layer of [disk, outerDisk]) {
      layer.frustumCulled = false;
      layer.raycast = () => {};
      group.add(layer);
    }
    const flare = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture(kind === 'nebula' ? '#d88cff' : kind === 'debris' ? '#ff8b35' : '#fff0b5'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    group.add(flare);
    const donorFlare = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture(kind === 'nebula' ? '#cf76ff' : kind === 'debris' ? '#ff6a27' : '#fff4cf'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    group.add(donorFlare);
    scene.add(group);
    stream = {
      key,
      donorId: donor.id,
      receiverId: receiver.id,
      kind,
      group,
      ribbon,
      line,
      points,
      disk,
      outerDisk,
      flare,
      donorFlare,
      phases,
      intensity: 0,
      lastActive: app.elapsed,
    };
    matterStreams.set(key, stream);
  }
  stream.intensity = THREE.MathUtils.lerp(stream.intensity, THREE.MathUtils.clamp(intensity, 0.08, 1), 0.35);
  stream.lastActive = app.elapsed;
}
// Scratch vectors for the per-frame stream geometry; the Bézier is evaluated without allocating.
const curveOut = new THREE.Vector3(),
  curveAhead = new THREE.Vector3(),
  curveBehind = new THREE.Vector3(),
  ribbonSide = new THREE.Vector3();
function bezier(
  out: THREE.Vector3,
  t: number,
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
) {
  const u = 1 - t,
    a = u * u * u,
    b = 3 * u * u * t,
    c = 3 * u * t * t,
    d = t * t * t;
  return out.set(
    p0.x * a + p1.x * b + p2.x * c + p3.x * d,
    p0.y * a + p1.y * b + p2.y * c + p3.y * d,
    p0.z * a + p1.z * b + p2.z * c + p3.z * d,
  );
}
export function updateMatterStreams(dt: number) {
  if (!matterStreams.size) return;
  const byId = new Map(bodies.map(body => [body.id, body] as const));
  for (const stream of [...matterStreams.values()]) {
    const donor = byId.get(stream.donorId),
      receiver = byId.get(stream.receiverId);
    if (!donor || !receiver) {
      removeMatterStream(stream);
      continue;
    }
    const stale = app.elapsed - stream.lastActive > 0.075;
    if (stale) stream.intensity *= Math.exp(-dt * 5.2);
    if (stream.intensity < 0.018 && stale) {
      removeMatterStream(stream);
      continue;
    }
    const axis = receiver.mesh.position.clone().sub(donor.mesh.position),
      distance = axis.length();
    if (distance < 0.05) continue;
    const direction = axis.clone().divideScalar(distance),
      perp = new THREE.Vector3(-direction.z, 0, direction.x),
      // Gas keeps the angular momentum it had when it left the donor, so that sets the disk's orbit sense.
      flowSign = (stream.flowSign ??= diskSpinFromOrbit(
        donor.mesh.position.x - receiver.mesh.position.x,
        donor.mesh.position.z - receiver.mesh.position.z,
        donor.velocity.x - receiver.velocity.x,
        donor.velocity.z - receiver.velocity.z,
      )),
      ownDisk = receiver.kind === 'blackhole' && receiver.mesh.userData.diskTilt !== undefined,
      tilt = ownDisk ? Number(receiver.mesh.userData.diskTilt) : TRANSFER_TILT,
      donorOffset = donor.kind === 'nebula' ? Math.min(donor.radius * 0.62, distance * 0.42) : donor.radius * 0.76,
      diskRadius = receiver.radius * (receiver.kind === 'blackhole' ? 3.7 : receiver.kind === 'pulsar' ? 2.7 : 2.35),
      start = donor.mesh.position.clone().addScaledVector(direction, donorOffset),
      // The stream joins the rim a little downstream of the donor and arrives moving along the orbit, so it
      // wraps into the disk instead of hitting it head-on.
      landAngle = Math.atan2(-direction.z, -direction.x) + flowSign * 0.95,
      cosT = Math.cos(tilt),
      sinT = Math.sin(tilt),
      end = receiver.mesh.position
        .clone()
        .add(
          new THREE.Vector3(
            Math.cos(landAngle) * diskRadius,
            Math.sin(landAngle) * cosT * diskRadius + 0.12,
            Math.sin(landAngle) * sinT * diskRadius,
          ),
        ),
      along = new THREE.Vector3(-Math.sin(landAngle), Math.cos(landAngle) * cosT, Math.cos(landAngle) * sinT)
        .multiplyScalar(flowSign)
        .normalize(),
      curve = Math.min(6.8, distance * (stream.kind === 'nebula' ? 0.3 : 0.23)),
      bendSign = -flowSign,
      controlA = start
        .clone()
        .addScaledVector(direction, distance * 0.34)
        .addScaledVector(perp, curve * 0.52 * bendSign)
        .setY(0.35 + Math.min(1.4, distance * 0.03)),
      controlB = end.clone().addScaledVector(along, -Math.min(5, distance * 0.3)),
      intensity = stream.intensity;
    if (!stream.spinApplied && intensity > 0.3) {
      stream.spinApplied = true;
      if (ownDisk) setDiskSpin(receiver.mesh, flowSign);
    }
    const curvePoint = (t: number, out = curveOut) => bezier(out, t, start, controlA, controlB, end);
    const ribbonAttr = stream.ribbon.geometry.getAttribute('position') as THREE.BufferAttribute,
      ribbonSteps = ribbonAttr.count / 2 - 1;
    for (let i = 0; i <= ribbonSteps; i++) {
      const t = i / ribbonSteps,
        p = curvePoint(t),
        pulse = 0.72 + 0.28 * Math.sin(app.elapsed * 8 - t * 18),
        strippingBulge = 1 + Math.exp(-t * 7) * 0.42,
        width =
          Math.sin(Math.PI * Math.min(0.99, t + 0.035)) *
            pulse *
            strippingBulge *
            (stream.kind === 'nebula' ? 0.76 : 0.58) *
            (0.58 + intensity * 1.62) +
          0.06,
        tangent = curvePoint(Math.min(1, t + 0.02), curveAhead)
          .sub(curvePoint(Math.max(0, t - 0.02), curveBehind))
          .normalize(),
        side = ribbonSide.set(-tangent.z, 0, tangent.x).normalize().multiplyScalar(width);
      p.y += Math.sin(t * 21 - app.elapsed * 5) * width * 0.22;
      ribbonAttr.setXYZ(i * 2, p.x + side.x, p.y + side.y, p.z + side.z);
      ribbonAttr.setXYZ(i * 2 + 1, p.x - side.x, p.y - side.y, p.z - side.z);
    }
    ribbonAttr.needsUpdate = true;
    (stream.ribbon.material as THREE.MeshBasicMaterial).opacity = intensity * (stream.kind === 'nebula' ? 0.58 : 0.76);
    const lineAttr = stream.line.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < lineAttr.count; i++) {
      const t = i / (lineAttr.count - 1),
        p = curvePoint(t),
        ripple =
          Math.sin(t * 22 - app.elapsed * 5 + i * 0.3) *
          (1 - t) *
          t *
          (stream.kind === 'nebula' ? 0.5 : 0.24) *
          intensity;
      p.addScaledVector(perp, ripple);
      lineAttr.setXYZ(i, p.x, p.y, p.z);
    }
    lineAttr.needsUpdate = true;
    (stream.line.material as THREE.LineBasicMaterial).opacity = intensity * (stream.kind === 'nebula' ? 0.64 : 0.78);
    const pointAttr = stream.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pointAttr.count; i++) {
      stream.phases[i] = (stream.phases[i] + dt * (stream.kind === 'nebula' ? 0.26 : 0.43) * (1 + intensity)) % 1;
      const t = stream.phases[i],
        p = curvePoint(t),
        spiral = Math.sin(t * 28 + i * 2.7 + app.elapsed * 6) * (1 - t) * (0.12 + intensity * 0.3);
      p.addScaledVector(perp, spiral).setY(p.y + Math.cos(t * 21 + i) * 0.12);
      pointAttr.setXYZ(i, p.x, p.y, p.z);
    }
    pointAttr.needsUpdate = true;
    (stream.points.material as THREE.PointsMaterial).opacity = Math.min(1, intensity * 0.95);
    const targetScale =
        Math.max(
          0.38,
          receiver.radius * (receiver.kind === 'blackhole' ? 1.12 : receiver.kind === 'pulsar' ? 0.88 : 0.82),
        ) *
        (0.78 + intensity * 0.28),
      // Disks grow and fade smoothly instead of breathing with every flicker in the transfer rate.
      diskScale = (stream.diskScale = THREE.MathUtils.lerp(
        stream.diskScale ?? targetScale,
        targetScale,
        1 - Math.exp(-dt * 1.4),
      )),
      diskDt = app.paused ? 0 : dt * Math.min(app.speed, 4);
    for (const layer of [stream.disk, stream.outerDisk]) {
      // A black hole already has its own disk: the stream feeds and brightens that one rather than adding a
      // second disk at a slightly different angle.
      layer.visible = !ownDisk;
      if (ownDisk) continue;
      layer.position.copy(receiver.mesh.position).setY(receiver.mesh.position.y + 0.12);
      layer.rotation.set(tilt, 0, 0);
      layer.scale.setScalar(diskScale);
      const material = layer.material as THREE.ShaderMaterial;
      material.uniforms.time.value += diskDt;
      material.uniforms.spin.value = flowSign;
      material.uniforms.intensity.value = intensity * (receiver.kind === 'blackhole' ? 0.72 : 1);
    }
    stream.flare.position.copy(end);
    stream.flare.position.y += 0.12;
    stream.flare.scale.setScalar(
      (1 + receiver.radius * (stream.kind === 'nebula' ? 1.05 : 0.82)) * (0.78 + intensity * 0.52),
    );
    (stream.flare.material as THREE.SpriteMaterial).opacity =
      intensity * (0.56 + 0.26 * Math.sin(app.elapsed * 9 + receiver.id));
    stream.donorFlare.position.copy(start);
    stream.donorFlare.position.y += 0.1;
    stream.donorFlare.scale.setScalar(
      (0.55 + donor.radius * (stream.kind === 'nebula' ? 0.32 : 0.48)) * (0.7 + intensity * 0.55),
    );
    (stream.donorFlare.material as THREE.SpriteMaterial).opacity =
      intensity * (0.32 + 0.22 * Math.sin(app.elapsed * 9 + donor.id));
  }
}
