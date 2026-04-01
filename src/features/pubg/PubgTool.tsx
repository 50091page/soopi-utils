import { SwapToolPanel } from "../shared/SwapToolPanel";

const PUBG_ROWS = ["1티어", "2티어", "3티어", "4티어"];

type PubgToolProps = {
  allowEmptySwap?: boolean;
};

export function PubgTool({ allowEmptySwap = false }: PubgToolProps) {
  return (
    <SwapToolPanel
      title="배틀그라운드 팀 섞기"
      variant="pubg"
      rows={PUBG_ROWS}
      storageKey="shuffle.pubg.state.v2"
      legacyKeys={["shuffle.pubg.state", "soopi-utils.pubg.state"]}
      allowEmptySwap={allowEmptySwap}
      leftFallback="팀 1"
      rightFallback="팀 2"
      leftPlaceholder="플레이어 이름"
      rightPlaceholder="플레이어 이름"
    />
  );
}
