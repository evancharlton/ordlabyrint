// TODO: There has to be a better way to do this.
export type Trie = {
  a?: Trie;
  b?: Trie;
  c?: Trie;
  d?: Trie;
  e?: Trie;
  f?: Trie;
  g?: Trie;
  h?: Trie;
  i?: Trie;
  j?: Trie;
  k?: Trie;
  l?: Trie;
  m?: Trie;
  n?: Trie;
  o?: Trie;
  p?: Trie;
  q?: Trie;
  r?: Trie;
  s?: Trie;
  t?: Trie;
  u?: Trie;
  v?: Trie;
  w?: Trie;
  x?: Trie;
  y?: Trie;
  z?: Trie;
  æ?: Trie;
  ø?: Trie;
  å?: Trie;

  // Indicates that the current node completes a word
  _?: true;
};

export type Letter = keyof Omit<Trie, "_">;

export type Letters = {
  [index: number]: Letter;
  length: number;
};

export const construct = (words: string[]): Readonly<Trie> => {
  console.time("construct-trie");
  const root: Trie = {};
  for (const word of words) {
    let current = root;
    for (let i = 0; i < word.length; i += 1) {
      const letter: Letter = word[i] as Letter;
      if (!current[letter]) {
        current[letter] = {};
      }
      current = current[letter]!;
    }
    current._ = true;
  }
  console.timeEnd("construct-trie");
  Object.freeze(root);
  return root;
};
