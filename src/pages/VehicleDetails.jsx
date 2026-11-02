import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VehicleDetails.css";

const API_URL = "http://localhost:3000/api/vehicles";
const REQUESTS_API_URL = "http://localhost:3000/api/vehicle-requests";
const IMAGE_BASE_URL = "http://localhost:3000";

function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${IMAGE_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [appointment, setAppointment] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  const [sendingAppointment, setSendingAppointment] = useState(false);
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [appointmentError, setAppointmentError] = useState("");

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossible de charger ce véhicule.");
        }

        const vehicle = data.vehicle || data;

        if (!vehicle || !vehicle._id) {
          throw new Error("Véhicule introuvable.");
        }

        setCar(vehicle);
        setSelectedImage(0);
      } catch (err) {
        setError(err.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadVehicle();
  }, [id]);

  function changeImage(direction, images) {
    if (!images.length) return;

    setSelectedImage((current) => {
      return (current + direction + images.length) % images.length;
    });
  }

  function handleAppointmentChange(event) {
    const { name, value } = event.target;

    setAppointment((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleAppointmentSubmit(event) {
    event.preventDefault();

    if (!car || car.status !== "Disponible") return;

    setSendingAppointment(true);
    setAppointmentMessage("");
    setAppointmentError("");

    const appointmentNotes = [
      "DEMANDE DE RENDEZ-VOUS",
      `Véhicule : ${car.brand} ${car.model}`,
      `Référence du véhicule : ${car._id}`,
      `Date souhaitée : ${appointment.date || "À convenir"}`,
      `Heure souhaitée : ${appointment.time || "À convenir"}`,
      appointment.notes ? `Message : ${appointment.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch(REQUESTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: appointment.name.trim(),
          phone: appointment.phone.trim(),
          email: appointment.email.trim(),
          brand: car.brand,
          model: car.model,
          notes: appointmentNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'envoyer votre demande.");
      }

      setAppointmentMessage(
        "Votre demande a bien été envoyée. Notre équipe vous recontactera pour confirmer le rendez-vous.",
      );

      setAppointment({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        notes: "",
      });
    } catch (err) {
      setAppointmentError(
        err.message || "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setSendingAppointment(false);
    }
  }

  if (loading) {
    return (
      <main className="vehicle-page vehicle-state">
        <p>Chargement du véhicule...</p>
      </main>
    );
  }

  if (error || !car) {
    return (
      <main className="vehicle-page vehicle-state">
        <p>{error || "Véhicule introuvable."}</p>
        <button
          className="vehicle-back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          Retour à l’accueil
        </button>
      </main>
    );
  }

  const images = Array.isArray(car.images) ? car.images.filter(Boolean) : [];

  const mainImage = images[selectedImage]
    ? getImageUrl(images[selectedImage])
    : null;

  const isAvailable = car.status === "Disponible";

  return (
    <main className="vehicle-page">
      <div className="vehicle-page-inner">
        <button
          type="button"
          className="vehicle-back-button"
          onClick={() => navigate("/")}
        >
          <span aria-hidden="true">←</span> Retour aux véhicules
        </button>

        <section className="vehicle-container">
          <div className="vehicle-gallery">
            <div className="vehicle-gallery-topline">
              <span className="vehicle-gallery-label">GALERIE DU VÉHICULE</span>
              <span className="vehicle-photo-counter">
                {images.length
                  ? `${selectedImage + 1} / ${images.length}`
                  : "0 photo"}
              </span>
            </div>

            <div className="vehicle-image">
              {mainImage ? (
                <img
                  key={mainImage}
                  src={mainImage}
                  alt={`${car.brand} ${car.model} - photo ${selectedImage + 1}`}
                />
              ) : (
                <div className="vehicle-no-image">
                  <span aria-hidden="true">▧</span>
                  <p>Aucune photo disponible</p>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-arrow gallery-arrow-left"
                    onClick={() => changeImage(-1, images)}
                    aria-label="Photo précédente"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="gallery-arrow gallery-arrow-right"
                    onClick={() => changeImage(1, images)}
                    aria-label="Photo suivante"
                  >
                    ›
                  </button>
                </>
              )}

              <span
                className={`vehicle-image-status ${
                  isAvailable ? "available" : ""
                }`}
              >
                <span className="status-dot" />
                {car.status || "Statut non précisé"}
              </span>
            </div>

            {images.length > 1 && (
              <div
                className="vehicle-thumbnails"
                aria-label="Photos du véhicule"
              >
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`vehicle-thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Afficher la photo ${index + 1}`}
                    aria-pressed={selectedImage === index}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Vue ${index + 1} de ${car.brand} ${car.model}`}
                    />
                  </button>
                ))}
              </div>
            )}

            {images.length > 1 && (
              <p className="gallery-hint">
                Utilisez les flèches ou les miniatures pour explorer les photos.
              </p>
            )}
          </div>

          <div className="vehicle-content">
            <p className="vehicle-eyebrow">
              FAST IMPORT <span /> FICHE VÉHICULE
            </p>

            <h1>
              {car.brand} <span>{car.model}</span>
            </h1>

            <p className="vehicle-subtitle">
              Découvrez les caractéristiques de ce véhicule et contactez notre
              équipe pour organiser votre achat.
            </p>

            {car.description && (
              <div className="vehicle-description-block">
                <h2>À propos du véhicule</h2>
                <p className="description">{car.description}</p>
              </div>
            )}

            <div className="vehicle-specs-heading">
              <h2>Caractéristiques</h2>
              <span>INFORMATIONS CLÉS</span>
            </div>

            <div className="vehicle-details-grid">
              <div className="vehicle-spec">
                <span className="spec-icon" aria-hidden="true">
                  ▦
                </span>
                <div>
                  <span>Année</span>
                  <strong>{car.year || "Non renseignée"}</strong>
                </div>
              </div>

              <div className="vehicle-spec">
                <span className="spec-icon" aria-hidden="true">
                  ◷
                </span>
                <div>
                  <span>Kilométrage</span>
                  <strong>
                    {car.mileage != null
                      ? `${Number(car.mileage).toLocaleString("fr-FR")} km`
                      : "Non renseigné"}
                  </strong>
                </div>
              </div>

              <div className="vehicle-spec">
                <span className="spec-icon" aria-hidden="true">
                  ⛽
                </span>
                <div>
                  <span>Carburant</span>
                  <strong>{car.fuel || "Non renseigné"}</strong>
                </div>
              </div>

              <div className="vehicle-spec">
                <span className="spec-icon" aria-hidden="true">
                  ⚙
                </span>
                <div>
                  <span>Transmission</span>
                  <strong>{car.gearbox || "Non renseignée"}</strong>
                </div>
              </div>
            </div>

            <div className="vehicle-price-panel">
              <div>
                <span className="vehicle-price-label">PRIX DU VÉHICULE</span>
                <p className="vehicle-price-note">
                  Prix affiché par Fast Import
                </p>
              </div>
              <strong className="price">
                {Number(car.price).toLocaleString("fr-FR")} €
              </strong>
            </div>

            <div className="vehicle-actions">
              <button
                type="button"
                className="appointment-button"
                disabled={!isAvailable}
                onClick={() => {
                  if (!isAvailable) return;

                  const vehicle = {
                    _id: car._id,
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    mileage: car.mileage,
                    price: car.price,
                    images: car.images,
                  };

                  const isLoggedIn =
                    sessionStorage.getItem("customerToken") !== null;

                  if (isLoggedIn) {
                    navigate("/payment", { state: { vehicle } });
                  } else {
                    navigate("/login", {
                      state: {
                        returnTo: "/payment",
                        vehicle,
                      },
                    });
                  }
                }}
              >
                {isAvailable ? "Acheter maintenant" : "Véhicule indisponible"}
                {isAvailable && <span aria-hidden="true"> ↗</span>}
              </button>
            </div>
          </div>
        </section>

        {isAvailable && (
          <section className="appointment-panel" id="appointment-form">
            <div className="appointment-heading">
              <span className="vehicle-eyebrow">VOTRE VISITE</span>
              <h2>Prendre rendez-vous</h2>
              <p>
                Vous souhaitez voir ce véhicule ? Indiquez vos coordonnées et
                vos disponibilités. Notre équipe vous recontactera pour
                confirmer le rendez-vous.
              </p>
            </div>

            {appointmentMessage && (
              <p className="appointment-success" role="status">
                {appointmentMessage}
              </p>
            )}

            {appointmentError && (
              <p className="appointment-error" role="alert">
                {appointmentError}
              </p>
            )}

            <form onSubmit={handleAppointmentSubmit}>
              <div className="appointment-form-grid">
                <label>
                  Nom et prénom *
                  <input
                    name="name"
                    value={appointment.name}
                    onChange={handleAppointmentChange}
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Votre nom"
                  />
                </label>

                <label>
                  Téléphone *
                  <input
                    name="phone"
                    type="tel"
                    value={appointment.phone}
                    onChange={handleAppointmentChange}
                    autoComplete="tel"
                    required
                    maxLength={30}
                    placeholder="06 00 00 00 00"
                  />
                </label>

                <label className="appointment-full">
                  Adresse e-mail
                  <input
                    name="email"
                    type="email"
                    value={appointment.email}
                    onChange={handleAppointmentChange}
                    autoComplete="email"
                    maxLength={160}
                    placeholder="vous@exemple.fr"
                  />
                </label>

                <label>
                  Date souhaitée
                  <input
                    name="date"
                    type="date"
                    value={appointment.date}
                    onChange={handleAppointmentChange}
                    min={new Date().toLocaleDateString("en-CA")}
                  />
                </label>

                <label>
                  Heure souhaitée
                  <select
                    name="time"
                    value={appointment.time}
                    onChange={handleAppointmentChange}
                  >
                    <option value="">À convenir</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </label>

                <label className="appointment-full">
                  Message complémentaire
                  <textarea
                    name="notes"
                    value={appointment.notes}
                    onChange={handleAppointmentChange}
                    rows={3}
                    maxLength={1000}
                    placeholder="Une question sur ce véhicule ?"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="appointment-submit"
                disabled={sendingAppointment}
              >
                {sendingAppointment
                  ? "Envoi en cours..."
                  : "Envoyer ma demande de rendez-vous"}
              </button>

              <p className="appointment-legal">
                L’envoi de cette demande ne confirme pas encore un rendez-vous.
                Notre équipe vous contactera.
              </p>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

export default VehicleDetails;
