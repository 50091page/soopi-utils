import { RowSwapGrid, type RowPair } from "../../components/RowSwapGrid";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { shuffleSwapRows } from "../../utils/shuffleSwap";

const PUBG_ROWS = ["1티어", "2티어", "3티어", "4티어"];

type PubgState = {
  values: RowPair[];
  locks: boolean[];
};

const createDefaultState = (): PubgState => ({
  values: PUBG_ROWS.map(() => ({ left: "", right: "" })),
  locks: PUBG_ROWS.map(() => false),
});

type PubgToolProps = {
  allowEmptySwap?: boolean;
};

export function PubgTool({ allowEmptySwap = false }: PubgToolProps) {
  const [state, setState] = useLocalStorage<PubgState>(
    "soopi-utils.pubg.state",
    createDefaultState()
  );

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
    <RowSwapGrid
      title="PUBG 랜덤 팀 섞기"
      rows={PUBG_ROWS}
      values={state.values}
      locks={state.locks}
      onValueChange={onValueChange}
      onLockChange={onLockChange}
      onShuffle={onShuffle}
      onClearInputs={onClearInputs}
    />
  );
}
