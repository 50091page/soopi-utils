import { LolTool } from "../features/lol/LolTool";
import { PubgTool } from "../features/pubg/PubgTool";

type ShufflePageProps = {
  onNavigateMenu: () => void;
};

export function ShufflePage({ onNavigateMenu }: ShufflePageProps) {
  return (
    <div className="mx-auto max-w-[1120px] px-3 py-2">
      <main className="tool-grid">
        <LolTool />
        <PubgTool />
      </main>
      <div className="mt-3 flex justify-start">
        <button
          type="button"
          className="menu-chip"
          onClick={onNavigateMenu}
          aria-label="메인 메뉴로 이동"
        >
          ← 메인 메뉴
        </button>
      </div>
    </div>
  );
}
