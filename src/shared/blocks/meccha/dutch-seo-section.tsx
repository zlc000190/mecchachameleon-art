export function DutchSeoSection() {
  return (
    <section id="nederlandse-gids" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Gelokaliseerde gids voor Nederlandse spelers</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Hoe je de beste schuilplekken in Meccha Chameleon vindt zonder vast te lopen in vlak vertaalde tips
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              In het Nederlands draait de zoekintentie hier om <strong>beste schuilplekken</strong>, <strong>camouflage</strong>, <strong>zoekers</strong>, <strong>verstoppers</strong>, <strong>kaarten</strong> en <strong>houding</strong>. Daarom gebruikt deze pagina precies die woorden in plaats van een letterlijke kopie van de Engelse homepage.
            </p>
            <p>
              Als <strong>Verstopper</strong> win je niet alleen door een donkere hoek te kiezen. Je wint wanneer verf, houding en visuele ruis elkaar versterken: boeken, posters, tegels, kratten, hout, schaduwen en drukke achtergronden maken kleine fouten minder zichtbaar.
            </p>
            <p>
              Als <strong>Zoeker</strong> kijk je juist naar inconsistenties: een rand die te strak is, een kleur die net niet klopt, een rare schaduw of een spot die iedereen al kent. Goede Zoekers jagen niet alleen op beweging; ze lezen slechte camouflage.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Villa en bibliotheek', 'Boeken, gouden lijsten, tegels en meubels geven veel visuele ruis. Ideaal om oppervlaktekleuren en gehurkte houdingen te oefenen.'],
              ['Binnenboerderij', 'Hooibalen, kratten, rode deuren en luchtmuurschilderingen geven beginners grote kleurvlakken die makkelijk te kopiëren zijn.'],
              ['Riolering en Backrooms', 'Donkere of heel egale kaarten straffen slechte contouren hard af. Graffiti, pijpen, borden, schaduwen en objectgroepen zijn veiliger dan lege zones.'],
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
