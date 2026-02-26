import { useMemo } from "react";

export type RowPair = {
  left: string;
  right: string;
};

type RowSwapGridProps = {
  title: string;
  lockGuide: string;
  shuffleCount: number;
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
  lockGuide,
  shuffleCount,
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
  const shuffleLabel = shuffleCount > 0 ? String(shuffleCount) : "돌리기";

  const indexedRows = useMemo(
    () => rows.map((row, index) => ({ label: row, index })),
    [rows]
  );

  return (
    <section className="tool-card">
      <h2>{title}</h2>
      <p className="lock-guide">{lockGuide}</p>
      <div className="row-list">
        {indexedRows.map(({ label, index }) => (
          <div className="row-item" key={label}>
            <div className="row-label">
              <button
                type="button"
                className={`row-lock-toggle${locks[index] ? " is-locked" : ""}`}
                onClick={() => onLockChange(index, !locks[index])}
                aria-pressed={locks[index]}
              >
                <span>{label}</span>
                {locks[index] ? <span className="lock-pill">고정</span> : null}
              </button>
            </div>

            <input
              className={`name-input${useTeamTint ? " team-blue" : ""}`}
              value={values[index]?.left ?? ""}
              placeholder={leftPlaceholder}
              onChange={(event) => onValueChange(index, "left", event.target.value)}
            />
            <input
              className={`name-input${useTeamTint ? " team-red" : ""}`}
              value={values[index]?.right ?? ""}
              placeholder={rightPlaceholder}
              onChange={(event) => onValueChange(index, "right", event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="button-row">
        <button type="button" className="btn primary" onClick={onShuffle}>
          {shuffleLabel}
        </button>
        <button type="button" className="btn" onClick={onResetCount}>
          초기화
        </button>
        {extraAction ? (
          <button type="button" className="btn" onClick={extraAction.onClick}>
            {extraAction.label}
          </button>
        ) : null}
        <button type="button" className="btn danger" onClick={onClearMembers}>
          지우기
        </button>
      </div>
    </section>
  );
}
