import { useNavigate, useParams } from "react-router-dom";
import "./VehicleDetails.css";
import heroImg from "../assets/hero.png";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Données temporaires (seront remplacées par ton API MongoDB plus tard)
  const car = {
    id: id,
    brand: "BMW",
    model: "M340i",
    year: 2023,
    mileage: 18000,
    fuel: "Essence",
    gearbox: "Automatique",
    power: "374 ch",
    color: "Noir",
    price: 52990,
    description:
      "Véhicule premium en excellent état, importé d'Europe avec historique complet. Entretien suivi et véhicule disponible immédiatement.",
    image: heroImg,
  };

  // Redirection vers la page paiement
  const handleBuy = () => {
    navigate("/payment");
  };

  return (
    <main className="vehicle-details">
      <div className="vehicle-image">
        <img src={car.image} alt={`${car.brand} ${car.model}`} />
      </div>

      <section className="vehicle-info">
        <h1>
          {car.brand} {car.model}
        </h1>

        <h2>{car.price.toLocaleString("fr-FR")} €</h2>

        <div className="vehicle-specs">
          <p>
            <strong>Année :</strong> {car.year}
          </p>

          <p>
            <strong>Kilométrage :</strong> {car.mileage.toLocaleString("fr-FR")}{" "}
            km
          </p>

          <p>
            <strong>Carburant :</strong> {car.fuel}
          </p>

          <p>
            <strong>Boîte :</strong> {car.gearbox}
          </p>

          <p>
            <strong>Puissance :</strong> {car.power}
          </p>

          <p>
            <strong>Couleur :</strong> {car.color}
          </p>
        </div>

        <div className="vehicle-description">
          <h3>Description</h3>

          <p>{car.description}</p>
        </div>

        <button onClick={handleBuy}>Acheter maintenant</button>
      </section>
    </main>
  );
}

export default VehicleDetails;
