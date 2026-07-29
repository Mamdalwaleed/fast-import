import { Link } from "react-router-dom";
import "./CarCard.css";

function CarCard({ car }) {
  return (
    <div className="car-card">
      <img src={car.image} alt={car.model} />

      <h3>
        {car.brand} {car.model}
      </h3>

      <p>
        {car.year} - {car.mileage} km
      </p>

      <strong>{car.price.toLocaleString("fr-FR")} €</strong>

      <Link to={`/vehicle/${car.id}`}>Voir le véhicule</Link>
    </div>
  );
}

export default CarCard;
