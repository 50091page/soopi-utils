import type { TargetLifetimeMs } from "./store/useAimStore";

export const TOTAL_TARGETS = 30;
export const TARGET_RADIUS = 15;

export const SPAWN_DURATION_MS = 180;
export const MISS_FADE_DURATION_MS = 170;

export const MIN_TARGET_DURATION_MS: TargetLifetimeMs = 500;
export const MAX_TARGET_DURATION_MS: TargetLifetimeMs = 1000;
export const DEFAULT_TARGET_DURATION_MS: TargetLifetimeMs = 1000;
export const TARGET_DURATION_STEP_MS = 50;
