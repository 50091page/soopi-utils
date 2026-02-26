export type SwapRow = {
  left: string;
  right: string;
  locked: boolean;
};

function secureRandomUnit(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / 4294967296;
  }

  return Math.random();
}

export function shuffleSwapRows(
  rows: SwapRow[],
  allowEmptySwap: boolean,
  randomUnit: () => number = secureRandomUnit
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

    if (randomUnit() < 0.5) {
      return {
        ...row,
        left: row.right,
        right: row.left,
      };
    }

    return row;
  });
}
