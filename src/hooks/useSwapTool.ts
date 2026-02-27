import { useEffect, useRef, useState } from "react";
import { SHUFFLE_ANIMATION_MS } from "../constants/shuffle.js";
import { useLocalStorage } from "./useLocalStorage.js";
import { shuffleSwapRows } from "../utils/shuffleSwap.js";
import type { RowPair } from "../types/swap.js";

type SwapToolState = {
  values: RowPair[];
  locks: boolean[];
  shuffleCount: number;
};

type UseSwapToolOptions = {
  storageKey: string;
  legacyKeys?: string[];
  rows: string[];
  allowEmptySwap?: boolean;
  leftFallback: string;
  rightFallback: string;
};

export const createDefaultSwapToolState = (rows: string[]): SwapToolState => ({
  values: rows.map(() => ({ left: "", right: "" })),
  locks: rows.map(() => false),
  shuffleCount: 0,
});

export function migrateSwapToolState(value: unknown, rows: string[]): SwapToolState {
  const defaults = createDefaultSwapToolState(rows);
  if (!value || typeof value !== "object") {
    return defaults;
  }

  const raw = value as Partial<SwapToolState>;
  return {
    values:
      Array.isArray(raw.values) && raw.values.length === rows.length
        ? raw.values.map((row) => ({
            left: typeof row?.left === "string" ? row.left : "",
            right: typeof row?.right === "string" ? row.right : "",
          }))
        : defaults.values,
    locks:
      Array.isArray(raw.locks) && raw.locks.length === rows.length
        ? raw.locks.map((lock) => Boolean(lock))
        : defaults.locks,
    shuffleCount: typeof raw.shuffleCount === "number" ? raw.shuffleCount : 0,
  };
}

export function formatRowsForCopy(
  values: RowPair[],
  leftFallback: string,
  rightFallback: string
) {
  const leftNames = values.map((pair) => pair.left.trim() || leftFallback);
  const rightNames = values.map((pair) => pair.right.trim() || rightFallback);
  const leftWidth = Math.max(...leftNames.map((name) => name.length));

  return leftNames.map((leftName, index) => `${leftName.padEnd(leftWidth, " ")}\t${rightNames[index]}`);
}

export function useSwapTool({
  storageKey,
  legacyKeys,
  rows,
  allowEmptySwap = false,
  leftFallback,
  rightFallback,
}: UseSwapToolOptions) {
  const [state, setState] = useLocalStorage<SwapToolState>(storageKey, createDefaultSwapToolState(rows), {
    legacyKeys,
    migrate: (value) => migrateSwapToolState(value, rows),
  });
  const [isShuffling, setIsShuffling] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<RowPair[] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const animationIntervalRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
      }
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const showNotice = (message: string) => {
    setToastMessage(null);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    requestAnimationFrame(() => {
      setToastMessage(message);
      toastTimerRef.current = window.setTimeout(() => {
        setToastMessage(null);
      }, 1400);
    });
  };

  const onValueChange = (index: number, side: "left" | "right", value: string) => {
    setState((prev) => {
      const nextValues = [...prev.values];
      const row = nextValues[index] ?? { left: "", right: "" };
      nextValues[index] = { ...row, [side]: value };
      return { ...prev, values: nextValues };
    });
  };

  const onLockChange = (index: number, value: boolean) => {
    setState((prev) => {
      const nextLocks = [...prev.locks];
      nextLocks[index] = value;
      return { ...prev, locks: nextLocks };
    });
  };

  const onShuffle = () => {
    if (isShuffling) {
      return;
    }

    const baseValues = state.values;
    const baseLocks = state.locks;
    const finalValues = shuffleSwapRows(
      baseValues.map((pair, index) => ({ ...pair, locked: baseLocks[index] })),
      allowEmptySwap
    ).map(({ left, right }) => ({ left, right }));

    setIsShuffling(true);
    setAnimatedValues(baseValues.map((pair) => ({ ...pair })));

    animationIntervalRef.current = window.setInterval(() => {
      setAnimatedValues((prev) => {
        const source = prev ?? baseValues;
        return source.map((pair, index) => {
          if (baseLocks[index]) {
            return pair;
          }
          if (Math.random() < 0.5) {
            return { left: pair.right, right: pair.left };
          }
          return pair;
        });
      });
    }, 80);

    animationTimeoutRef.current = window.setTimeout(() => {
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      setState((prev) => ({
        ...prev,
        shuffleCount: (prev.shuffleCount ?? 0) + 1,
        values: finalValues,
      }));
      setAnimatedValues(null);
      setIsShuffling(false);
      animationTimeoutRef.current = null;
    }, SHUFFLE_ANIMATION_MS);
  };

  const onResetCount = () => {
    setState((prev) => ({
      ...prev,
      shuffleCount: 0,
    }));
  };

  const onClearMembers = () => {
    setState((prev) => ({
      ...prev,
      values: prev.values.map(() => ({ left: "", right: "" })),
    }));
  };

  const onCopyRows = async () => {
    const copySource = animatedValues ?? state.values;
    const lines = formatRowsForCopy(copySource, leftFallback, rightFallback);
    const text = lines.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      showNotice("복사가 되었습니다.");
      return;
    } catch {
      showNotice("복사에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  };

  return {
    values: animatedValues ?? state.values,
    locks: state.locks,
    shuffleCount: state.shuffleCount ?? 0,
    isShuffling,
    toastMessage,
    busyDurationMs: SHUFFLE_ANIMATION_MS,
    onValueChange,
    onLockChange,
    onShuffle,
    onResetCount,
    onClearMembers,
    onCopyRows,
  };
}
