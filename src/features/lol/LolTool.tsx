import { SwapToolPanel } from "../shared/SwapToolPanel";

const LOL_ROWS = ["탑", "정글", "미드", "원딜", "서폿"];

type LolToolProps = {
  allowEmptySwap?: boolean;
};

export function LolTool({ allowEmptySwap = false }: LolToolProps) {
  return (
    <SwapToolPanel
      title="리그오브레전드 팀 섞기"
      variant="lol"
      rows={LOL_ROWS}
      storageKey="shuffle.lol.state.v2"
      legacyKeys={["shuffle.lol.state", "soopi-utils.lol.state"]}
      allowEmptySwap={allowEmptySwap}
      leftFallback="블루팀"
      rightFallback="레드팀"
      leftPlaceholder="블루팀"
      rightPlaceholder="레드팀"
    />
  );
}

