import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const formatPrice = (price) => `${Number(price).toLocaleString("fr-FR")} €`;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  const image = vehicle?.images?.[0];
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `http://localhost:3000${image}`
    : "";

  const handlePaymentDemo = (event) => {
    event.preventDefault();

    // Aucun paiement réel n'est effectué.
    window.alert(
      "Le paiement réel n'est pas encore activé. Aucune somme n'a été débitée.",
    );
  };

  return (
    <main className="payment-page">
      <div className="payment-inner">
        <button
          type="button"
          className="payment-back"
          onClick={() => navigate(-1)}
        >
          <span aria-hidden="true">←</span> Retour
        </button>

        <header className="payment-heading">
          <span className="payment-eyebrow">FAST IMPORT · COMMANDE</span>
          <h1>Finalisez votre achat.</h1>
          <p>
            Retrouvez votre véhicule et préparez votre commande en toute
            simplicité.
          </p>
        </header>

        {!vehicle ? (
          <section className="payment-empty">
            <h2>Aucun véhicule sélectionné</h2>
            <p>
              Retournez au catalogue, sélectionnez un véhicule puis cliquez sur
              « Acheter maintenant ».
            </p>
            <button
              type="button"
              className="payment-primary-button"
              onClick={() => navigate("/")}
            >
              Découvrir les véhicules
            </button>
          </section>
        ) : (
          <section className="payment-layout">
            <article className="payment-vehicle-panel">
              <span className="payment-panel-label">VOTRE VÉHICULE</span>

              {imageUrl ? (
                <img
                  className="payment-car-image"
                  src={imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                />
              ) : (
                <div className="payment-car-placeholder">
                  <span>FAST IMPORT</span>
                  <p>Photo non disponible</p>
                </div>
              )}

              <div className="payment-car-details">
                <span className="payment-availability">
                  <span className="payment-availability-dot" />
                  {vehicle.status || "Sélectionné"}
                </span>

                <h2>
                  {vehicle.brand} {vehicle.model}
                </h2>

                <div className="payment-specs">
                  <div>
                    <span>Année</span>
                    <strong>{vehicle.year || "—"}</strong>
                  </div>
                  <div>
                    <span>Kilométrage</span>
                    <strong>
                      {vehicle.mileage != null
                        ? `${Number(vehicle.mileage).toLocaleString("fr-FR")} km`
                        : "—"}
                    </strong>
                  </div>
                </div>

                <div className="payment-price">
                  <span>Prix affiché</span>
                  <strong>{formatPrice(vehicle.price)}</strong>
                </div>
              </div>
            </article>

            <section className="payment-form-panel">
              <span className="payment-panel-label">VOTRE COMMANDE</span>

              <h2>Coordonnées de paiement</h2>
              <p className="payment-form-description">
                Cette interface est une maquette. Le paiement sécurisé sera
                activé après la configuration du prestataire.
              </p>

              <form className="payment-form" onSubmit={handlePaymentDemo}>
                <div className="payment-field">
                  <label htmlFor="payment-name">Nom complet</label>
                  <input
                    id="payment-name"
                    name="name"
                    type="text"
                    placeholder="Votre nom complet"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="payment-field">
                  <label htmlFor="payment-email">Adresse e-mail</label>
                  <input
                    id="payment-email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="payment-field">
                  <label htmlFor="payment-card">
                    Numéro de carte (maquette)
                  </label>
                  <input
                    id="payment-card"
                    name="card"
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    autoComplete="off"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="payment-card-row">
                  <div className="payment-field">
                    <label htmlFor="payment-expiry">Date d’expiration</label>
                    <input
                      id="payment-expiry"
                      name="expiry"
                      type="text"
                      placeholder="MM/AA"
                      autoComplete="off"
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="payment-field">
                    <label htmlFor="payment-cvc">Cryptogramme</label>
                    <input
                      id="payment-cvc"
                      name="cvc"
                      type="password"
                      inputMode="numeric"
                      placeholder="CVC"
                      autoComplete="off"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="payment-total">
                  <span>Total de la commande</span>
                  <strong>{formatPrice(vehicle.price)}</strong>
                </div>

                <button type="submit" className="payment-primary-button">
                  Continuer
                  <span aria-hidden="true"> →</span>
                </button>
              </form>

              <p className="payment-security-note">
                <span aria-hidden="true">🔒</span>
                Maquette uniquement — ne saisissez pas de vraies coordonnées
                bancaires.
              </p>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

export default Payment;
