import {
  createDefaultOverwatchMapState,
  getCandidateOverwatchMaps,
  getVisibleOverwatchMaps,
  migrateOverwatchMapState,
} from "../src/features/overwatch/overwatchMaps.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function runDefaultOverwatchMapStateTest() {
  const state = createDefaultOverwatchMapState();

  assert(state.selectedModes.length === 6, "Default map state should enable every mode.");
  assert(state.selectedMaps.length > 0, "Default map state should include a map pool.");
  assert(state.lastDrawnMap === null, "Default drawn map should be empty.");
}

function runVisibleMapFilterTest() {
  const maps = getVisibleOverwatchMaps(["밀기", "점령"]);

  assert(maps.includes("콜로세오"), "Visible map helper should include maps from selected modes.");
  assert(maps.includes("하나무라"), "Visible map helper should include every selected mode.");
  assert(!maps.includes("부산"), "Visible map helper should exclude maps from unselected modes.");
}

function runCandidateMapFilterTest() {
  const maps = getCandidateOverwatchMaps(["호위"], ["리알토", "하바나", "부산"]);

  assert(maps.length === 2, "Candidate maps should be the intersection of selected modes and selected maps.");
  assert(maps.includes("리알토") && maps.includes("하바나"), "Valid candidate maps should be preserved.");
}

function runMigrateOverwatchMapStateTest() {
  const migrated = migrateOverwatchMapState({
    selectedModes: ["플래시포인트", "없는모드"],
    selectedMaps: ["수라바사", 123, "없는맵"],
    lastDrawnMap: "수라바사",
    drawCount: 5,
  });

  assert(migrated.selectedModes.length === 1 && migrated.selectedModes[0] === "플래시포인트", "Modes should migrate with known values only.");
  assert(migrated.selectedMaps.length === 1 && migrated.selectedMaps[0] === "수라바사", "Maps should migrate with known values only.");
  assert(migrated.lastDrawnMap === "수라바사", "Known drawn map should be preserved.");
  assert(migrated.drawCount === 5, "Draw count should be preserved.");
}

export function runOverwatchMapTests() {
  runDefaultOverwatchMapStateTest();
  runVisibleMapFilterTest();
  runCandidateMapFilterTest();
  runMigrateOverwatchMapStateTest();
  console.log("overwatch map tests passed");
}
