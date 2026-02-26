import { useEffect, useRef, useState } from "react";
import { RowSwapGrid, type RowPair } from "../../components/RowSwapGrid";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { shuffleSwapRows } from "../../utils/shuffleSwap";

const LOL_ROWS = ["탑", "정글", "미드", "원딜", "서폿"];

type LolState = {
  values: RowPair[];
  locks: boolean[];
};

const createDefaultState = (): LolState => ({
  values: LOL_ROWS.map(() => ({ left: "", right: "" })),
  locks: LOL_ROWS.map(() => false),
});

type LolToolProps = {
  allowEmptySwap?: boolean;
};

export function LolTool({ allowEmptySwap = false }: LolToolProps) {
  const [state, setState] = useLocalStorage<LolState>(
    "soopi-utils.lol.state",
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
      .map((pair) => `${pair.left.trim() || "블루팀"} vs ${pair.right.trim() || "레드팀"}`)
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
      values: shuffleSwapRows(
        prev.values.map((pair, index) => ({ ...pair, locked: prev.locks[index] })),
        allowEmptySwap
      ).map(({ left, right }) => ({ left, right })),
    }));
  };

  const onClearInputs = () => {
    setState((prev) => ({
      ...prev,
      values: prev.values.map(() => ({ left: "", right: "" })),
    }));
  };

  return (
    <>
      <RowSwapGrid
        title="LoL 랜덤 팀 섞기"
        rows={LOL_ROWS}
        values={state.values}
        locks={state.locks}
        leftPlaceholder="블루팀"
        rightPlaceholder="레드팀"
        onValueChange={onValueChange}
        onLockChange={onLockChange}
        onShuffle={onShuffle}
        onClearInputs={onClearInputs}
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
