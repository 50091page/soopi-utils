export const OVERWATCH_MAPS_BY_MODE = {
  쟁탈: ["네팔", "리장 타워", "부산", "사모아", "오아시스", "일리오스"],
  호위: ["66번 국도", "지브롤터", "도라도", "리알토", "샴발리 수도원", "서킷 로얄", "쓰레기촌", "하바나"],
  혼합: ["눔바니", "미드타운", "블리자드 월드", "아이헨발데", "왕의 길", "파라이수", "할리우드"],
  밀기: ["뉴 퀸 스트리트", "이스페란사", "콜로세오", "루나사피"],
  플래시포인트: ["뉴 정크 시티", "수라바사", "아틀리스"],
  점령: ["볼스카야", "아누비스 신전", "파리", "하나무라", "호라이즌 달 기지"],
} as const;

export type OverwatchMapMode = keyof typeof OVERWATCH_MAPS_BY_MODE;
export type OverwatchMapName = (typeof OVERWATCH_MAPS_BY_MODE)[OverwatchMapMode][number];

export const OVERWATCH_MODE_META: Record<
  OverwatchMapMode,
  {
    accent: string;
    cue: string;
  }
> = {
  쟁탈: { accent: "#65d4ff", cue: "라운드 교전" },
  호위: { accent: "#ffb35c", cue: "페이로드 이동" },
  혼합: { accent: "#a88cff", cue: "복합 목표" },
  밀기: { accent: "#76e3c2", cue: "로봇 전진" },
  플래시포인트: { accent: "#ff8f9e", cue: "순환 거점" },
  점령: { accent: "#f06f6f", cue: "2CP 클래식" },
};

export type OverwatchMapState = {
  selectedModes: OverwatchMapMode[];
  selectedMaps: OverwatchMapName[];
  lastDrawnMap: OverwatchMapName | null;
  drawCount: number;
};

export const OVERWATCH_MAP_MODES = Object.keys(OVERWATCH_MAPS_BY_MODE) as OverwatchMapMode[];
export const OVERWATCH_ALL_MAPS = OVERWATCH_MAP_MODES.flatMap((mode) => [...OVERWATCH_MAPS_BY_MODE[mode]]) as OverwatchMapName[];

export function isOverwatchMapName(value: unknown): value is OverwatchMapName {
  return typeof value === "string" && OVERWATCH_ALL_MAPS.includes(value as OverwatchMapName);
}

export function getVisibleOverwatchMaps(selectedModes: OverwatchMapMode[]) {
  return selectedModes.flatMap((mode) => OVERWATCH_MAPS_BY_MODE[mode]);
}

export function getCandidateOverwatchMaps(selectedModes: OverwatchMapMode[], selectedMaps: OverwatchMapName[]) {
  const visibleMapSet = new Set(getVisibleOverwatchMaps(selectedModes));
  return OVERWATCH_ALL_MAPS.filter((map) => visibleMapSet.has(map) && selectedMaps.includes(map));
}

export function createDefaultOverwatchMapState(): OverwatchMapState {
  return {
    selectedModes: [...OVERWATCH_MAP_MODES],
    selectedMaps: [...OVERWATCH_ALL_MAPS],
    lastDrawnMap: null,
    drawCount: 0,
  };
}

export function migrateOverwatchMapState(value: unknown): OverwatchMapState {
  const defaults = createDefaultOverwatchMapState();
  if (!value || typeof value !== "object") {
    return defaults;
  }

  const raw = value as Partial<OverwatchMapState>;
  const selectedModes =
    Array.isArray(raw.selectedModes) && raw.selectedModes.length > 0
      ? raw.selectedModes.filter((mode): mode is OverwatchMapMode => OVERWATCH_MAP_MODES.includes(mode as OverwatchMapMode))
      : defaults.selectedModes;
  const selectedMaps = Array.isArray(raw.selectedMaps)
    ? raw.selectedMaps.filter(isOverwatchMapName)
    : defaults.selectedMaps;

  return {
    selectedModes: selectedModes.length > 0 ? selectedModes : defaults.selectedModes,
    selectedMaps,
    lastDrawnMap: isOverwatchMapName(raw.lastDrawnMap) ? raw.lastDrawnMap : null,
    drawCount: typeof raw.drawCount === "number" && Number.isFinite(raw.drawCount) ? raw.drawCount : 0,
  };
}
