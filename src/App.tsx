import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { LolTool } from "./features/lol/LolTool";
import { PubgTool } from "./features/pubg/PubgTool";

function App() {
  const { theme, toggleTheme } = useTheme();
  const darkModeLogoSrc = `${import.meta.env.BASE_URL}img/50091.png`;
  const lightModeLogoSrc = `${import.meta.env.BASE_URL}img/50091-dark.png`;

  useEffect(() => {
    [darkModeLogoSrc, lightModeLogoSrc].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [darkModeLogoSrc, lightModeLogoSrc]);

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
            <span className="theme-image-stack" aria-hidden="true">
              <img
                className={`theme-image-toggle-img ${theme === "dark" ? "is-visible" : ""}`}
                src={darkModeLogoSrc}
                alt=""
                loading="eager"
                decoding="sync"
              />
              <img
                className={`theme-image-toggle-img ${theme === "light" ? "is-visible" : ""}`}
                src={lightModeLogoSrc}
                alt=""
                loading="eager"
                decoding="sync"
              />
            </span>
          </button>
          <span className="theme-mode-hint" aria-live="polite">
            {theme === "dark" ? "라이트모드" : "다크모드"}
          </span>
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

