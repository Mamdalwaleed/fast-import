import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  function navigateToSection(sectionId) {
    if (location.pathname !== "/") {
      sessionStorage.setItem("fastImportSection", sectionId);
      navigate("/");
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sectionId = sessionStorage.getItem("fastImportSection");
    if (!sectionId) return;

    sessionStorage.removeItem("fastImportSection");

    // Attendre que la page d'accueil soit affichée.
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  function goHome() {
    sessionStorage.removeItem("fastImportSection");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="navbar">
      <Link
        to="/"
        className="logo"
        aria-label="Fast Import - Accueil"
        onClick={goHome}
      >
        <span className="logo-car-line" aria-hidden="true">
          <svg viewBox="0 0 120 32" fill="none">
            <path
              d="M8 25 C28 3, 48 3, 69 13 S94 18, 112 23"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M48 17 C69 15, 88 17, 105 22"
              stroke="#e10600"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className="logo-text">
          FAST<span className="logo-import">IMPORT</span>
          <span className="logo-dot">.</span>
        </span>
      </Link>

      <nav className="nav-menu" aria-label="Navigation principale">
        <Link to="/" className="nav-link" onClick={goHome}>
          Accueil
        </Link>

        <button
          type="button"
          className="nav-link nav-section-button"
          onClick={() => navigateToSection("vehicules")}
        >
          Véhicules
        </button>

        <button
          type="button"
          className="nav-link nav-section-button"
          onClick={() => navigateToSection("contact")}
        >
          Import
        </button>
      </nav>

      <Link to="/login" className="login-button">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" fill="currentColor" />
        </svg>
        <span>Connexion</span>
      </Link>
    </header>
  );
}

export default Navbar;
