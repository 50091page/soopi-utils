import { BackToMenuButton } from "../components/BackToMenuButton";
import { LolTool } from "../features/lol/LolTool";
import { PubgTool } from "../features/pubg/PubgTool";

type ShufflePageProps = {
  onNavigateMenu: () => void;
};

export function ShufflePage({ onNavigateMenu }: ShufflePageProps) {
  return (
    <div className="shv0-page">
      <main className="shv0-grid">
        <LolTool />
        <PubgTool />
      </main>
      <div className="shv0-back-wrap">
        <BackToMenuButton onClick={onNavigateMenu} className="shv0-back-btn" />
      </div>
    </div>
  );
}
