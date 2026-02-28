import { SwapToolPanel } from "../shared/SwapToolPanel";

const PUBG_ROWS = ["1티어", "2티어", "3티어", "4티어"];

type PubgToolProps = {
  allowEmptySwap?: boolean;
};

export function PubgTool({ allowEmptySwap = false }: PubgToolProps) {
  return (
    <SwapToolPanel
      title="PUBG 팀 섞기"
      variant="pubg"
      lockGuide="티어를 클릭하면 고정됩니다."
      rows={PUBG_ROWS}
      storageKey="shuffle.pubg.state.v2"
      legacyKeys={["shuffle.pubg.state", "soopi-utils.pubg.state"]}
      allowEmptySwap={allowEmptySwap}
      leftFallback="왼쪽팀"
      rightFallback="오른쪽팀"
    />
  );
}
