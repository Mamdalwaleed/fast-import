import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (event) => {
    event.preventDefault();

    // Démonstration uniquement : à remplacer par
    // une authentification réelle via le backend.
    sessionStorage.setItem("customerDemoLoggedIn", "true");

    navigate(location.state?.returnTo || "/payment", {
      replace: true,
      state: location.state?.vehicle
        ? { vehicle: location.state.vehicle }
        : null,
    });
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <Link to="/" className="login-brand" aria-label="Fast Import, accueil">
          <span className="login-brand-icon">FI</span>
          <span>
            FAST <strong>IMPORT</strong>
          </span>
        </Link>

        <div className="login-heading">
          <span className="login-eyebrow">VOTRE ESPACE CLIENT</span>
          <h1>Bienvenue.</h1>
          <p>
            Connectez-vous pour poursuivre votre achat et retrouver votre
            véhicule sélectionné.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="login-email">Adresse e-mail</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="vous@exemple.fr"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Mot de passe</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="login-submit">
            Se connecter <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="login-demo-message">
          Mode démonstration : la vérification réelle du compte sera activée
          avec le backend.
        </p>

        <div className="login-footer">
          <span>Vous souhaitez découvrir nos véhicules ?</span>
          <Link to="/">Voir le catalogue</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
