export function GermanSeoSection() {
  return (
    <section id="deutsche-anleitung" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Lokalisierte Anleitung für deutschsprachige Spieler</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Wie du die besten Verstecke in Meccha Chameleon wirklich bewertest
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              In deutschen Suchergebnissen geht es nicht nur um einen allgemeinen “Guide”. Spieler suchen nach <strong>die besten Verstecke in Meccha Chameleon</strong>, <strong>Karten</strong>, <strong>Tarnung</strong>, <strong>Versteck-Muster</strong>, <strong>Posen</strong> und Tipps, um <strong>nicht mehr gefunden zu werden</strong>. Deshalb nutzt diese Seite deutsche Begriffe aus echten Guides und erklärt die Runde aus Sicht von Versteckenden und Suchern.
            </p>
            <p>
              Als <strong>Versteckender</strong> gewinnst du nicht, indem du einfach in eine dunkle Ecke läufst. Du suchst eine Oberfläche mit visuellem Rauschen, greifst passende Farben ab, kopierst Licht und Schatten und nimmst eine Pose ein, die deine menschliche Silhouette aufbricht. Ein guter Spot ist erst dann gut, wenn er auch aus einem anderen Sucher-Winkel glaubwürdig bleibt.
            </p>
            <p>
              Als <strong>Sucher</strong> solltest du nicht nur nach Bewegung scannen. Drehe den Blickwinkel, prüfe wiederholte Muster, vergleiche harte Kanten und achte auf Farben, die neben der Wand, dem Boden oder einem Möbelstück minimal falsch wirken. Viele Verstecke fallen nicht durch Bewegung auf, sondern durch einen zu sauberen Körperumriss.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Mansion und Bibliothek', 'Bücher, Bilderrahmen, Fliesen und Holzmöbel eignen sich gut, weil Sucher viele erwartbare Rechtecke und Kanten sehen.'],
              ['Farm- und Innenkarten', 'Heuballen, Kisten, Aufsteller und Wandbilder geben starke Farbflächen. Anfänger sollten einfache Muster wählen und die Pose sauber fixieren.'],
              ['Kanalisation und Backrooms', 'Dunkle oder monotone Karten bestrafen falsche Kanten. Nutze Graffiti, Rohre, Schilder, Schatten oder chaotische Objektgruppen statt leerer Ecken.'],
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
