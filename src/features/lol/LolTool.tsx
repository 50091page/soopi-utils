import { SwapToolPanel } from "../shared/SwapToolPanel";

const LOL_ROWS = ["탑", "정글", "미드", "원딜", "서폿"];

type LolToolProps = {
  allowEmptySwap?: boolean;
};

export function LolTool({ allowEmptySwap = false }: LolToolProps) {
  return (
    <SwapToolPanel
      title="LoL 팀 섞기"
      variant="lol"
      lockGuide="포지션을 클릭하면 고정됩니다."
      rows={LOL_ROWS}
      storageKey="shuffle.lol.state.v2"
      legacyKeys={["shuffle.lol.state", "soopi-utils.lol.state"]}
      allowEmptySwap={allowEmptySwap}
      leftFallback="블루팀"
      rightFallback="레드팀"
      useTeamTint={true}
      leftPlaceholder="블루팀"
      rightPlaceholder="레드팀"
    />
  );
}

