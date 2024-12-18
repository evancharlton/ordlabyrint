type PRNG = () => number;

type Seed = string | number;

export const hash = (seed: Seed): number => {
  if (typeof seed === "number") {
    return +seed;
  }

  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return h;
};

export const mulberry32 = (seed: Seed): PRNG => {
  let plantedSeed = hash(seed);
  return () => {
    let t = (plantedSeed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
