import { Link } from "react-router-dom";
import { useState } from "react";
import "./CarCard.css";

const FALLBACK_IMAGE = "/images/car-placeholder.jpg";

function CarCard({ car }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl =
    !imageError && car.images?.length > 0
      ? car.images[0].startsWith("http")
        ? car.images[0]
        : `http://localhost:3000${car.images[0]}`
      : FALLBACK_IMAGE;

  const price = Number(car.price);

  return (
    <article className="car-card">
      <div className="car-image">
        <img
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="car-info">
        <h3>
          {car.brand} {car.model}
        </h3>

        <p className="car-details">
          {car.year} · {Number(car.mileage).toLocaleString("fr-FR")} km
        </p>

        <strong className="car-price">
          {Number.isFinite(price)
            ? `${price.toLocaleString("fr-FR")} €`
            : "Prix sur demande"}
        </strong>

        {car.status && <p className="car-status">{car.status}</p>}

        <Link to={`/vehicle/${car._id}`}>Découvrir le véhicule</Link>
      </div>
    </article>
  );
}

export default CarCard;
