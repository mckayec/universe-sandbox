export type GravityParticle = {
  id: number;
  x: number;
  z: number;
  mass: number;
  radius: number;
  /** Extra squared softening length (extended media such as nebulae); 0 for compact bodies. */
  softening: number;
  sourceFactor: number;
  responseFactor: number;
  locked: boolean;
  hosted: boolean;
  /** Preset exhibit system (e.g. Our Solar System, a galaxy). Members only feel the system's anchor. */
  systemId?: number;
  /** The body the rest of its exhibit system orbits; it ignores pulls from its own members. */
  anchor?: boolean;
  /**
   * Position of this member's system anchor. Members of other exhibit systems (e.g. a galaxy's black hole and stars)
   * are felt as if this member sat at its anchor, so a preset system moves as one unit instead of being tidally
   * torn apart by a neighbouring preset. Bodies outside any exhibit system still act on each member directly.
   */
  frameX?: number;
  frameZ?: number;
};

export type GravityAcceleration = { x: number; z: number };

/**
 * How strongly `target` responds to `source`. Inside one exhibit system, tracers feel only the anchor
 * and the anchor is not tugged by its own members; everything else uses the target's response factor.
 */
export function pairResponse(target: GravityParticle, source: GravityParticle) {
  if (target.systemId !== undefined && target.systemId === source.systemId && (target.anchor || !source.anchor))
    return 0;
  return target.responseFactor;
}

/** Squared, softened separation shared by the pairwise and Barnes–Hut paths. */
export function softenedDistanceSq(
  rawDistanceSq: number,
  softeningA: number,
  softeningB: number,
  radiusA: number,
  radiusB: number,
) {
  return Math.max(rawDistanceSq + softeningA + softeningB, (radiusA + radiusB) ** 2 * 0.35);
}

function usesFrame(target: GravityParticle, source: GravityParticle) {
  return (
    source.systemId !== undefined &&
    source.systemId !== target.systemId &&
    !target.anchor &&
    target.frameX !== undefined &&
    target.frameZ !== undefined
  );
}

function addPairForce(
  target: GravityParticle,
  source: GravityParticle,
  scale: number,
  response: number,
  result: GravityAcceleration,
) {
  const frame = usesFrame(target, source),
    dx = source.x - (frame ? target.frameX! : target.x),
    dz = source.z - (frame ? target.frameZ! : target.z),
    rawDistanceSq = dx * dx + dz * dz,
    distanceSq = softenedDistanceSq(rawDistanceSq, target.softening, source.softening, target.radius, source.radius);
  if (distanceSq < 0.0001 || rawDistanceSq < 1e-12) return;
  const strength = (scale * source.mass * source.sourceFactor * response) / distanceSq,
    invDistance = 1 / Math.sqrt(rawDistanceSq);
  result.x += dx * invDistance * strength;
  result.z += dz * invDistance * strength;
}

/** Exact O(n²) gravity, used for small scenes. */
export function pairwiseAccelerations(particles: readonly GravityParticle[], gravitationalScale: number) {
  const active = particles.filter(particle => !particle.hosted),
    result = new Map<number, GravityAcceleration>();
  for (const target of active) {
    const acceleration = { x: 0, z: 0 };
    if (!target.locked)
      for (const source of active) {
        if (source === target) continue;
        const response = pairResponse(target, source);
        if (response > 0) addPairForce(target, source, gravitationalScale, response, acceleration);
      }
    result.set(target.id, acceleration);
  }
  return result;
}

type Node = {
  cx: number;
  cz: number;
  half: number;
  sourceMass: number;
  weightedX: number;
  weightedZ: number;
  maxSoftening: number;
  maxRadius: number;
  items: GravityParticle[];
  children?: [Node, Node, Node, Node];
};

const MAX_DEPTH = 18;

function emptyNode(cx: number, cz: number, half: number): Node {
  return { cx, cz, half, sourceMass: 0, weightedX: 0, weightedZ: 0, maxSoftening: 0, maxRadius: 0, items: [] };
}

function childIndex(node: Node, particle: GravityParticle) {
  return (particle.x >= node.cx ? 1 : 0) + (particle.z >= node.cz ? 2 : 0);
}

function subdivide(node: Node) {
  const half = node.half / 2;
  node.children = [
    emptyNode(node.cx - half, node.cz - half, half),
    emptyNode(node.cx + half, node.cz - half, half),
    emptyNode(node.cx - half, node.cz + half, half),
    emptyNode(node.cx + half, node.cz + half, half),
  ];
}

function insert(node: Node, particle: GravityParticle, depth = 0) {
  const sourceMass = particle.mass * particle.sourceFactor;
  node.sourceMass += sourceMass;
  node.weightedX += particle.x * sourceMass;
  node.weightedZ += particle.z * sourceMass;
  node.maxSoftening = Math.max(node.maxSoftening, particle.softening);
  node.maxRadius = Math.max(node.maxRadius, particle.radius);

  if (!node.children && (node.items.length === 0 || depth >= MAX_DEPTH || node.half < 0.01)) {
    node.items.push(particle);
    return;
  }
  if (!node.children) {
    const previous = node.items.splice(0);
    subdivide(node);
    for (const item of previous) insert(node.children![childIndex(node, item)], item, depth + 1);
  }
  insert(node.children![childIndex(node, particle)], particle, depth + 1);
}

function contains(node: Node, particle: GravityParticle) {
  return Math.abs(particle.x - node.cx) <= node.half && Math.abs(particle.z - node.cz) <= node.half;
}

function accumulate(node: Node, target: GravityParticle, theta: number, scale: number, result: GravityAcceleration) {
  if (node.sourceMass <= 0) return;
  if (!node.children) {
    for (const item of node.items) {
      if (item.id === target.id) continue;
      const response = pairResponse(target, item);
      if (response > 0) addPairForce(target, item, scale, response, result);
    }
    return;
  }
  const centerX = node.weightedX / node.sourceMass;
  const centerZ = node.weightedZ / node.sourceMass;
  const dx = centerX - target.x;
  const dz = centerZ - target.z;
  const rawDistanceSq = dx * dx + dz * dz;
  const distance = Math.sqrt(rawDistanceSq);
  if (!contains(node, target) && distance > 0 && (node.half * 2) / distance < theta) {
    const distanceSq = softenedDistanceSq(
      rawDistanceSq,
      target.softening,
      node.maxSoftening,
      target.radius,
      node.maxRadius,
    );
    const strength = (scale * node.sourceMass * target.responseFactor) / distanceSq;
    result.x += (dx / distance) * strength;
    result.z += (dz / distance) * strength;
    return;
  }
  for (const child of node.children) accumulate(child, target, theta, scale, result);
}

function buildTree(particles: readonly GravityParticle[]) {
  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (const particle of particles) {
    minX = Math.min(minX, particle.x);
    maxX = Math.max(maxX, particle.x);
    minZ = Math.min(minZ, particle.z);
    maxZ = Math.max(maxZ, particle.z);
  }
  if (!particles.length) return emptyNode(0, 0, 1);
  const span = Math.max(maxX - minX, maxZ - minZ, 1);
  const root = emptyNode((minX + maxX) / 2, (minZ + maxZ) / 2, span * 0.51 + 0.01);
  for (const particle of particles) insert(root, particle);
  return root;
}

/**
 * Approximate O(n log n) gravity for large scenes. It follows the same exhibit-system rules and softening as
 * `pairwiseAccelerations`: exhibit-system members use a tree of the bodies outside every exhibit system, plus exact
 * terms for other members, which the system rules (pairResponse, frames) shape.
 */
export function barnesHutAccelerations(
  particles: readonly GravityParticle[],
  gravitationalScale: number,
  theta = 0.72,
) {
  const active = particles.filter(particle => !particle.hosted);
  const result = new Map<number, GravityAcceleration>();
  if (!active.length) return result;
  const members = active.filter(particle => particle.systemId !== undefined),
    root = buildTree(active),
    outsideTree = members.length ? buildTree(active.filter(particle => particle.systemId === undefined)) : root;
  for (const particle of active) {
    const acceleration = { x: 0, z: 0 };
    if (!particle.locked) {
      if (particle.systemId === undefined) accumulate(root, particle, theta, gravitationalScale, acceleration);
      else {
        accumulate(outsideTree, particle, theta, gravitationalScale, acceleration);
        for (const member of members) {
          if (member === particle) continue;
          const response = pairResponse(particle, member);
          if (response > 0) addPairForce(particle, member, gravitationalScale, response, acceleration);
        }
      }
    }
    result.set(particle.id, acceleration);
  }
  return result;
}

export function spatialCandidatePairs(
  particles: readonly Pick<GravityParticle, 'id' | 'x' | 'z' | 'radius'>[],
  cellSize = 12,
) {
  const cells = new Map<string, number[]>();
  for (const particle of particles) {
    const reach = Math.max(0.5, particle.radius);
    const minX = Math.floor((particle.x - reach) / cellSize);
    const maxX = Math.floor((particle.x + reach) / cellSize);
    const minZ = Math.floor((particle.z - reach) / cellSize);
    const maxZ = Math.floor((particle.z + reach) / cellSize);
    for (let x = minX; x <= maxX; x++)
      for (let z = minZ; z <= maxZ; z++) {
        const key = `${x},${z}`;
        const bucket = cells.get(key) ?? [];
        bucket.push(particle.id);
        cells.set(key, bucket);
      }
  }
  const pairs = new Set<string>();
  for (const bucket of cells.values())
    for (let i = 0; i < bucket.length; i++)
      for (let j = i + 1; j < bucket.length; j++) {
        const a = Math.min(bucket[i], bucket[j]);
        const b = Math.max(bucket[i], bucket[j]);
        pairs.add(`${a}:${b}`);
      }
  return [...pairs].map(pair => pair.split(':').map(Number) as [number, number]);
}
