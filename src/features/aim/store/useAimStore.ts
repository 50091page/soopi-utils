import { create } from "zustand";
import {
  DEFAULT_TARGET_DURATION_MS,
  MAX_TARGET_DURATION_MS,
  MIN_TARGET_DURATION_MS,
} from "../constants";

export type AimGameState = "idle" | "playing" | "paused" | "finished";
export type TargetStyleKey = "ember" | "mint" | "violet" | "sunset" | "frost";
export type TargetSizeMultiplier = 0.5 | 1 | 1.5 | 2;
export type TargetLifetimeMs = number;

type AimState = {
  score: number;
  misses: number;
  totalClicks: number;
  offTargetClicks: number;
  gameState: AimGameState;
  targetDuration: TargetLifetimeMs;
  targetStyle: TargetStyleKey;
  targetSizeMultiplier: TargetSizeMultiplier;
};

type AimActions = {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishGame: () => void;
  registerHit: () => void;
  registerMiss: () => void;
  registerOffTargetClick: () => void;
  setTargetStyle: (style: TargetStyleKey) => void;
  setTargetSizeMultiplier: (sizeMultiplier: TargetSizeMultiplier) => void;
  setTargetLifetimeMs: (duration: TargetLifetimeMs) => void;
  resetGame: () => void;
};

const initialState: AimState = {
  score: 0,
  misses: 0,
  totalClicks: 0,
  offTargetClicks: 0,
  gameState: "idle",
  targetDuration: DEFAULT_TARGET_DURATION_MS,
  targetStyle: "ember",
  targetSizeMultiplier: 1,
};

function pickPersistentOptions(state: AimState) {
  return {
    targetDuration: state.targetDuration,
    targetStyle: state.targetStyle,
    targetSizeMultiplier: state.targetSizeMultiplier,
  };
}

export const useAimStore = create<AimState & AimActions>((set) => ({
  ...initialState,
  startGame: () =>
    set((state) => ({
      score: 0,
      misses: 0,
      totalClicks: 0,
      offTargetClicks: 0,
      gameState: "playing",
      ...pickPersistentOptions(state),
    })),
  pauseGame: () =>
    set((state) => ({
      gameState: state.gameState === "playing" ? "paused" : state.gameState,
    })),
  resumeGame: () =>
    set((state) => ({
      gameState: state.gameState === "paused" ? "playing" : state.gameState,
    })),
  finishGame: () => set({ gameState: "finished" }),
  registerHit: () =>
    set((state) => ({
      totalClicks: state.totalClicks + 1,
      score: state.score + 1,
    })),
  registerMiss: () =>
    set((state) => ({
      misses: state.misses + 1,
    })),
  registerOffTargetClick: () =>
    set((state) => ({
      totalClicks: state.totalClicks + 1,
      offTargetClicks: state.offTargetClicks + 1,
    })),
  setTargetStyle: (style) => set({ targetStyle: style }),
  setTargetSizeMultiplier: (sizeMultiplier) => set({ targetSizeMultiplier: sizeMultiplier }),
  setTargetLifetimeMs: (duration) =>
    set({
      targetDuration: Math.max(MIN_TARGET_DURATION_MS, Math.min(MAX_TARGET_DURATION_MS, duration)),
    }),
  resetGame: () =>
    set((state) => ({
      ...initialState,
      ...pickPersistentOptions(state),
    })),
}));
