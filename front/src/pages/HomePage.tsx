// Pagina principal landing publica
// Secciones o layouts
import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import About from "../components/sections/About";

const Homepage = () => {
  return (
    <main>
      {/* Cada sección tiene un ID para que el Nav sepa a dónde "scrollear" */}
      <section id="hero">
        <Hero />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="about">
        <About />
      </section>
    </main>
  );
};

export default Homepage;
