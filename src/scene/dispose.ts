// GPU and DOM resource cleanup for removed objects.
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { releaseNebulaVisual } from '../nebula-hd.ts';
import { scene } from './setup.ts';

function disposeMaterial(material: THREE.Material) {
  for (const value of Object.values(material))
    if (value instanceof THREE.Texture && !value.userData.shared) value.dispose();
  material.dispose();
}
/**
 * Frees geometry, materials and unshared textures in the subtree, removes every CSS2D label element
 * (three.js only fires `removed` on the object passed to `scene.remove`, never on its children) and
 * releases shared nebula bake textures held by the subtree.
 */
export function disposeObject(object: THREE.Object3D) {
  object.traverse(child => {
    if (child instanceof CSS2DObject) child.element.remove();
    if (child.userData.nebulaBakeKeys) releaseNebulaVisual(child);
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
