import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

function Intro({ onEnter }) {
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    if (isOpening) return;

    setIsOpening(true);

    window.setTimeout(() => {
      sessionStorage.setItem("fastImportIntroSeen", "true");

      if (onEnter) {
        onEnter();
      } else {
        navigate("/");
      }
    }, 700);
  };

  return (
    <main className={`intro-screen ${isOpening ? "intro-opening" : ""}`}>
      <button
        className="intro-logo-button"
        onClick={handleEnter}
        aria-label="Entrer sur le site Fast Import"
        disabled={isOpening}
      >
        <span className="intro-logo-icon">FI</span>

        <span className="intro-logo-name">
          FAST <span>IMPORT</span>
        </span>

        <span className="intro-logo-line" />

        <span className="intro-enter-text">CLIQUEZ POUR ENTRER</span>
      </button>

      <span className="intro-footer">VOTRE DESTINATION AUTOMOBILE</span>
    </main>
  );
}

export default Intro;
