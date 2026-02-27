import {
  createDefaultSwapToolState,
  formatRowsForCopy,
  migrateSwapToolState,
} from "../src/hooks/useSwapTool.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function runDefaultStateTest() {
  const rows = ["탑", "정글", "미드"];
  const state = createDefaultSwapToolState(rows);

  assert(state.values.length === 3, "Default state must create values for each row.");
  assert(state.locks.length === 3, "Default state must create locks for each row.");
  assert(state.shuffleCount === 0, "Default shuffle count should be 0.");
}

function runMigrateStateTest() {
  const rows = ["1티어", "2티어"];
  const migrated = migrateSwapToolState(
    {
      values: [{ left: "A", right: "B" }, { left: 123, right: null }],
      locks: [true, "x"],
      shuffleCount: 7,
    },
    rows
  );

  assert(migrated.values[0].left === "A" && migrated.values[0].right === "B", "Valid values should be preserved.");
  assert(migrated.values[1].left === "" && migrated.values[1].right === "", "Invalid value entries should fallback.");
  assert(migrated.locks[0] === true && migrated.locks[1] === true, "Locks should be normalized to boolean.");
  assert(migrated.shuffleCount === 7, "Shuffle count should be preserved when valid.");
}

function runFormatRowsForCopyTest() {
  const lines = formatRowsForCopy(
    [
      { left: "블루", right: "레드" },
      { left: "", right: "  " },
    ],
    "왼쪽팀",
    "오른쪽팀"
  );

  assert(lines.length === 2, "Copy formatter should return one line per row.");
  assert(lines[0].includes("\t레드"), "Each line should contain tab-separated teams.");
  assert(lines[1].includes("왼쪽팀") && lines[1].includes("오른쪽팀"), "Fallback labels should be applied.");
}

export function runUseSwapToolHelperTests() {
  runDefaultStateTest();
  runMigrateStateTest();
  runFormatRowsForCopyTest();
  console.log("useSwapTool helper tests passed");
}
