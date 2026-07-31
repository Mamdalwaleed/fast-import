import { useNavigate, useParams } from "react-router-dom";
import "./VehicleDetails.css";
import heroImg from "../assets/hero.png";

function VehicleDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const car = {
    id: id,

    brand: "BMW",

    model: "M340i",

    year: 2023,

    mileage: 18000,

    fuel: "Essence",

    gearbox: "Automatique",

    price: 52990,

    description:
      "Véhicule premium en excellent état. Importé d'Europe avec historique complet et suivi professionnel.",

    image: heroImg,
  };

  return (
    <main className="vehicle-page">
      <section className="vehicle-container">
        <div className="vehicle-image">
          <img src={car.image} alt={`${car.brand} ${car.model}`} />
        </div>

        <div className="vehicle-content">
          <h1>
            {car.brand} {car.model}
          </h1>

          <p className="description">{car.description}</p>

          <div className="vehicle-details-grid">
            <div>
              <span>Année</span>
              <strong>{car.year}</strong>
            </div>

            <div>
              <span>Kilométrage</span>
              <strong>{car.mileage} km</strong>
            </div>

            <div>
              <span>Carburant</span>
              <strong>{car.fuel}</strong>
            </div>

            <div>
              <span>Boîte</span>
              <strong>{car.gearbox}</strong>
            </div>
          </div>

          <h2 className="price">{car.price.toLocaleString("fr-FR")} €</h2>

          <button onClick={() => navigate("/login")}>Acheter maintenant</button>
        </div>
      </section>
    </main>
  );
}

export default VehicleDetails;
