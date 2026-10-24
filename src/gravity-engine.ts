export type GravityParticle = {
  id: number;
  x: number;
  z: number;
  mass: number;
  radius: number;
  softening: number;
  sourceFactor: number;
  responseFactor: number;
  locked: boolean;
  hosted: boolean;
};

export type GravityAcceleration = { x: number; z: number };

type Node = {
  cx: number;
  cz: number;
  half: number;
  sourceMass: number;
  weightedX: number;
  weightedZ: number;
  maxSoftening: number;
  items: GravityParticle[];
  children?: [Node, Node, Node, Node];
};

const MAX_DEPTH = 18;

function childIndex(node: Node, particle: GravityParticle) {
  return (particle.x >= node.cx ? 1 : 0) + (particle.z >= node.cz ? 2 : 0);
}

function subdivide(node: Node) {
  const half = node.half / 2;
  node.children = [
    {
      cx: node.cx - half,
      cz: node.cz - half,
      half,
      sourceMass: 0,
      weightedX: 0,
      weightedZ: 0,
      maxSoftening: 0,
      items: [],
    },
    {
      cx: node.cx + half,
      cz: node.cz - half,
      half,
      sourceMass: 0,
      weightedX: 0,
      weightedZ: 0,
      maxSoftening: 0,
      items: [],
    },
    {
      cx: node.cx - half,
      cz: node.cz + half,
      half,
      sourceMass: 0,
      weightedX: 0,
      weightedZ: 0,
      maxSoftening: 0,
      items: [],
    },
    {
      cx: node.cx + half,
      cz: node.cz + half,
      half,
      sourceMass: 0,
      weightedX: 0,
      weightedZ: 0,
      maxSoftening: 0,
      items: [],
    },
  ];
}

function insert(node: Node, particle: GravityParticle, depth = 0) {
  const sourceMass = particle.mass * particle.sourceFactor;
  node.sourceMass += sourceMass;
  node.weightedX += particle.x * sourceMass;
  node.weightedZ += particle.z * sourceMass;
  node.maxSoftening = Math.max(node.maxSoftening, particle.softening);

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

function addForce(
  target: GravityParticle,
  sourceX: number,
  sourceZ: number,
  sourceMass: number,
  softening: number,
  scale: number,
  result: GravityAcceleration,
) {
  const dx = sourceX - target.x;
  const dz = sourceZ - target.z;
  const rawDistanceSq = dx * dx + dz * dz;
  if (rawDistanceSq < 1e-10) return;
  const distanceSq = Math.max(rawDistanceSq + softening * softening, target.radius * target.radius * 0.35, 1e-4);
  const invDistance = 1 / Math.sqrt(rawDistanceSq);
  const strength = (scale * sourceMass * target.responseFactor) / distanceSq;
  result.x += dx * invDistance * strength;
  result.z += dz * invDistance * strength;
}

function accumulate(node: Node, target: GravityParticle, theta: number, scale: number, result: GravityAcceleration) {
  if (node.sourceMass <= 0) return;
  if (!node.children) {
    for (const item of node.items) {
      if (item.id === target.id || item.hosted) continue;
      addForce(target, item.x, item.z, item.mass * item.sourceFactor, target.softening + item.softening, scale, result);
    }
    return;
  }
  const centerX = node.weightedX / node.sourceMass;
  const centerZ = node.weightedZ / node.sourceMass;
  const dx = centerX - target.x;
  const dz = centerZ - target.z;
  const distance = Math.hypot(dx, dz);
  if (!contains(node, target) && distance > 0 && (node.half * 2) / distance < theta) {
    addForce(target, centerX, centerZ, node.sourceMass, target.softening + node.maxSoftening, scale, result);
    return;
  }
  for (const child of node.children) accumulate(child, target, theta, scale, result);
}

export function barnesHutAccelerations(
  particles: readonly GravityParticle[],
  gravitationalScale: number,
  theta = 0.72,
) {
  const active = particles.filter(particle => !particle.hosted);
  const result = new Map<number, GravityAcceleration>();
  if (!active.length) return result;
  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (const particle of active) {
    minX = Math.min(minX, particle.x);
    maxX = Math.max(maxX, particle.x);
    minZ = Math.min(minZ, particle.z);
    maxZ = Math.max(maxZ, particle.z);
  }
  const span = Math.max(maxX - minX, maxZ - minZ, 1);
  const root: Node = {
    cx: (minX + maxX) / 2,
    cz: (minZ + maxZ) / 2,
    half: span * 0.51 + 0.01,
    sourceMass: 0,
    weightedX: 0,
    weightedZ: 0,
    maxSoftening: 0,
    items: [],
  };
  for (const particle of active) insert(root, particle);
  for (const particle of active) {
    const acceleration = { x: 0, z: 0 };
    if (!particle.locked) accumulate(root, particle, theta, gravitationalScale, acceleration);
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
