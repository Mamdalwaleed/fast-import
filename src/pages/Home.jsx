import { useEffect, useState } from "react";
import "./Home.css";
import heroImg from "../assets/hero.png";
import CarCard from "../components/CarCard";
import { getVehicles } from "../services/vehicleService";

function Home() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getVehicles();
        setCars(data);
      } catch (error) {
        setError(error.message);
      }
    }

    loadVehicles();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Votre voiture,
            <br />
            importée ou disponible en France.
          </h1>

          <p>
            Fast Import sélectionne et vend des véhicules en provenance d'Europe
            et disponibles en France.
          </p>

          <div className="hero-buttons">
            <button>Voir les véhicules</button>

            <button className="secondary">Importer une voiture</button>
          </div>
        </div>
      </section>

      {/* VEHICULES */}

      <section className="cars-section">
        <h2>Nos véhicules disponibles</h2>

        {error && <p>{error}</p>}

        <div className="cars-container">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
