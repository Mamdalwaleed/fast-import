import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminVehicles.css";

const API_URL = "http://localhost:3000/api/vehicles";
const REQUESTS_API_URL = "http://localhost:3000/api/vehicle-requests";

const initialForm = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  mileage: "",
  fuel: "Essence",
  gearbox: "Manuelle",
  price: "",
  description: "",
  status: "Disponible",
};

function AdminVehicles() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updatingRequestId, setUpdatingRequestId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [requestsError, setRequestsError] = useState("");

  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    loadVehicles();
    loadRequests();

    // Les fonctions sont définies dans le composant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, token]);

  // ==========================================
  // CHARGER LES VÉHICULES
  // ==========================================
  async function loadVehicles() {
    setLoadingVehicles(true);

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les véhicules.");
      }

      setVehicles(Array.isArray(data) ? data : data.vehicles || []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des véhicules.");
    } finally {
      setLoadingVehicles(false);
    }
  }

  // ==========================================
  // CHARGER LES DEMANDES CLIENTS
  // ==========================================
  async function loadRequests() {
    if (!token) return;

    setLoadingRequests(true);
    setRequestsError("");

    try {
      const response = await fetch(REQUESTS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de charger les demandes clients.",
        );
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setRequestsError(
        err.message || "Erreur lors du chargement des demandes clients.",
      );
    } finally {
      setLoadingRequests(false);
    }
  }

  // ==========================================
  // MODIFIER LE STATUT D'UNE DEMANDE
  // ==========================================
  async function updateRequestStatus(id, status) {
    setUpdatingRequestId(id);
    setRequestsError("");
    setMessage("");

    try {
      const response = await fetch(`${REQUESTS_API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le statut.");
      }

      setRequests((previous) =>
        previous.map((request) =>
          request._id === id ? data.request : request,
        ),
      );

      setMessage("Statut de la demande mis à jour.");
    } catch (err) {
      setRequestsError(
        err.message || "Erreur lors de la modification du statut.",
      );
    } finally {
      setUpdatingRequestId("");
    }
  }

  // ==========================================
  // FORMULAIRE VÉHICULE
  // ==========================================
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImagesChange(event) {
    const selectedImages = Array.from(event.target.files || []);

    if (selectedImages.length > 5) {
      setError("Tu peux sélectionner 5 photos maximum.");
      event.target.value = "";
      setImages([]);
      return;
    }

    const invalidImage = selectedImages.find(
      (image) =>
        !["image/jpeg", "image/png", "image/webp"].includes(image.type),
    );

    if (invalidImage) {
      setError("Utilise uniquement des images JPG, PNG ou WebP.");
      event.target.value = "";
      setImages([]);
      return;
    }

    setError("");
    setImages(selectedImages);
  }

  // ==========================================
  // AJOUTER UN VÉHICULE
  // ==========================================
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("brand", form.brand.trim());
      formData.append("model", form.model.trim());
      formData.append("year", form.year);
      formData.append("mileage", form.mileage);
      formData.append("fuel", form.fuel);
      formData.append("gearbox", form.gearbox);
      formData.append("price", form.price);
      formData.append("description", form.description.trim());
      formData.append("status", form.status);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'ajouter le véhicule.");
      }

      setMessage("Véhicule ajouté avec succès !");
      setForm(initialForm);
      setImages([]);

      const fileInput = document.getElementById("vehicle-images");
      if (fileInput) fileInput.value = "";

      await loadVehicles();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // SUPPRIMER UN VÉHICULE
  // ==========================================
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Veux-tu vraiment supprimer ce véhicule ?",
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de supprimer le véhicule.");
      }

      setMessage("Véhicule supprimé.");
      await loadVehicles();
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression.");
    }
  }

  // ==========================================
  // DÉCONNEXION
  // ==========================================
  function handleLogout() {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  // ==========================================
  // AFFICHAGE
  // ==========================================
  return (
    <main className="admin-vehicles-page">
      <header className="admin-vehicles-header">
        <div>
          <p className="admin-eyebrow">FAST IMPORT</p>
          <h1>Administration</h1>
          <p>Gère tes véhicules et les demandes de tes clients.</p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-home-button"
            onClick={() => navigate("/")}
          >
            Retour à l’accueil
          </button>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      {message && <p className="admin-success">{message}</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* ====================================== */}
      {/* FORMULAIRE D'AJOUT D'UN VÉHICULE       */}
      {/* ====================================== */}
      <section className="admin-vehicle-form-section">
        <h2>Ajouter un véhicule</h2>
        <p className="admin-section-description">
          Remplis les informations puis enregistre le véhicule.
        </p>

        <form className="admin-vehicle-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="brand">Marque</label>
              <input
                id="brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ex. Toyota"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="model">Modèle</label>
              <input
                id="model"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Ex. Prius"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="year">Année</label>
              <input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="mileage">Kilométrage (km)</label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                min="0"
                value={form.mileage}
                onChange={handleChange}
                placeholder="Ex. 85000"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="fuel">Carburant</label>
              <select
                id="fuel"
                name="fuel"
                value={form.fuel}
                onChange={handleChange}
                required
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride">Hybride</option>
                <option value="Électrique">Électrique</option>
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="gearbox">Boîte de vitesses</label>
              <select
                id="gearbox"
                name="gearbox"
                value={form.gearbox}
                onChange={handleChange}
                required
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="price">Prix (€)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Ex. 12990"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="status">Statut du véhicule</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Disponible">Disponible</option>
                <option value="Réservé">Réservé</option>
                <option value="Vendu">Vendu</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décris le véhicule, ses équipements et son état..."
              rows="5"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="vehicle-images">
              Photos du véhicule (5 maximum)
            </label>
            <input
              id="vehicle-images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImagesChange}
            />
            <p className="admin-help">Formats acceptés : JPG, PNG et WebP.</p>

            {images.length > 0 && (
              <p className="admin-selected-images">
                {images.length} photo(s) sélectionnée(s) :{" "}
                {images.map((image) => image.name).join(", ")}
              </p>
            )}
          </div>

          <button
            className="admin-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer le véhicule"}
          </button>
        </form>
      </section>

      {/* ====================================== */}
      {/* LISTE DES VÉHICULES                    */}
      {/* ====================================== */}
      <section className="admin-vehicle-list-section">
        <h2>Mes véhicules</h2>

        {loadingVehicles ? (
          <p>Chargement des véhicules...</p>
        ) : vehicles.length === 0 ? (
          <p>Aucun véhicule enregistré pour le moment.</p>
        ) : (
          <div className="admin-vehicle-list">
            {vehicles.map((vehicle) => (
              <article className="admin-vehicle-card" key={vehicle._id}>
                {vehicle.images?.[0] ? (
                  <img
                    className="admin-vehicle-image"
                    src={
                      vehicle.images[0].startsWith("http")
                        ? vehicle.images[0]
                        : `http://localhost:3000${vehicle.images[0]}`
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                  />
                ) : (
                  <div className="admin-vehicle-no-image">Aucune photo</div>
                )}

                <div className="admin-vehicle-card-content">
                  <span className="admin-vehicle-status">{vehicle.status}</span>

                  <h3>
                    {vehicle.brand} {vehicle.model}
                  </h3>

                  <p>
                    {vehicle.year} ·{" "}
                    {Number(vehicle.mileage).toLocaleString("fr-FR")} km
                  </p>

                  <p>
                    {vehicle.fuel} · {vehicle.gearbox}
                  </p>

                  <strong>
                    {Number(vehicle.price).toLocaleString("fr-FR")} €
                  </strong>

                  <button
                    className="admin-delete-button"
                    type="button"
                    onClick={() => handleDelete(vehicle._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ====================================== */}
      {/* DEMANDES CLIENTS                       */}
      {/* ====================================== */}
      <section className="admin-vehicle-list-section">
        <div className="admin-requests-heading">
          <h2>Demandes clients</h2>

          <button
            type="button"
            className="admin-home-button"
            onClick={loadRequests}
            disabled={loadingRequests}
          >
            {loadingRequests ? "Actualisation..." : "Actualiser les demandes"}
          </button>
        </div>

        <p className="admin-section-description">
          Consulte les demandes de recherche de véhicules envoyées par les
          clients.
        </p>

        {requestsError && <p className="admin-error">{requestsError}</p>}

        {loadingRequests ? (
          <p>Chargement des demandes...</p>
        ) : requests.length === 0 ? (
          <p>Aucune demande client enregistrée pour le moment.</p>
        ) : (
          <div className="admin-vehicle-list">
            {requests.map((request) => (
              <article className="admin-vehicle-card" key={request._id}>
                <div className="admin-vehicle-card-content">
                  <span className="admin-vehicle-status">
                    {request.status || "Nouvelle"}
                  </span>

                  <h3>
                    {request.brand} {request.model}
                  </h3>

                  <p>
                    <strong>Client :</strong> {request.name}
                  </p>

                  <p>
                    <strong>Téléphone :</strong>{" "}
                    <a href={`tel:${request.phone}`}>{request.phone}</a>
                  </p>

                  {request.email && (
                    <p>
                      <strong>E-mail :</strong>{" "}
                      <a href={`mailto:${request.email}`}>{request.email}</a>
                    </p>
                  )}

                  {request.budget !== undefined &&
                    request.budget !== null &&
                    request.budget !== "" && (
                      <p>
                        <strong>Budget :</strong>{" "}
                        {Number(request.budget).toLocaleString("fr-FR")} €
                      </p>
                    )}

                  {request.year && (
                    <p>
                      <strong>Année souhaitée :</strong> {request.year}
                    </p>
                  )}

                  {request.mileage !== undefined &&
                    request.mileage !== null &&
                    request.mileage !== "" && (
                      <p>
                        <strong>Kilométrage souhaité :</strong>{" "}
                        {Number(request.mileage).toLocaleString("fr-FR")} km
                      </p>
                    )}

                  {request.fuel && (
                    <p>
                      <strong>Carburant :</strong> {request.fuel}
                    </p>
                  )}

                  {request.gearbox && (
                    <p>
                      <strong>Boîte de vitesses :</strong> {request.gearbox}
                    </p>
                  )}

                  {request.power && (
                    <p>
                      <strong>Puissance :</strong> {request.power}
                    </p>
                  )}

                  {request.preferredColor && (
                    <p>
                      <strong>Couleur souhaitée :</strong>{" "}
                      {request.preferredColor}
                    </p>
                  )}

                  {request.notes && (
                    <p>
                      <strong>Précisions :</strong> {request.notes}
                    </p>
                  )}

                  {request.createdAt && (
                    <p>
                      <strong>Reçue le :</strong>{" "}
                      {new Date(request.createdAt).toLocaleString("fr-FR")}
                    </p>
                  )}

                  <div className="admin-field">
                    <label htmlFor={`request-status-${request._id}`}>
                      Statut de la demande
                    </label>

                    <select
                      id={`request-status-${request._id}`}
                      value={request.status || "Nouvelle"}
                      disabled={updatingRequestId === request._id}
                      onChange={(event) =>
                        updateRequestStatus(request._id, event.target.value)
                      }
                    >
                      <option value="Nouvelle">Nouvelle</option>
                      <option value="En cours">En cours</option>
                      <option value="Traitée">Traitée</option>
                    </select>

                    {updatingRequestId === request._id && (
                      <p className="admin-help">Mise à jour du statut...</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminVehicles;
