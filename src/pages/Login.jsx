import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Plus tard ici on fera l'appel au backend
    navigate("/payment");
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Connexion</h1>

        <p>
          Connectez-vous pour finaliser l'achat de votre véhicule Fast Import.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input type="email" placeholder="exemple@email.com" required />

          <label>Mot de passe</label>

          <input type="password" placeholder="********" required />

          <button type="submit">Se connecter</button>
        </form>

        <p className="register">
          Pas encore de compte ?<Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
