import { useEffect, useState } from "react";
import "./Home.css";

import CarCard from "../components/CarCard";
import { getVehicles } from "../services/vehicleService";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  brand: "",
  model: "",
  budget: "",
  year: "",
  mileage: "",
  fuel: "",
  gearbox: "",
  power: "",
  preferredColor: "",
  notes: "",
};

function Home() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getVehicles();
        setCars(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Impossible de charger les véhicules.");
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setFormMessage("");
    setFormError("");

    const numericFields = ["budget", "year", "mileage", "power"];
    const requestData = { ...form };

    numericFields.forEach((field) => {
      requestData[field] =
        requestData[field] === "" ? null : Number(requestData[field]);
    });

    try {
      const response = await fetch(
        "http://localhost:3000/api/vehicle-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'envoyer votre demande.");
      }

      setFormMessage(
        "Votre demande a bien été envoyée. L'équipe Fast Import vous recontactera.",
      );
      setForm(initialForm);
    } catch (error) {
      setFormError(
        error.message ||
          "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="home-page" id="top">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-buttons">
            <button type="button" onClick={() => scrollToSection("vehicules")}>
              Découvrir nos véhicules
              <span aria-hidden="true"> ↗</span>
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => scrollToSection("contact")}
            >
              Rechercher une voiture
            </button>
          </div>
        </div>

        <div className="hero-bottom">
          <span>LA ROUTE VERS VOTRE PROCHAINE VOITURE</span>
          <span className="hero-bottom-line" />
        </div>
      </section>

      {/* VÉHICULES */}
      <section className="cars-section" id="vehicules">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">NOTRE SÉLECTION</span>
            <h2>Nos véhicules disponibles</h2>
            <p>
              Découvrez les véhicules actuellement proposés par Fast Import.
            </p>
          </div>

          <span className="cars-count">
            {cars.length} véhicule{cars.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading && <p className="home-message">Chargement des véhicules...</p>}

        {!loading && error && (
          <p className="home-message home-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className="empty-cars">
            <span className="empty-cars-icon" aria-hidden="true">
              🚘
            </span>
            <h3>Nos prochains véhicules arrivent bientôt</h3>
            <p>
              Notre sélection sera affichée ici dès que des véhicules seront
              disponibles.
            </p>
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="cars-container">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* FORMULAIRE DE RECHERCHE */}
      <section className="contact-section" id="contact">
        <div className="request-intro">
          <span className="section-eyebrow">VOTRE PROJET AUTOMOBILE</span>
          <h2>Nous trouvons la voiture qu'il vous faut.</h2>
          <p>
            Vous avez un modèle précis en tête ? Indiquez-nous vos critères.
            L'équipe Fast Import pourra étudier votre recherche.
          </p>
        </div>

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="form-step">01 / VOTRE RECHERCHE</span>
            <h3>Quel véhicule recherchez-vous ?</h3>
            <p>Les champs marqués d'un * sont obligatoires.</p>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="brand">Marque *</label>
              <input
                id="brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ex. : Toyota"
                required
                maxLength={80}
              />
            </div>

            <div className="form-field">
              <label htmlFor="model">Modèle *</label>
              <input
                id="model"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Ex. : Prius, Golf GTI..."
                required
                maxLength={100}
              />
            </div>

            <div className="form-field">
              <label htmlFor="budget">Budget maximum (€)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="100"
                value={form.budget}
                onChange={handleChange}
                placeholder="Ex. : 15000"
              />
            </div>

            <div className="form-field">
              <label htmlFor="year">Année minimum souhaitée</label>
              <input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={handleChange}
                placeholder="Ex. : 2019"
              />
            </div>

            <div className="form-field">
              <label htmlFor="mileage">Kilométrage maximum</label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                min="0"
                value={form.mileage}
                onChange={handleChange}
                placeholder="Ex. : 100000"
              />
            </div>

            <div className="form-field">
              <label htmlFor="fuel">Carburant</label>
              <select
                id="fuel"
                name="fuel"
                value={form.fuel}
                onChange={handleChange}
              >
                <option value="">Sans préférence</option>
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride">Hybride</option>
                <option value="Électrique">Électrique</option>
                <option value="Hybride rechargeable">
                  Hybride rechargeable
                </option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="gearbox">Boîte de vitesses</label>
              <select
                id="gearbox"
                name="gearbox"
                value={form.gearbox}
                onChange={handleChange}
              >
                <option value="">Sans préférence</option>
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="power">Puissance souhaitée (ch)</label>
              <input
                id="power"
                name="power"
                type="number"
                min="0"
                value={form.power}
                onChange={handleChange}
                placeholder="Ex. : 200"
              />
            </div>

            <div className="form-field">
              <label htmlFor="preferredColor">Couleur souhaitée</label>
              <input
                id="preferredColor"
                name="preferredColor"
                value={form.preferredColor}
                onChange={handleChange}
                placeholder="Ex. : Noir, gris..."
                maxLength={60}
              />
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-heading">
            <span className="form-step">02 / VOS COORDONNÉES</span>
            <h3>Comment pouvons-nous vous joindre ?</h3>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Nom et prénom *</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                maxLength={120}
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone">Téléphone *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="06 00 00 00 00"
                required
                maxLength={30}
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="email">Adresse e-mail (facultatif)</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.fr"
                maxLength={160}
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="notes">Précisions supplémentaires</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Version, options, couleur, délai souhaité..."
                rows={4}
                maxLength={2000}
              />
            </div>
          </div>

          {formMessage && (
            <p className="form-feedback form-success" role="status">
              {formMessage}
            </p>
          )}

          {formError && (
            <p className="form-feedback form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="form-submit-row">
            <p>
              Vos informations seront utilisées pour donner suite à votre
              demande.
            </p>

            <button
              className="request-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
              {!submitting && <span aria-hidden="true"> ↗</span>}
            </button>
          </div>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a
              className="footer-logo"
              href="#top"
              aria-label="Fast Import, accueil"
            >
              FAST<span>IMPORT</span>
              <i>.</i>
            </a>

            <p>
              Votre prochain véhicule, notre priorité.
              <br />
              Des véhicules importés ou disponibles en France.
            </p>
          </div>

          <div className="footer-column">
            <h3>Navigation</h3>
            <a href="#top">Accueil</a>
            <a href="#vehicules">Nos véhicules</a>
            <a href="#contact">Rechercher une voiture</a>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <a href="tel:+33672236161">06 72 23 61 61</a>
            <span className="footer-muted">
              À votre écoute pour votre projet automobile.
            </span>
          </div>

          <div className="footer-column">
            <h3>Réseaux sociaux</h3>
            <span className="instagram-placeholder">
              <span aria-hidden="true">◎</span> Instagram
            </span>
            <span className="footer-muted">Lien disponible prochainement</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Fast Import. Tous droits réservés.</p>
          <a href="#top">Retour en haut ↑</a>
        </div>
      </footer>
    </main>
  );
}

export default Home;
