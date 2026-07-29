import "./Payment.css";

function Payment() {
  return (
    <main className="payment-page">
      <section className="payment-container">
        <h1>Paiement</h1>

        <p>Finalisez votre achat en renseignant vos informations.</p>

        <form className="payment-form">
          <label>
            Nom complet
            <input type="text" placeholder="Votre nom" />
          </label>

          <label>
            Adresse e-mail
            <input type="email" placeholder="exemple@email.com" />
          </label>

          <label>
            Adresse de livraison
            <input type="text" placeholder="Votre adresse" />
          </label>

          <label>
            Numéro de carte
            <input type="text" placeholder="1234 5678 9012 3456" />
          </label>

          <div className="card-details">
            <label>
              Date d'expiration
              <input type="text" placeholder="MM/AA" />
            </label>

            <label>
              Cryptogramme
              <input type="password" placeholder="CVV" />
            </label>
          </div>

          <button type="submit">Payer maintenant</button>
        </form>
      </section>
    </main>
  );
}

export default Payment;
