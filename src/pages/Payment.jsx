import "./Payment.css";

function Payment() {
  return (
    <main className="payment-page">
      <section className="payment-container">
        <div className="payment-summary">
          <h2>Votre véhicule</h2>

          <div className="vehicle-card">
            <h3>BMW M340i</h3>

            <p>Année : 2023</p>

            <p>Kilométrage : 18 000 km</p>

            <strong>52 990 €</strong>
          </div>
        </div>

        <div className="payment-form">
          <h1>Paiement sécurisé</h1>

          <p className="subtitle">Finalisez votre achat Fast Import</p>

          <label>Nom complet</label>

          <input type="text" placeholder="Votre nom" />

          <label>Email</label>

          <input type="email" placeholder="exemple@email.com" />

          <label>Numéro de carte</label>

          <input type="text" placeholder="1234 5678 9012 3456" />

          <div className="card-row">
            <input type="text" placeholder="MM / AA" />

            <input type="text" placeholder="CVC" />
          </div>

          <button>Payer 52 990 €</button>

          <p className="secure">🔒 Paiement sécurisé</p>
        </div>
      </section>
    </main>
  );
}

export default Payment;
