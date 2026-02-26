import { RowSwapGrid } from "../../components/RowSwapGrid";
import { useSwapTool } from "../../hooks/useSwapTool";

const PUBG_ROWS = ["1티어", "2티어", "3티어", "4티어"];

type PubgToolProps = {
  allowEmptySwap?: boolean;
};

export function PubgTool({ allowEmptySwap = false }: PubgToolProps) {
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
    storageKey: "shuffle.pubg.state.v2",
    legacyKeys: ["shuffle.pubg.state", "soopi-utils.pubg.state"],
    rows: PUBG_ROWS,
    allowEmptySwap,
    leftFallback: "왼쪽팀",
    rightFallback: "오른쪽팀",
  });

  return (
    <>
      <RowSwapGrid
        title="PUBG 팀 섞기"
        variant="pubg"
        lockGuide="티어를 클릭하면 고정됩니다."
        shuffleCount={shuffleCount}
        isBusy={isShuffling}
        busyDurationMs={busyDurationMs}
        rows={PUBG_ROWS}
        values={values}
        locks={locks}
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
