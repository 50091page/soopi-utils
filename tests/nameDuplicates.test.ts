import {
  buildNormalizedNameCounts,
  hasDuplicateNames,
  isDuplicateName,
} from "../src/utils/nameDuplicates.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runNameDuplicateTests() {
  const counts = buildNormalizedNameCounts([
    { left: " Alice ", right: "BOB" },
    { left: "alice", right: "" },
    { left: "charlie", right: "bob" },
  ]);

  assert(hasDuplicateNames(counts), "Duplicate detector should report duplicates.");
  assert(isDuplicateName(counts, "ALICE"), "Name check should be case-insensitive.");
  assert(isDuplicateName(counts, "bob"), "Right-side values should be included in duplicate checks.");
  assert(!isDuplicateName(counts, "delta"), "Unknown names should not be marked as duplicates.");
  console.log("name duplicate tests passed");
}
