import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Fast<span>Import</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/">Accueil</Link>
        </li>

        <li>
          <Link to="/vehicles">Véhicules</Link>
        </li>

        <li>
          <Link to="/import">Importation</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      <button className="login-btn">Connexion</button>
    </nav>
  );
}

export default Navbar;
