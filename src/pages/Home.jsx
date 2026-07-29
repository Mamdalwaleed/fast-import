import "./Home.css";
import heroImg from "../assets/hero.png";
import CarCard from "../components/CarCard";

function Home() {
  const cars = [
    {
      id: 1,
      brand: "BMW",
      model: "M340i",
      year: 2023,
      mileage: 18000,
      price: 52990,
      image: heroImg,
    },
    {
      id: 2,
      brand: "Audi",
      model: "RS3",
      year: 2022,
      mileage: 25000,
      price: 58990,
      image: heroImg,
    },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Votre voiture,
            <br />
            importée ou disponible en France.
          </h1>

          <p>
            Fast Import sélectionne et vend des véhicules en provenance d'Europe
            et disponibles en France.
          </p>

          <div className="hero-buttons">
            <button>Voir les véhicules</button>

            <button className="secondary">Importer une voiture</button>
          </div>
        </div>
      </section>

      {/* CATALOGUE VOITURES */}
      <section className="cars-section">
        <h2>Nos véhicules disponibles</h2>

        <div className="cars-container">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
