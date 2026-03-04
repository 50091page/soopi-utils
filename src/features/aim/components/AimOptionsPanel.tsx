import type { TargetLifetimeMs, TargetSizeMultiplier, TargetStyleKey } from "../store/useAimStore";

type TargetStyleOption = { key: TargetStyleKey; label: string; swatch: string };
type TargetSizeOption = { value: TargetSizeMultiplier; label: string; previewPx: number };

type AimOptionsPanelProps = {
  targetStyle: TargetStyleKey;
  targetDuration: TargetLifetimeMs;
  targetSizeMultiplier: TargetSizeMultiplier;
  targetStyleOptions: TargetStyleOption[];
  targetSizeOptions: TargetSizeOption[];
  minDuration: number;
  maxDuration: number;
  stepDuration: number;
  onSelectStyle: (style: TargetStyleKey) => void;
  onSelectSize: (size: TargetSizeMultiplier) => void;
  onSelectDuration: (duration: TargetLifetimeMs) => void;
};

export function AimOptionsPanel({
  targetStyle,
  targetDuration,
  targetSizeMultiplier,
  targetStyleOptions,
  targetSizeOptions,
  minDuration,
  maxDuration,
  stepDuration,
  onSelectStyle,
  onSelectSize,
  onSelectDuration,
}: AimOptionsPanelProps) {
  return (
    <div className="pointer-events-auto aim-style-picker">
      <p className="aim-style-picker-title">Target Style</p>
      {targetStyleOptions.map((option) => (
        <button
          type="button"
          key={option.key}
          className={`aim-style-option${targetStyle === option.key ? " is-selected" : ""}`}
          onClick={() => onSelectStyle(option.key)}
          role="option"
          aria-selected={targetStyle === option.key}
        >
          <span className="aim-style-option-swatch" style={{ background: option.swatch }} />
          <span>{option.label}</span>
        </button>
      ))}

      <p className="aim-style-picker-title is-section-gap">Target Size</p>
      <div className="aim-option-row" role="listbox" aria-label="타겟 크기 선택">
        {targetSizeOptions.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`aim-size-option${targetSizeMultiplier === option.value ? " is-selected" : ""}`}
            onClick={() => onSelectSize(option.value)}
            role="option"
            aria-selected={targetSizeMultiplier === option.value}
          >
            <span
              className="aim-size-option-preview"
              style={{ width: `${option.previewPx}px`, height: `${option.previewPx}px` }}
              aria-hidden="true"
            />
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <p className="aim-style-picker-title is-section-gap">Fade Speed</p>
      <div className="aim-fade-slider-wrap">
        <input
          type="range"
          min={minDuration}
          max={maxDuration}
          step={stepDuration}
          value={targetDuration}
          className="aim-fade-slider"
          onChange={(event) => onSelectDuration(Number(event.currentTarget.value) as TargetLifetimeMs)}
          aria-label="타겟 사라지는 속도"
        />
        <span className="aim-fade-slider-value">{targetDuration}ms</span>
      </div>
    </div>
  );
}
