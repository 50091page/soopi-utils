import { useTheme } from "./hooks/useTheme";
import { LolTool } from "./features/lol/LolTool";
import { PubgTool } from "./features/pubg/PubgTool";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <h1 className="page-title">수피 랜덤 팀 섞기</h1>
        </div>
        <div className="header-controls">
          <label className="theme-switch-row">
            <span className="theme-switch-text">다크모드</span>
            <input
              className="theme-switch-input"
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="theme-switch-slider" aria-hidden="true" />
          </label>
        </div>
      </header>

      <main className="tool-grid">
        <LolTool />
        <PubgTool />
      </main>
    </div>
  );
}

export default App;
