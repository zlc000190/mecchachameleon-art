export function ItalianSeoSection() {
  return (
    <section id="guida-italiana" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Guida localizzata per giocatori italiani</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Come trovare i migliori nascondigli in Meccha Chameleon senza affidarti a una traduzione piatta
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              In italiano la ricerca gira attorno a <strong>migliori nascondigli</strong>, <strong>mimetizzazione</strong>, <strong>cercatori</strong>, <strong>mappe</strong> e <strong>pose</strong>. Questa pagina usa proprio quel lessico per spiegare il gioco come una guida di partita reale, non come una copia parola per parola della home inglese.
            </p>
            <p>
              Come <strong>Nasconditore</strong>, vinci quando pittura, posa e rumore visivo lavorano insieme. Invece di correre verso l’angolo più buio, cerca libri, poster, piastrelle, casse, legno, ombre e superfici cariche di dettagli che spezzano la tua silhouette.
            </p>
            <p>
              Come <strong>Cercatore</strong>, pensa alle incoerenze: un bordo troppo pulito, una tinta leggermente sbagliata, un’ombra sospetta o uno spot già famosissimo. I Cercatori forti non inseguono solo il movimento: leggono la cattiva mimetizzazione.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Villa e biblioteca', 'Libri, cornici, piastrelle e mobili creano molto rumore visivo. Perfetto per imparare pittura di superficie e pose accovacciate.'],
              ['Campagna indoor', 'Balle di fieno, casse, cartelli, porte rosse e murale del cielo danno ai principianti grandi blocchi di colore facili da copiare.'],
              ['Fogne e Backrooms', 'Le mappe scure o uniformi puniscono i contorni sbagliati. Meglio graffiti, tubi, insegne, ombre e gruppi di oggetti rispetto alle zone vuote.'],
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
