// GPU resource cleanup for removed objects.
import * as THREE from 'three';
import { scene } from './setup.ts';

function disposeMaterial(material: THREE.Material) {
  for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
  material.dispose();
}
export function disposeObject(object: THREE.Object3D) {
  object.traverse(child => {
    const renderable = child as THREE.Mesh;
    renderable.geometry?.dispose();
    const material = renderable.material;
    if (Array.isArray(material)) material.forEach(disposeMaterial);
    else if (material instanceof THREE.Material) disposeMaterial(material);
  });
}
export function removeTransientObject(object: THREE.Object3D) {
  scene.remove(object);
  disposeObject(object);
}
