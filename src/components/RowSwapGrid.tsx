import { useMemo } from "react";

export type RowPair = {
  left: string;
  right: string;
};

type RowSwapGridProps = {
  title: string;
  variant?: "lol" | "pubg";
  lockGuide: string;
  shuffleCount: number;
  isBusy?: boolean;
  rows: string[];
  values: RowPair[];
  locks: boolean[];
  useTeamTint?: boolean;
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  extraAction?: {
    label: string;
    onClick: () => void;
  };
  onValueChange: (index: number, side: "left" | "right", value: string) => void;
  onLockChange: (index: number, value: boolean) => void;
  onShuffle: () => void;
  onResetCount: () => void;
  onClearMembers: () => void;
};

export function RowSwapGrid({
  title,
  variant = "lol",
  lockGuide,
  shuffleCount,
  isBusy = false,
  rows,
  values,
  locks,
  useTeamTint = false,
  leftPlaceholder = "",
  rightPlaceholder = "",
  extraAction,
  onValueChange,
  onLockChange,
  onShuffle,
  onResetCount,
  onClearMembers,
}: RowSwapGridProps) {
  const shuffleLabel = isBusy ? "섞는 중..." : shuffleCount > 0 ? String(shuffleCount) : "돌리기";

  const normalizedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    values.forEach((row) => {
      [row.left, row.right].forEach((name) => {
        const normalized = name.trim().toLowerCase();
        if (!normalized) {
          return;
        }
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      });
    });
    return counts;
  }, [values]);

  const hasDuplicates = useMemo(
    () => Array.from(normalizedCounts.values()).some((count) => count > 1),
    [normalizedCounts]
  );

  const indexedRows = useMemo(
    () => rows.map((row, index) => ({ label: row, index })),
    [rows]
  );

  return (
    <section className={`tool-card tool-card-${variant}${isBusy ? " is-busy" : ""}`}>
      <div className="tool-card-head">
        <h2>{title}</h2>
      </div>
      <p className="lock-guide">{lockGuide}</p>
      {hasDuplicates ? <p className="duplicate-guide">중복된 이름이 있습니다.</p> : null}
      <div className="row-list">
        {indexedRows.map(({ label, index }) => (
          <div className={`row-item${locks[index] ? " is-locked" : ""}`} key={label}>
            <div className="row-label">
              <button
                type="button"
                className={`row-lock-toggle${locks[index] ? " is-locked" : ""}`}
                onClick={() => onLockChange(index, !locks[index])}
                aria-pressed={locks[index]}
                tabIndex={-1}
                disabled={isBusy}
              >
                <span>{label}</span>
                {locks[index] ? <span className="lock-pill">고정</span> : null}
              </button>
            </div>

            <input
              className={`name-input${useTeamTint ? " team-blue" : ""}${
                (normalizedCounts.get((values[index]?.left ?? "").trim().toLowerCase()) ?? 0) > 1
                  ? " is-duplicate"
                  : (values[index]?.left ?? "").trim()
                    ? " is-filled"
                    : " is-empty"
              }`}
              value={values[index]?.left ?? ""}
              placeholder={leftPlaceholder}
              disabled={isBusy}
              aria-invalid={
                (normalizedCounts.get((values[index]?.left ?? "").trim().toLowerCase()) ?? 0) > 1
                  ? true
                  : undefined
              }
              onChange={(event) => onValueChange(index, "left", event.target.value)}
            />
            <input
              className={`name-input${useTeamTint ? " team-red" : ""}${
                (normalizedCounts.get((values[index]?.right ?? "").trim().toLowerCase()) ?? 0) > 1
                  ? " is-duplicate"
                  : (values[index]?.right ?? "").trim()
                    ? " is-filled"
                    : " is-empty"
              }`}
              value={values[index]?.right ?? ""}
              placeholder={rightPlaceholder}
              disabled={isBusy}
              aria-invalid={
                (normalizedCounts.get((values[index]?.right ?? "").trim().toLowerCase()) ?? 0) > 1
                  ? true
                  : undefined
              }
              onChange={(event) => onValueChange(index, "right", event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="button-row">
        <div className="btn-group btn-group-primary">
          <button type="button" className="btn primary" onClick={onShuffle} disabled={isBusy}>
            {shuffleLabel}
          </button>
        </div>
        <div className="btn-group btn-group-secondary">
          <button type="button" className="btn" onClick={onResetCount} disabled={isBusy}>
            초기화
          </button>
          {extraAction ? (
            <button type="button" className="btn" onClick={extraAction.onClick} disabled={isBusy}>
              {extraAction.label}
            </button>
          ) : null}
          <button type="button" className="btn danger" onClick={onClearMembers} disabled={isBusy}>
            지우기
          </button>
        </div>
      </div>
    </section>
  );
}
