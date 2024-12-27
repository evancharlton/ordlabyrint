export const pq = <T = string | number>(...items: T[]) => {
  const queue = [...items];
  const scores = new Map();
  items.forEach((i) => {
    scores.set(i, 0);
  });

  return {
    length: () => queue.length,
    take: () => queue.shift(),
    put: (key: T, value: number) => {
      scores.set(key, value);

      if (value > scores.get(queue[queue.length - 1])) {
        queue.push(key);
        return;
      }

      if (value < scores.get(queue[0])) {
        queue.unshift(key);
        return;
      }

      // Hacky little binary search to find out where it goes.
      let min = 0;
      let max = queue.length;
      let center = 0;
      let limit = 1000;
      while (max - min > 1) {
        center = min + Math.floor((max - min) / 2);
        if (limit-- === 0) {
          throw new Error("Idiot");
        }
        const item = queue[center];
        if (!scores.has(item)) {
          throw new Error(`Missing score for ${item}`);
        }

        const v = scores.get(item);
        if (v > value) {
          max = center;
        } else if (v < value) {
          min = center;
        } else if (v === value) {
          break;
        }
      }

      queue.splice(center, 0, key);
    },
  };
};
