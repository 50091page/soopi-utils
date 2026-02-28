import { RowSwapGrid } from "../../components/RowSwapGrid";
import { useSwapTool } from "../../hooks/useSwapTool";

type SwapToolPanelProps = {
  title: string;
  variant: "lol" | "pubg";
  lockGuide: string;
  rows: string[];
  storageKey: string;
  legacyKeys: string[];
  leftFallback: string;
  rightFallback: string;
  allowEmptySwap?: boolean;
  useTeamTint?: boolean;
  leftPlaceholder?: string;
  rightPlaceholder?: string;
};

export function SwapToolPanel({
  title,
  variant,
  lockGuide,
  rows,
  storageKey,
  legacyKeys,
  leftFallback,
  rightFallback,
  allowEmptySwap = false,
  useTeamTint = false,
  leftPlaceholder,
  rightPlaceholder,
}: SwapToolPanelProps) {
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
    storageKey,
    legacyKeys,
    rows,
    allowEmptySwap,
    leftFallback,
    rightFallback,
  });

  return (
    <>
      <RowSwapGrid
        title={title}
        variant={variant}
        lockGuide={lockGuide}
        shuffleCount={shuffleCount}
        isBusy={isShuffling}
        busyDurationMs={busyDurationMs}
        useTeamTint={useTeamTint}
        rows={rows}
        values={values}
        locks={locks}
        leftPlaceholder={leftPlaceholder}
        rightPlaceholder={rightPlaceholder}
        onValueChange={onValueChange}
        onLockChange={onLockChange}
        onShuffle={onShuffle}
        onResetCount={onResetCount}
        onClearMembers={onClearMembers}
        secondaryActions={[{ label: "복사하기", tone: "accent", onClick: onCopyRows }]}
      />
      {toastMessage ? (
        <div className="toast-notice" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
    </>
  );
}
