import type { RowPair } from "../types/swap.js";

export function buildNormalizedNameCounts(values: RowPair[]) {
  const counts = new Map<string, number>();

  values.forEach((row) => {
    [row.left, row.right].forEach((name) => {
      const normalized = name.trim().toLowerCase();
      if (!normalized) {
        return;
      }
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    });
  });

  return counts;
}

export function hasDuplicateNames(counts: Map<string, number>) {
  return Array.from(counts.values()).some((count) => count > 1);
}

export function isDuplicateName(counts: Map<string, number>, name: string) {
  return (counts.get(name.trim().toLowerCase()) ?? 0) > 1;
}
