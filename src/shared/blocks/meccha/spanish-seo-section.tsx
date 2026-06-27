export function SpanishSeoSection() {
  return (
    <section id="guia-espanol" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Guía localizada para jugadores hispanohablantes</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Cómo pensar los mejores escondites de Meccha Chameleon en español
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              En las búsquedas en español, los jugadores no solo escriben “Meccha Chameleon guide”. Buscan frases como <strong>mejores escondites en Meccha Chameleon</strong>, <strong>mapas de Meccha Chameleon</strong>, <strong>camuflaje</strong>, <strong>cómo esconderse</strong> y <strong>consejos para Buscadores</strong>. Por eso esta página usa esos términos locales y explica la partida desde el vocabulario que ya aparece en guías, vídeos y wikis en español.
            </p>
            <p>
              Si juegas como <strong>Ocultista</strong>, tu objetivo no es escoger el rincón más oscuro. Lo importante es encontrar una superficie con ruido visual —libros, carteles, azulejos, madera, tela, grafiti o sombras— y pintar el cuerpo para que el borde de tu silueta desaparezca. Un buen escondite combina tres cosas: color parecido, postura creíble y una zona donde el Buscador no tenga motivo para mirar dos veces.
            </p>
            <p>
              Si juegas como <strong>Buscador</strong>, no revises solo esquinas. Mira los lugares donde un jugador puede aplanarse, agacharse o parecer un objeto del escenario. Cambia el ángulo de cámara para ver parallax, compara patrones repetidos y sospecha de cualquier color que no encaje con la pared, el suelo o el mueble cercano.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Mansión y biblioteca', 'Busca lomos de libros, cuadros, lámparas y muebles con sombras profundas. Los escondites más fuertes suelen estar a la vista, pero integrados en patrones repetidos.'],
              ['Mapas con granja o interiores', 'Las pacas de paja, carteles, establos, cajas y figuras decorativas dan cobertura visual. Evita quedarte detrás de un objeto obvio si tu pintura no rompe la silueta.'],
              ['Backrooms y zonas caóticas', 'El desorden funciona si copias patrones concretos. Una alfombra, chapa, grafiti o pila de sillas puede ocultarte mejor que una esquina vacía.'],
            ].map(([title, body]) => (
              <article key={title} className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5">
                <h3 className="font-semibold text-[#29211D]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
