import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    login({
      name: "Client",

      email: "client@test.com",
    });

    navigate("/payment");
  };

  return (
    <main>
      <h1>Connexion</h1>

      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Mot de passe" />

        <button>Se connecter</button>
      </form>
    </main>
  );
}

export default Login;
