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
      <section className="hero">
        <div>
          <h1>
            Votre voiture,
            <br />
            importée ou disponible en France.
          </h1>

          <p>
            Fast Import sélectionne des véhicules premium en Europe et en
            France.
          </p>

          <button>Voir les véhicules</button>
        </div>

        <img src={heroImg} alt="voiture" />
      </section>

      <section className="cars-section">
        <h2>Nos véhicules</h2>

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
