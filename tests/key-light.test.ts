// Simulator item 5: star-relative planet lighting (pure model + shader/controller source guards).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { NO_STAR_LIGHT, daylight, keyLightFor, relativeLuminosity, type LightSource } from '../src/key-light.ts';
import { tidalVisualScale } from '../src/tidal-visual.ts';

const close = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);
const origin = { x: 0, y: 0, z: 0 };
const dot = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) =>
  a.x * b.x + a.y * b.y + a.z * b.z;

test('luminosity follows R² T⁴ ratios and rejects invalid input', () => {
  close(relativeLuminosity(1, 5800), 1);
  close(relativeLuminosity(2, 5800), 4);
  close(relativeLuminosity(1, 11600), 16);
  assert.equal(relativeLuminosity(0, 5800), 0);
  assert.equal(relativeLuminosity(1, -1), 0);
  assert.equal(relativeLuminosity(NaN, 5800), 0);
});

test('no star → documented fixed scene-space fallback', () => {
  const light = keyLightFor(origin, []);
  assert.equal(light.keyId, null);
  assert.deepEqual(light.key, NO_STAR_LIGHT);
  assert.equal(light.fillAmount, 0);
  close(Math.hypot(NO_STAR_LIGHT.x, NO_STAR_LIGHT.y, NO_STAR_LIGHT.z), 1);
  // Same direction the old body-local light used, so a lone world keeps its familiar look.
  close(NO_STAR_LIGHT.x / NO_STAR_LIGHT.z, 0.62 / 0.74);
});

test('single star: key points from the world to the star, at any distance or side', () => {
  for (const [x, y, z] of [
    [10, 0, 0],
    [-3, 4, 0],
    [0, 0, -250],
    [1, 2, 3],
  ]) {
    const light = keyLightFor(origin, [{ id: 7, position: { x, y, z }, luminosity: 1 }]),
      length = Math.hypot(x, y, z);
    assert.equal(light.keyId, 7);
    close(light.key.x, x / length);
    close(light.key.y, y / length);
    close(light.key.z, z / length);
    assert.equal(light.fillAmount, 0);
  }
});

test('the world itself, dark sources and coincident sources are ignored', () => {
  const sources: LightSource[] = [
    { id: 1, position: { x: 0, y: 0, z: 0 }, luminosity: 5 },
    { id: 2, position: { x: 5, y: 0, z: 0 }, luminosity: 0 },
    { id: 3, position: { x: 0, y: 9, z: 0 }, luminosity: 1 },
  ];
  const light = keyLightFor(origin, sources, 3);
  assert.equal(light.keyId, null);
  assert.equal(keyLightFor(origin, sources).keyId, 3);
});

test('key is the largest flux L/d², not the nearest or the most luminous', () => {
  const near = { id: 1, position: { x: 2, y: 0, z: 0 }, luminosity: 1 },
    bright = { id: 2, position: { x: 0, y: 0, z: 10 }, luminosity: 100 };
  // flux near = 1/4, bright = 100/100 = 1 → bright is key, fill = .25
  for (const order of [
    [near, bright],
    [bright, near],
  ]) {
    const light = keyLightFor(origin, order);
    assert.equal(light.keyId, 2);
    close(light.fillAmount, 0.25);
    close(light.fill.x, 1);
  }
});

test('two stars crossing equal flux: day side is continuous (no terminator pop)', () => {
  // A world moves along x between two equal stars at ±10; flux order swaps at x = 0.
  const stars: LightSource[] = [
      { id: 1, position: { x: -10, y: 0, z: 0 }, luminosity: 1 },
      { id: 2, position: { x: 10, y: 0, z: 0 }, luminosity: 1 },
    ],
    normals = [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0.6, y: 0.8, z: 0 },
    ];
  const sample = (x: number) => {
    const light = keyLightFor({ x, y: 0.3, z: 0 }, stars);
    return normals.map(n => daylight(dot(n, light.key), dot(n, light.fill), light.fillAmount));
  };
  const left = sample(-1e-6),
    right = sample(1e-6);
  left.forEach((v, i) => close(v, right[i], 1e-4));
  // Both hemispheres facing a star are lit at the midpoint.
  assert.ok(left[0] > 0.99 && left[1] > 0.99);
});

test('spin and camera do not move the terminator: daylight depends only on world normal and source', () => {
  const light = keyLightFor(origin, [{ id: 1, position: { x: 0, y: 0, z: 30 }, luminosity: 1 }]);
  // A surface point fixed in the body: its world normal changes with spin, the light does not.
  const local = { x: 1, y: 0, z: 0 };
  const values = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map(spin => {
    const world = { x: Math.cos(spin) * local.x, y: 0, z: -Math.sin(spin) * local.x };
    return daylight(dot(world, light.key), dot(world, light.fill), light.fillAmount);
  });
  // Facing the star at spin 3π/2 (normal +z), night at π/2 (normal −z), terminator at 0 and π.
  close(values[3], 1);
  close(values[1], 0);
  close(values[0], values[2]);
});

test('daylight mirror matches the shader terminator and clamps fill', () => {
  assert.equal(daylight(-1, -1, 1), 0);
  assert.equal(daylight(1, -1, 0), 1);
  assert.equal(daylight(-1, 1, 0.4), 0.4);
  assert.equal(daylight(-1, 1, 7), 1);
  let previous = -1;
  for (let c = -1; c <= 1; c += 0.01) {
    const v = daylight(c, -1, 0);
    assert.ok(v >= previous - 1e-12 && v >= 0 && v <= 1);
    previous = v;
  }
});

test('planet, gas-giant and atmosphere shaders use world-space key light, not a body-local axis', () => {
  const materials = readFileSync(new URL('../src/visuals/materials.ts', import.meta.url), 'utf8'),
    glsl = readFileSync(new URL('../src/visuals/key-light-glsl.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(materials, /dot\(q,normalize\(vec3\(\.62,\.25,\.74\)\)\)/);
  assert.equal(materials.match(/vertexShader: LIT_VERTEX/g)?.length, 3);
  assert.equal(materials.match(/\.\.\.keyLightUniforms\(\)/g)?.length, 3);
  assert.equal(materials.match(/\$\{KEY_LIGHT_GLSL\}/g)?.length, 3);
  assert.match(materials, /dayside\(N,-\.18,\.28\)/);
  assert.match(materials, /dayside\(normalize\(vWN\),-\.2,\.32\)/);
  assert.match(materials, /dayside\(normalize\(vWN\),-\.35,\.45\)/);
  assert.match(glsl, /vWN = normalize\(\(vec4\(n, 0\.\) \* viewMatrix\)\.xyz\);/);
  assert.doesNotMatch(glsl, /mat3\(modelMatrix\) \* normal/);
  assert.match(glsl, /p = normal;/);
  assert.match(glsl, /return max\(key, fill\);/);
});

test('controller lights only worlds, from stars/brown dwarfs/protostars, every frame', () => {
  const controller = readFileSync(new URL('../src/visuals/planet-lighting.ts', import.meta.url), 'utf8'),
    update = readFileSync(new URL('../src/visuals/update-visuals.ts', import.meta.url), 'utf8');
  assert.match(controller, /new Set\(\['rocky', 'dwarf', 'moon', 'gas'\]\)/);
  assert.match(controller, /keyLightFor\(b\.mesh\.position, sources, b\.id\)/);
  assert.match(controller, /b\.kind === 'star'/);
  assert.doesNotMatch(controller, /'pulsar'|'blackhole'|'nebula'/);
  assert.match(update, /updatePlanetLighting\(\);\n\s+for \(const b of bodies\)/);
});

// SC5-T1: world normals on tidally stretched worlds. Builds the renderer's hierarchy (body group → tidalFrame →
// bodySurface, as in setTidalVisualScale) and evaluates LIT_VERTEX's vWN expression with Three's own matrices:
// n = normalize(normalMatrix * normal); vWN = normalize(transpose(mat3(viewMatrix)) * n).
function stretchedSurface(strain: number, base: number, frameAngle: number, spin: number) {
  const body = new THREE.Group(),
    frame = new THREE.Group(),
    surface = new THREE.Object3D(),
    shape = tidalVisualScale(strain);
  body.scale.setScalar(base);
  body.position.set(3, -1, 2);
  frame.rotation.y = frameAngle;
  frame.scale.set(shape.x, shape.y, shape.z);
  surface.rotation.y = spin - frameAngle;
  body.add(frame);
  frame.add(surface);
  body.updateMatrixWorld(true);
  return surface;
}
function shaderWorldNormal(surface: THREE.Object3D, camera: THREE.Camera, normal: THREE.Vector3) {
  camera.updateMatrixWorld(true);
  const modelView = new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, surface.matrixWorld),
    normalMatrix = new THREE.Matrix3().getNormalMatrix(modelView),
    view = new THREE.Vector3().copy(normal).applyMatrix3(normalMatrix).normalize(),
    viewTranspose = new THREE.Matrix3().setFromMatrix4(camera.matrixWorldInverse).transpose();
  return view.applyMatrix3(viewTranspose).normalize();
}
const referenceNormal = (surface: THREE.Object3D, normal: THREE.Vector3) =>
  normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(surface.matrixWorld)).normalize();
const cameras = () => {
  const a = new THREE.PerspectiveCamera(50, 1.6, 0.1, 1000),
    b = new THREE.PerspectiveCamera(50, 0.46, 0.1, 1000),
    c = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
  a.position.set(0, 0, 40);
  a.lookAt(0, 0, 0);
  b.position.set(-25, 18, -12);
  b.lookAt(3, -1, 2);
  c.position.set(7, -30, 5);
  c.up.set(1, 0, 0);
  c.lookAt(3, -1, 2);
  c.rotateZ(0.7);
  return [a, b, c];
};
const sampleNormals = [
  new THREE.Vector3(1, 0, 1).normalize(),
  new THREE.Vector3(0.3, 0.8, -0.52).normalize(),
  new THREE.Vector3(-0.9, -0.2, 0.39).normalize(),
];

test('SC5-T1: shader world normal is the inverse-transpose normal for every transform and camera', () => {
  const cases = [
    { strain: 0, frameAngle: 0, spin: 0 },
    { strain: 0, frameAngle: 0, spin: 1.1 },
    { strain: 0.5, frameAngle: 0, spin: 0 },
    { strain: 0.88, frameAngle: 0, spin: 0 },
    { strain: 0.88, frameAngle: 0.9, spin: 2.3 },
    { strain: 0.3, frameAngle: -2.2, spin: -0.4 },
  ];
  for (const c of cases) {
    const surface = stretchedSurface(c.strain, 2, c.frameAngle, c.spin);
    for (const camera of cameras())
      for (const normal of sampleNormals) {
        const got = shaderWorldNormal(surface, camera, normal),
          want = referenceNormal(surface, normal);
        assert.ok(got.angleTo(want) < 1e-6, `strain ${c.strain}: ${got.angleTo(want)} rad`);
      }
  }
});

test('SC5-T1: stretched-world normals stay perpendicular to the transformed surface; the old expression did not', () => {
  for (const strain of [0.5, 0.88]) {
    const surface = stretchedSurface(strain, 2, 0.6, 1.3),
      normal = new THREE.Vector3(1, 0, 1).normalize(),
      tangents = [new THREE.Vector3(1, 0, -1).normalize(), new THREE.Vector3(0, 1, 0)],
      linear = new THREE.Matrix3().setFromMatrix4(surface.matrixWorld),
      fixed = shaderWorldNormal(surface, cameras()[1], normal),
      unrotated = stretchedSurface(strain, 2, 0, 0),
      unrotatedLinear = new THREE.Matrix3().setFromMatrix4(unrotated.matrixWorld),
      old = normal.clone().applyMatrix3(unrotatedLinear).normalize();
    for (const t of tangents) {
      const worldTangent = t.clone().applyMatrix3(linear).normalize();
      assert.ok(Math.abs(fixed.dot(worldTangent)) < 1e-9);
    }
    // Negative control (review's case: tidal frame unrotated, no spin): the old mat3(modelMatrix) * normal is tilted
    // 13.1° at strain 0.5 and 21.6° at 0.88 from the shader's normal.
    const tilt = THREE.MathUtils.radToDeg(old.angleTo(shaderWorldNormal(unrotated, cameras()[0], normal)));
    assert.ok(Math.abs(tilt - (strain === 0.5 ? 13.1206 : 21.6272)) < 1e-3, `tilt ${tilt}`);
  }
});

test('SC5-T1: day-side term on a stretched world ignores camera orientation and matches the true normal', () => {
  const light = keyLightFor(origin, [{ id: 1, position: { x: 1, y: 0, z: -1 }, luminosity: 1 }]),
    surface = stretchedSurface(0.88, 2, 0, 0),
    normal = new THREE.Vector3(1, 0, 1).normalize(),
    want = referenceNormal(surface, normal),
    expected = daylight(dot(want, light.key), dot(want, light.fill), light.fillAmount);
  for (const camera of cameras()) {
    const got = shaderWorldNormal(surface, camera, normal);
    close(daylight(dot(got, light.key), dot(got, light.fill), light.fillAmount), expected, 1e-9);
  }
});
