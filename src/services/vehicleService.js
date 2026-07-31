const API_URL = "http://localhost:3000/api/vehicles";

export async function getVehicles() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des véhicules");
  }

  return await response.json();
}

export async function getVehicleById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Véhicule introuvable");
  }

  return await response.json();
}
