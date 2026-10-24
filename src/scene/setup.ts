// Renderer, post-processing composer, camera, starfield, grid, selection ring and science overlay objects.
import '../ui/template.ts';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { setNebulaRenderer } from '../nebula-hd.ts';
import { detectDeviceTier, loadPreferences, PerformanceMonitor } from '../exhibit-runtime.ts';

export const container = document.querySelector<HTMLDivElement>('#viewport')!,
  scene = new THREE.Scene(),
  isIPadDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1,
  mobileHardware =
    (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || isIPadDesktopMode) &&
    matchMedia('(pointer: coarse)').matches,
  isCompact = mobileHardware;
export const preferences = loadPreferences(matchMedia('(prefers-reduced-motion: reduce)').matches),
  deviceTier = detectDeviceTier(isCompact),
  performanceMonitor = new PerformanceMonitor();
scene.fog = new THREE.FogExp2(0x050711, 0.004);
export const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 4000),
  viewTarget = new THREE.Vector3(),
  MIN_CAMERA_DISTANCE = 8,
  MAX_CAMERA_DISTANCE = 1100;
camera.position.set(0, isCompact ? 90 : 34, isCompact ? 120 : 42);
camera.lookAt(viewTarget);
export const renderer = new THREE.WebGLRenderer({
  antialias: deviceTier !== 'mobile',
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(
  Math.min(devicePixelRatio, deviceTier === 'performance' ? 2 : deviceTier === 'balanced' ? 1.75 : 1.35),
);
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
container.appendChild(renderer.domElement);
export const lensingPass = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    radius: { value: 0.08 },
    strength: { value: 0 },
    aspect: { value: innerWidth / innerHeight },
  },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `uniform sampler2D tDiffuse;uniform vec2 center;uniform float radius;uniform float strength;uniform float aspect;varying vec2 vUv;void main(){vec2 delta=vUv-center;delta.x*=aspect;float distanceToLens=length(delta);float influence=1.-smoothstep(radius*.22,radius,distanceToLens);vec2 direction=distanceToLens>.0001?delta/distanceToLens:vec2(0.);direction.x/=aspect;float ring=exp(-pow((distanceToLens-radius*.34)/(radius*.075),2.));vec2 warped=vUv-direction*(influence*strength/(distanceToLens/radius+.24))*radius*.16;vec3 color=texture2D(tDiffuse,clamp(warped,vec2(.001),vec2(.999))).rgb;color+=vec3(.3,.48,1.)*ring*strength*.22;gl_FragColor=vec4(color,1.);}`,
});
setNebulaRenderer(renderer, deviceTier);
export const composer = new EffectComposer(renderer),
  BASE_BLOOM = deviceTier === 'mobile' ? 0.48 : 0.66;
composer.setPixelRatio(
  Math.min(devicePixelRatio, deviceTier === 'performance' ? 1.8 : deviceTier === 'balanced' ? 1.55 : 1.2),
);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(lensingPass);
export const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), BASE_BLOOM, 0.72, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());
export const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.className = 'label-layer';
container.appendChild(labelRenderer.domElement);
scene.add(new THREE.HemisphereLight(0x96b7ff, 0x080812, 1.8));
const starGeo = new THREE.BufferGeometry(),
  starPos = new Float32Array(9600);
for (let i = 0; i < starPos.length; i += 3) {
  const r = 220 + Math.random() * 1600,
    a = Math.random() * Math.PI * 2;
  starPos[i] = Math.cos(a) * r;
  starPos[i + 1] = (Math.random() - 0.5) * 900;
  starPos[i + 2] = Math.sin(a) * r;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(
  new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xb8c9ff,
      size: 0.55,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      fog: false,
    }),
  ),
);
const grid = new THREE.GridHelper(1800, 180, 0x24304d, 0x10172a);
(grid.material as THREE.Material).transparent = true;
(grid.material as THREE.Material).opacity = 0.2;
(grid.material as THREE.Material).depthWrite = false;
grid.renderOrder = -1;
scene.add(grid);
export const selectionRing = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 72 }, (_, i) => {
      const a = (i / 72) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 1.42, 0, Math.sin(a) * 1.42);
    }),
  ),
  new THREE.LineBasicMaterial({
    color: 0x7897df,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    toneMapped: false,
  }),
);
selectionRing.visible = false;
scene.add(selectionRing);
export const unitRingPoints = Array.from(
    { length: 128 },
    (_, i) => new THREE.Vector3(Math.cos((i / 128) * Math.PI * 2), 0.08, Math.sin((i / 128) * Math.PI * 2)),
  ),
  scienceOverlayGroup = new THREE.Group(),
  scienceOrbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(unitRingPoints),
    new THREE.LineBasicMaterial({ color: 0x68a6ff, transparent: true, opacity: 0.45, depthWrite: false }),
  ),
  scienceHill = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(unitRingPoints),
    new THREE.LineBasicMaterial({ color: 0x63e4ac, transparent: true, opacity: 0.32, depthWrite: false }),
  ),
  scienceRoche = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(unitRingPoints),
    new THREE.LineBasicMaterial({ color: 0xff7ea8, transparent: true, opacity: 0.5, depthWrite: false }),
  ),
  scienceVelocity = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0x73e8ff, 0.55, 0.28),
  barycenterMarker = new THREE.Mesh(
    new THREE.TorusGeometry(0.26, 0.055, 8, 28),
    new THREE.MeshBasicMaterial({
      color: 0xffd36b,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
scienceOverlayGroup.add(scienceOrbit, scienceHill, scienceRoche, scienceVelocity, barycenterMarker);
scene.add(scienceOverlayGroup);
scienceOverlayGroup.visible = false;

export const raycaster = new THREE.Raycaster(),
  pointer = new THREE.Vector2(),
  plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  world = new THREE.Vector3(),
  dragStart = new THREE.Vector3(),
  dragPoint = new THREE.Vector3(),
  panStart = new THREE.Vector2(),
  camStart = new THREE.Vector3();
export const targetStart = new THREE.Vector3();
