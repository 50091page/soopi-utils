export type SwapRow = {
  left: string;
  right: string;
  locked: boolean;
};

export function shuffleSwapRows(
  rows: SwapRow[],
  allowEmptySwap: boolean,
  random: () => number = Math.random
): SwapRow[] {
  return rows.map((row) => {
    if (row.locked) {
      return row;
    }

    const left = row.left.trim();
    const right = row.right.trim();
    if (!allowEmptySwap && (!left || !right)) {
      return row;
    }

    if (random() < 0.5) {
      return {
        ...row,
        left: row.right,
        right: row.left,
      };
    }

    return row;
  });
}
