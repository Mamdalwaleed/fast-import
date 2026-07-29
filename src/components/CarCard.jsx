import "./CarCard.css";
import { Link } from "react-router-dom";

function CarCard({ car }) {
  return (
    <article className="car-card">
      <img src={car.image} alt={`${car.brand} ${car.model}`} />

      <div className="car-info">
        <h2>
          {car.brand} {car.model}
        </h2>

        <p>Année : {car.year}</p>

        <p>Kilométrage : {car.mileage} km</p>

        <strong>{car.price} €</strong>

        <button>
          <Link to={`/vehicle/${car.id}`}>Voir le véhicule</Link>
        </button>
      </div>
    </article>
  );
}

export default CarCard;
