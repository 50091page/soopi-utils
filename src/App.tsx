import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { MenuPage } from "./pages/MenuPage";
import { ShufflePage } from "./pages/ShufflePage";

function AppFrame() {
  const { theme, toggleTheme } = useTheme();
  const darkModeLogoSrc = `${import.meta.env.BASE_URL}img/50091.png`;
  const lightModeLogoSrc = `${import.meta.env.BASE_URL}img/50091-dark.png`;
  const location = useLocation();
  const navigate = useNavigate();
  const controlsClass =
    location.pathname === "/shuffle"
      ? "mx-auto max-w-[1120px]"
      : "mx-auto max-w-[980px]";

  useEffect(() => {
    [darkModeLogoSrc, lightModeLogoSrc].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [darkModeLogoSrc, lightModeLogoSrc]);

  return (
    <>
      <div className={`${controlsClass} app-top-controls px-3 py-2`}>
        <div className="theme-floating-controls">
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
      </div>
      <div key={location.pathname} className="page-transition-layer page-transition-enter">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/shuffle" element={<ShufflePage onNavigateMenu={() => navigate("/")} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppFrame />
    </HashRouter>
  );
}

export default App;

