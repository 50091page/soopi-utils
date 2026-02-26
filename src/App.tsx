import { useTheme } from "./hooks/useTheme";
import { LolTool } from "./features/lol/LolTool";
import { PubgTool } from "./features/pubg/PubgTool";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-controls">
          <button
            type="button"
            className="theme-image-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "라이트모드로 전환" : "다크모드로 전환"}
          >
            <img
              className="theme-image-toggle-img"
              src={theme === "dark" ? "/shuffle/img/lovely5959-dark.png" : "/shuffle/img/lovely5959.png"}
              alt=""
            />
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

