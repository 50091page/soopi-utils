import { useMemo } from "react";

export type RowPair = {
  left: string;
  right: string;
};

type RowSwapGridProps = {
  title: string;
  rows: string[];
  values: RowPair[];
  locks: boolean[];
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  extraAction?: {
    label: string;
    onClick: () => void;
  };
  onValueChange: (index: number, side: "left" | "right", value: string) => void;
  onLockChange: (index: number, value: boolean) => void;
  onShuffle: () => void;
  onClearInputs: () => void;
};

export function RowSwapGrid({
  title,
  rows,
  values,
  locks,
  leftPlaceholder = "",
  rightPlaceholder = "",
  extraAction,
  onValueChange,
  onLockChange,
  onShuffle,
  onClearInputs,
}: RowSwapGridProps) {
  const indexedRows = useMemo(
    () => rows.map((row, index) => ({ label: row, index })),
    [rows]
  );

  return (
    <section className="tool-card">
      <h2>{title}</h2>

      <div className="row-list">
        {indexedRows.map(({ label, index }) => (
          <div className="row-item" key={label}>
            <div className="row-label">
              <div className="row-label-main">
                <span>{label}</span>
                {locks[index] ? <span className="lock-pill">고정</span> : null}
              </div>
              <label className="lock-checkbox">
                <input
                  type="checkbox"
                  checked={locks[index]}
                  onChange={(event) => onLockChange(index, event.target.checked)}
                />
                <span className="lock-checkmark" aria-hidden="true" />
              </label>
            </div>

            <input
              className="name-input"
              value={values[index]?.left ?? ""}
              placeholder={leftPlaceholder}
              onChange={(event) => onValueChange(index, "left", event.target.value)}
            />
            <input
              className="name-input"
              value={values[index]?.right ?? ""}
              placeholder={rightPlaceholder}
              onChange={(event) => onValueChange(index, "right", event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="button-row">
        <button type="button" className="btn primary" onClick={onShuffle}>
          돌리기
        </button>
        <button type="button" className="btn" onClick={onClearInputs}>
          입력 초기화
        </button>
        {extraAction ? (
          <button type="button" className="btn" onClick={extraAction.onClick}>
            {extraAction.label}
          </button>
        ) : null}
      </div>
    </section>
  );
}
