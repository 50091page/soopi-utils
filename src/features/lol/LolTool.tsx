import { useEffect, useRef, useState } from "react";
import { RowSwapGrid, type RowPair } from "../../components/RowSwapGrid";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { shuffleSwapRows } from "../../utils/shuffleSwap";

const LOL_ROWS = ["탑", "정글", "미드", "원딜", "서폿"];

type LolState = {
  values: RowPair[];
  locks: boolean[];
  shuffleCount: number;
};

const createDefaultState = (): LolState => ({
  values: LOL_ROWS.map(() => ({ left: "", right: "" })),
  locks: LOL_ROWS.map(() => false),
  shuffleCount: 0,
});

type LolToolProps = {
  allowEmptySwap?: boolean;
};

export function LolTool({ allowEmptySwap = false }: LolToolProps) {
  const [state, setState] = useLocalStorage<LolState>(
    "soopi-utils.lol.state",
    createDefaultState()
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const animationIntervalRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
      }
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const showNotice = (message: string) => {
    setToastMessage(null);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    requestAnimationFrame(() => {
      setToastMessage(message);
      toastTimerRef.current = window.setTimeout(() => {
        setToastMessage(null);
      }, 1400);
    });
  };

  const copyRows = async () => {
    const leftNames = state.values.map((pair) => pair.left.trim() || "블루팀");
    const rightNames = state.values.map((pair) => pair.right.trim() || "레드팀");
    const leftWidth = Math.max("블루팀".length, ...leftNames.map((name) => name.length));

    const lines = leftNames.map((leftName, index) => {
      return `${leftName.padEnd(leftWidth, " ")}\t${rightNames[index]}`;
    });
    const text = lines.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      showNotice("복사가 되었습니다.");
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
      showNotice("복사가 되었습니다.");
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
    if (isShuffling) {
      return;
    }

    const finalValues = shuffleSwapRows(
      state.values.map((pair, index) => ({ ...pair, locked: state.locks[index] })),
      allowEmptySwap
    ).map(({ left, right }) => ({ left, right }));

    setIsShuffling(true);

    animationIntervalRef.current = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        values: prev.values.map((pair, index) => {
          if (prev.locks[index]) {
            return pair;
          }
          if (Math.random() < 0.5) {
            return { left: pair.right, right: pair.left };
          }
          return pair;
        }),
      }));
    }, 80);

    animationTimeoutRef.current = window.setTimeout(() => {
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      setState((prev) => ({
        ...prev,
        shuffleCount: (prev.shuffleCount ?? 0) + 1,
        values: finalValues,
      }));
      setIsShuffling(false);
      animationTimeoutRef.current = null;
    }, 820);
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
        title="LoL 팀 섞기"
        variant="lol"
        lockGuide="포지션을 클릭하면 고정됩니다."
        shuffleCount={state.shuffleCount ?? 0}
        isBusy={isShuffling}
        useTeamTint={true}
        rows={LOL_ROWS}
        values={state.values}
        locks={state.locks}
        leftPlaceholder="블루팀"
        rightPlaceholder="레드팀"
        onValueChange={onValueChange}
        onLockChange={onLockChange}
        onShuffle={onShuffle}
        onResetCount={onResetCount}
        onClearMembers={onClearMembers}
        extraAction={{ label: "복사하기", onClick: copyRows }}
      />
      {toastMessage ? (
        <div className="toast-notice" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
    </>
  );
}

