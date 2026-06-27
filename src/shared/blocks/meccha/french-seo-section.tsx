export function FrenchSeoSection() {
  return (
    <section id="guide-francais" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Guide localisé pour les joueurs francophones</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Comment repérer les meilleures cachettes dans Meccha Chameleon sans tomber dans une simple traduction
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              En français, les joueurs recherchent surtout <strong>meilleures cachettes</strong>, <strong>camouflage</strong>, <strong>chercheurs</strong>, <strong>cacheurs</strong>, <strong>cartes</strong> et <strong>poses</strong>. Cette page reprend ce vocabulaire local pour expliquer le jeu comme un vrai guide de partie, pas comme une version littérale de l’anglais.
            </p>
            <p>
              En tant que <strong>Cacheur</strong>, vous gagnez quand la peinture, la pose et le bruit visuel travaillent ensemble. Au lieu de courir dans le coin le plus sombre, choisissez des livres, cadres, carreaux, affiches, bois, ombres, caisses et surfaces chargées capables de casser votre silhouette.
            </p>
            <p>
              En tant que <strong>Chercheur</strong>, vous devez penser en incohérences : contour trop net, couleur légèrement fausse, ombre suspecte, pose trop humaine ou cachette déjà célèbre. Les meilleurs Chercheurs ne traquent pas seulement le mouvement ; ils lisent les mauvais camouflages.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Manoir et bibliothèque', 'Livres, cadres, carreaux et meubles créent beaucoup de bruit visuel. Idéal pour apprendre la peinture de surface et les poses accroupies.'],
              ['Campagne intérieure', 'Bottes de foin, caisses, panneaux, portes rouges et fresque de ciel donnent aux débutants de grands blocs de couleur faciles à copier.'],
              ['Égouts et Backrooms', 'Les cartes sombres ou très uniformes punissent les mauvais contours. Préférez les graffitis, tuyaux, panneaux, ombres et groupes d’objets aux zones vides.'],
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
