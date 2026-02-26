import { useEffect, useRef, useState } from "react";
import { RowSwapGrid, type RowPair } from "../../components/RowSwapGrid";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { shuffleSwapRows } from "../../utils/shuffleSwap";

const PUBG_ROWS = ["1티어", "2티어", "3티어", "4티어"];

type PubgState = {
  values: RowPair[];
  locks: boolean[];
  shuffleCount: number;
};

const createDefaultState = (): PubgState => ({
  values: PUBG_ROWS.map(() => ({ left: "", right: "" })),
  locks: PUBG_ROWS.map(() => false),
  shuffleCount: 0,
});

type PubgToolProps = {
  allowEmptySwap?: boolean;
};

export function PubgTool({ allowEmptySwap = false }: PubgToolProps) {
  const [state, setState] = useLocalStorage<PubgState>(
    "soopi-utils.pubg.state",
    createDefaultState()
  );
  const [showCopyToast, setShowCopyToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showCopiedNotice = () => {
    setShowCopyToast(false);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    requestAnimationFrame(() => {
      setShowCopyToast(true);
      toastTimerRef.current = window.setTimeout(() => {
        setShowCopyToast(false);
      }, 1400);
    });
  };

  const copyRows = async () => {
    const text = state.values
      .map((pair) => `${pair.left.trim() || "왼쪽팀"} vs ${pair.right.trim() || "오른쪽팀"}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      showCopiedNotice();
      return;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopiedNotice();
    }
  };

  const onValueChange = (index: number, side: "left" | "right", value: string) => {
    setState((prev) => {
      const nextValues = [...prev.values];
      const row = nextValues[index] ?? { left: "", right: "" };
      nextValues[index] = { ...row, [side]: value };
      return { ...prev, values: nextValues };
    });
  };

  const onLockChange = (index: number, value: boolean) => {
    setState((prev) => {
      const nextLocks = [...prev.locks];
      nextLocks[index] = value;
      return { ...prev, locks: nextLocks };
    });
  };

  const onShuffle = () => {
    setState((prev) => ({
      ...prev,
      shuffleCount: (prev.shuffleCount ?? 0) + 1,
      values: shuffleSwapRows(
        prev.values.map((pair, index) => ({ ...pair, locked: prev.locks[index] })),
        allowEmptySwap
      ).map(({ left, right }) => ({ left, right })),
    }));
  };

  const onResetCount = () => {
    setState((prev) => ({
      ...prev,
      shuffleCount: 0,
    }));
  };

  const onClearMembers = () => {
    setState((prev) => ({
      ...prev,
      values: prev.values.map(() => ({ left: "", right: "" })),
    }));
  };

  return (
    <>
      <RowSwapGrid
        title="PUBG 팀 섞기"
        lockGuide="티어를 클릭하면 고정됩니다."
        shuffleCount={state.shuffleCount ?? 0}
        rows={PUBG_ROWS}
        values={state.values}
        locks={state.locks}
        onValueChange={onValueChange}
        onLockChange={onLockChange}
        onShuffle={onShuffle}
        onResetCount={onResetCount}
        onClearMembers={onClearMembers}
        extraAction={{ label: "복사하기", onClick: copyRows }}
      />
      {showCopyToast ? (
        <div className="toast-notice" role="status" aria-live="polite">
          복사가 되었습니다.
        </div>
      ) : null}
    </>
  );
}
