import shuffle from "lodash/shuffle";
import assert from "node:assert";

export const randomInt = (max: number) => Math.floor(Math.random() * max);

export const selector = (arr: string[], choices?: number): string => {
  assert(arr.length > 0, 'Must provide a non empty array to choose from');
  choices ??= 1;
  
  /** Use Fisher Yates shuffle to ensure proper distribution - Math.random does not distribute well */
  const shuffled = shuffle(arr);

  return [...new Array(choices)].map((_) => {
    const idx = Math.floor(Math.random() * shuffled.length);
    return shuffled[idx]
  }).join(', ');
 };


