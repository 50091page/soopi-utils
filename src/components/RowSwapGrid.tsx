import { useMemo, useRef } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Clipboard,
  Lock,
  RotateCcw,
  Shuffle,
  Trash2,
  Unlock,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { buildNormalizedNameCounts, hasDuplicateNames, isDuplicateName } from "../utils/nameDuplicates";
import type { RowPair } from "../types/swap";

type ActionTone = "default" | "accent" | "danger";

type GridAction = {
  label: string;
  icon?: "copy" | "reset";
  tone?: ActionTone;
  onClick: () => void;
};

type NameInputProps = {
  inputRef?: (node: HTMLInputElement | null) => void;
  value: string;
  rowLabel: string;
  placeholder: string;
  isBusy: boolean;
  isLocked: boolean;
  isDuplicate: boolean;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function NameInput({
  inputRef,
  value,
  rowLabel,
  placeholder,
  isBusy,
  isLocked,
  isDuplicate,
  onChange,
  onKeyDown,
}: NameInputProps) {
  const stateClass = `${isDuplicate ? " is-duplicate" : value.trim() ? " is-filled" : " is-empty"}${
    isLocked ? " is-locked" : ""
  }`;

  return (
    <input
      ref={inputRef}
      className={`shv0-input${stateClass}`}
      value={value}
      placeholder={placeholder}
      aria-label={`${rowLabel} ${placeholder || "팀"} 이름`}
      disabled={isBusy}
      aria-invalid={isDuplicate ? true : undefined}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}

type RowSwapGridProps = {
  title: string;
  variant?: "lol" | "pubg";
  shuffleCount: number;
  isBusy?: boolean;
  rows: string[];
  values: RowPair[];
  locks: boolean[];
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  secondaryActions?: GridAction[];
  onValueChange: (index: number, side: "left" | "right", value: string) => void;
  onLockChange: (index: number, value: boolean) => void;
  onShuffle: () => void;
  onResetCount: () => void;
  onClearMembers: () => void;
};

export function RowSwapGrid({
  title,
  variant = "lol",
  shuffleCount,
  isBusy = false,
  rows,
  values,
  locks,
  leftPlaceholder = "",
  rightPlaceholder = "",
  secondaryActions,
  onValueChange,
  onLockChange,
  onShuffle,
  onResetCount,
  onClearMembers,
}: RowSwapGridProps) {
  const isLol = variant === "lol";
  const lolIconSrc = `${import.meta.env.BASE_URL}img/lol.png`;
  const pubgIconSrc = `${import.meta.env.BASE_URL}img/pubg.png`;
  const shuffleLabel = isBusy ? "섞는 중..." : shuffleCount > 0 ? `섞기(${shuffleCount})` : "섞기";

  const normalizedCounts = useMemo(() => buildNormalizedNameCounts(values), [values]);

  const hasDuplicates = useMemo(() => hasDuplicateNames(normalizedCounts), [normalizedCounts]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const indexedRows = useMemo(
    () => rows.map((row, index) => ({ label: row, index })),
    [rows]
  );
  const utilityActions = useMemo<GridAction[]>(
    () => [
      { label: "초기화", icon: "reset", tone: "default", onClick: onResetCount },
      ...(secondaryActions ?? []),
    ],
    [onResetCount, secondaryActions]
  );

  const moveFocusToPreviousInput = (flatIndex: number) => {
    const prev = inputRefs.current[flatIndex - 1];
    if (prev) {
      prev.focus();
      prev.setSelectionRange(prev.value.length, prev.value.length);
    }
  };

  return (
    <section className={`shv0-card${isLol ? " is-lol" : " is-pubg"}`}>
      <header className="shv0-card-header">
        <div className="shv0-card-header-left">
          <div className="shv0-card-icon">
            {isLol ? (
              <img src={lolIconSrc} alt="" className="shv0-card-icon-img" />
            ) : (
              <img src={pubgIconSrc} alt="" className="shv0-card-icon-img shv0-card-icon-img-pubg" />
            )}
          </div>
          <h2 className="shv0-card-title">{title}</h2>
        </div>
        <button
          type="button"
          className="shv0-clear-btn"
          onClick={onClearMembers}
          disabled={isBusy}
          aria-label="지우기"
        >
          <Trash2 size={14} />
        </button>
      </header>

      <div className="shv0-card-content">

        <div className="shv0-card-columns" aria-hidden="true">
          <span className="col-role" />
          <span className="col-lock" />
          <span className="col-team">{isLol ? "Blue" : "Team 1"}</span>
          <span className="col-arrow" />
          <span className="col-team">{isLol ? "Red" : "Team 2"}</span>
        </div>

        <div className="shv0-row-list">
          {indexedRows.map(({ label, index }) => {
            const left = values[index]?.left ?? "";
            const right = values[index]?.right ?? "";
            const locked = locks[index];
            const leftDup = isDuplicateName(normalizedCounts, left);
            const rightDup = isDuplicateName(normalizedCounts, right);

            return (
              <div className={`shv0-row${locked ? " is-locked" : ""}`} key={label}>
                <span className="shv0-role">{label}</span>

                <button
                  type="button"
                  className={`shv0-lock-toggle${locked ? " is-locked" : ""}`}
                  onClick={() => onLockChange(index, !locked)}
                  aria-pressed={locked}
                  aria-label={locked ? "Unlock row" : "Lock row"}
                  title={locked ? "클릭하면 고정 해제됩니다." : "클릭하면 이 줄이 고정됩니다."}
                  data-tip={locked ? "클릭하면 고정 해제됩니다." : "클릭하면 이 줄이 고정됩니다."}
                  tabIndex={-1}
                  disabled={isBusy}
                >
                  {locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>

                <div className="shv0-input-wrap">
                  <NameInput
                    inputRef={(node) => {
                      inputRefs.current[index * 2] = node;
                    }}
                    value={left}
                    rowLabel={label}
                    placeholder={leftPlaceholder || "Player name..."}
                    isBusy={isBusy}
                    isLocked={locked}
                    isDuplicate={leftDup}
                    onChange={(value) => onValueChange(index, "left", value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && left.length === 0) {
                        event.preventDefault();
                        moveFocusToPreviousInput(index * 2);
                      }
                    }}
                  />
                  {leftDup ? <AlertTriangle className="shv0-dup-icon" size={14} /> : null}
                </div>

                <ArrowLeftRight className="shv0-arrow" size={14} />

                <div className="shv0-input-wrap">
                  <NameInput
                    inputRef={(node) => {
                      inputRefs.current[index * 2 + 1] = node;
                    }}
                    value={right}
                    rowLabel={label}
                    placeholder={rightPlaceholder || "Player name..."}
                    isBusy={isBusy}
                    isLocked={locked}
                    isDuplicate={rightDup}
                    onChange={(value) => onValueChange(index, "right", value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && right.length === 0) {
                        event.preventDefault();
                        moveFocusToPreviousInput(index * 2 + 1);
                      }
                    }}
                  />
                  {rightDup ? <AlertTriangle className="shv0-dup-icon" size={14} /> : null}
                </div>
              </div>
            );
          })}
        </div>

        {hasDuplicates ? (
          <div className="shv0-warning">
            <AlertTriangle size={14} />
            <span>Duplicate names detected.</span>
          </div>
        ) : null}
      </div>

      <footer className="shv0-footer">
        <button type="button" className="shv0-shuffle-btn" onClick={onShuffle} disabled={isBusy}>
          <Shuffle size={15} />
          {shuffleLabel}
        </button>

        <div className="shv0-actions">
          {utilityActions.map((action) => {
            const icon = action.icon === "copy" ? <Clipboard size={14} /> : action.icon === "reset" ? <RotateCcw size={14} /> : null;

            return (
              <button
                type="button"
                className={`shv0-action-btn${
                  action.tone === "danger" ? " is-danger" : action.tone === "accent" ? " is-outline" : " is-ghost"
                }`}
                onClick={action.onClick}
                disabled={isBusy}
                key={action.label}
                aria-label={action.label}
              >
                {icon}
                {action.label}
              </button>
            );
          })}
        </div>
      </footer>
    </section>
  );
}
