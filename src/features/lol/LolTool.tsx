import { RowSwapGrid } from "../../components/RowSwapGrid";
import { useSwapTool } from "../../hooks/useSwapTool";

const LOL_ROWS = ["탑", "정글", "미드", "원딜", "서폿"];

type LolToolProps = {
  allowEmptySwap?: boolean;
};

export function LolTool({ allowEmptySwap = false }: LolToolProps) {
  const {
    values,
    locks,
    shuffleCount,
    isShuffling,
    toastMessage,
    busyDurationMs,
    onValueChange,
    onLockChange,
    onShuffle,
    onResetCount,
    onClearMembers,
    onCopyRows,
  } = useSwapTool({
    storageKey: "shuffle.lol.state.v2",
    legacyKeys: ["shuffle.lol.state", "soopi-utils.lol.state"],
    rows: LOL_ROWS,
    allowEmptySwap,
    leftFallback: "블루팀",
    rightFallback: "레드팀",
  });

  return (
    <>
      <RowSwapGrid
        title="LoL 팀 섞기"
        variant="lol"
        lockGuide="포지션을 클릭하면 고정됩니다."
        shuffleCount={shuffleCount}
        isBusy={isShuffling}
        busyDurationMs={busyDurationMs}
        useTeamTint={true}
        rows={LOL_ROWS}
        values={values}
        locks={locks}
        leftPlaceholder="블루팀"
        rightPlaceholder="레드팀"
        onValueChange={onValueChange}
        onLockChange={onLockChange}
        onShuffle={onShuffle}
        onResetCount={onResetCount}
        onClearMembers={onClearMembers}
        secondaryActions={[
          { label: "복사하기", tone: "accent", onClick: onCopyRows },
        ]}
      />
      {toastMessage ? (
        <div className="toast-notice" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
    </>
  );
}

