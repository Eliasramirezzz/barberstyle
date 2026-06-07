const About = () => {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Columna 1: Texto e Historia */}
          <div>
            <h2 className="text-violet-500 font-bold tracking-widest uppercase text-sm mb-2">
              Nuestra Historia
            </h2>
            <h3 className="text-4xl font-black text-white uppercase mb-6">
              Más que un corte, <br />
              <span className="text-violet-500">una experiencia</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Desde 2025, nos dedicamos a rescatar la esencia de la barbería
              tradicional fusionándola con las tendencias más modernas. En{" "}
              <span className="text-white font-semibold">BarberStyle</span>,
              creemos que cada cliente tiene un estilo único que merece ser
              potenciado con precisión y dedicación.
            </p>
            <p className="text-gray-400 leading-relaxed">
              No solo cortamos el pelo; creamos un ambiente donde podés
              relajarte, disfrutar de una buena charla y salir renovado.
            </p>
          </div>

          {/* Columna 2: Stats o Cuadro de Resumen */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 p-8 rounded-2xl border border-violet-900/10 text-center hover:border-violet-500/30 transition-colors">
              <span className="block text-4xl font-black text-violet-500 mb-2">
                +1
              </span>
              <span className="text-gray-400 uppercase text-xs tracking-widest font-bold">
                Años de Exp.
              </span>
            </div>
            <div className="bg-neutral-900 p-8 rounded-2xl border border-violet-900/10 text-center hover:border-violet-500/30 transition-colors">
              <span className="block text-4xl font-black text-violet-500 mb-2">
                3
              </span>
              <span className="text-gray-400 uppercase text-xs tracking-widest font-bold">
                Barberos Pro
              </span>
            </div>
            <div className="bg-neutral-900 p-8 rounded-2xl border border-violet-900/10 text-center col-span-2 hover:border-violet-500/30 transition-colors">
              <span className="block text-4xl font-black text-white mb-2 font-serif">
                "
              </span>
              <p className="text-gray-400 italic text-sm">
                "La atención al detalle es lo que nos diferencia del resto."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
