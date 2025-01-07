type PRNG = () => number;

type Seed = string | number;

export const hash = (seed: Seed): number => {
  if (Number.isSafeInteger(+seed)) {
    return +seed;
  }

  const stringSeed = String(seed);
  let h = 0;
  for (let i = 0; i < stringSeed.length; i++) {
    h = (Math.imul(31, h) + stringSeed.charCodeAt(i)) | 0;
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

export const randomItem = <T>(
  items: {
    [index: number]: T;
    length: number;
  },
  random: PRNG,
): T => {
  return items[Math.floor(random() * items.length)];
};
