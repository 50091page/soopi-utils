import { useTheme } from "./hooks/useTheme";
import { LolTool } from "./features/lol/LolTool";
import { PubgTool } from "./features/pubg/PubgTool";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-controls">
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ 라이트" : "🌙 다크"}
          </button>
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
