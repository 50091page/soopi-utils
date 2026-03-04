type AimTopHudProps = {
  scoreText: string;
  remainingText: string;
  targetDuration: number;
};

export function AimTopHud({ scoreText, remainingText, targetDuration }: AimTopHudProps) {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
        <div className="aim-top-scoreboard">
          <p className="aim-top-scoreboard-item">
            <span className="aim-top-scoreboard-label">점수</span>
            <span className="aim-top-scoreboard-value">{scoreText}</span>
          </p>
          <p className="aim-top-scoreboard-item">
            <span className="aim-top-scoreboard-label">남음</span>
            <span className="aim-top-scoreboard-value">{remainingText}</span>
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3">
        <span className="aim-speed-chip">{targetDuration}ms</span>
      </div>
    </>
  );
}
