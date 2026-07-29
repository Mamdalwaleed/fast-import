import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Fast <span>Import</span>
      </Link>

      <nav className="nav-menu">
        <Link to="/">Accueil</Link>

        <Link to="/">Véhicules</Link>

        <Link to="/">Import</Link>
      </nav>

      <Link to="/login" className="login-button">
        Connexion
      </Link>
    </header>
  );
}

export default Navbar;
