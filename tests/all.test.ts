import { runNameDuplicateTests } from "./nameDuplicates.test.js";
import { runShuffleSwapTests } from "./shuffleSwap.test.js";
import { runUseSwapToolHelperTests } from "./useSwapTool.helpers.test.js";

function runAllTests() {
  runShuffleSwapTests();
  runUseSwapToolHelperTests();
  runNameDuplicateTests();
  console.log("all tests passed");
}

runAllTests();
