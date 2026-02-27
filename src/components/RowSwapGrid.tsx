import { useMemo, type CSSProperties } from "react";
import { buildNormalizedNameCounts, hasDuplicateNames, isDuplicateName } from "../utils/nameDuplicates";
import type { RowPair } from "../types/swap";

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
  busyDurationMs?: number;
  secondaryActions?: Array<{
    label: string;
    tone?: "default" | "accent";
    onClick: () => void;
  }>;
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
  busyDurationMs = 820,
  secondaryActions,
  onValueChange,
  onLockChange,
  onShuffle,
  onResetCount,
  onClearMembers,
}: RowSwapGridProps) {
  const shuffleLabel = isBusy ? "섞는 중..." : shuffleCount > 0 ? String(shuffleCount) : "돌리기";

  const normalizedCounts = useMemo(() => buildNormalizedNameCounts(values), [values]);

  const hasDuplicates = useMemo(() => hasDuplicateNames(normalizedCounts), [normalizedCounts]);

  const indexedRows = useMemo(
    () => rows.map((row, index) => ({ label: row, index })),
    [rows]
  );

  return (
      <section
      className={`tool-card tool-card-${variant}${isBusy ? " is-busy" : ""}`}
      style={{ "--busy-duration": `${busyDurationMs}ms` } as CSSProperties}
    >
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
                disabled={isBusy}
              >
                <span>{label}</span>
                {locks[index] ? <span className="lock-pill">고정</span> : null}
              </button>
            </div>

            <input
              className={`name-input${useTeamTint ? " team-blue" : ""}${
                isDuplicateName(normalizedCounts, values[index]?.left ?? "")
                  ? " is-duplicate"
                  : (values[index]?.left ?? "").trim()
                    ? " is-filled"
                    : " is-empty"
              }`}
              value={values[index]?.left ?? ""}
              placeholder={leftPlaceholder}
              aria-label={`${label} ${leftPlaceholder || "왼쪽팀"} 이름`}
              disabled={isBusy}
              aria-invalid={
                isDuplicateName(normalizedCounts, values[index]?.left ?? "") ? true : undefined
              }
              onChange={(event) => onValueChange(index, "left", event.target.value)}
            />
            <input
              className={`name-input${useTeamTint ? " team-red" : ""}${
                isDuplicateName(normalizedCounts, values[index]?.right ?? "")
                  ? " is-duplicate"
                  : (values[index]?.right ?? "").trim()
                    ? " is-filled"
                    : " is-empty"
              }`}
              value={values[index]?.right ?? ""}
              placeholder={rightPlaceholder}
              aria-label={`${label} ${rightPlaceholder || "오른쪽팀"} 이름`}
              disabled={isBusy}
              aria-invalid={
                isDuplicateName(normalizedCounts, values[index]?.right ?? "") ? true : undefined
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
          {secondaryActions?.map((action) => (
            <button
              type="button"
              className={`btn${action.tone === "accent" ? " accent" : ""}`}
              onClick={action.onClick}
              disabled={isBusy}
              key={action.label}
            >
              {action.label}
            </button>
          ))}
          <button type="button" className="btn danger" onClick={onClearMembers} disabled={isBusy}>
            지우기
          </button>
        </div>
      </div>
    </section>
  );
}
