export function PortugueseSeoSection() {
  return (
    <section id="guia-portugues" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Guia localizado para jogadores em português</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Como avaliar os melhores esconderijos em Meccha Chameleon sem cair na tradução literal
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              Nas buscas em português, os jogadores não procuram só por “guide”. Eles pesquisam <strong>melhores esconderijos em Meccha Chameleon</strong>, <strong>camuflagem</strong>, <strong>buscadores</strong>, <strong>mapas</strong>, <strong>poses</strong> e formas de <strong>não ser encontrado</strong>. Por isso esta página usa o vocabulário que já aparece em guias, vídeos e páginas brasileiras ou lusófonas sobre o jogo.
            </p>
            <p>
              Como <strong>Escondedor</strong>, você vence quando combina pintura, pose e ruído visual. Em vez de correr para o canto mais escuro, escolha superfícies com padrão, sombra, madeira, azulejo, livro, cartaz, caixa ou objeto que quebre a sua silhueta. A melhor pintura não serve se seu contorno ainda parece humano para um Buscador atento.
            </p>
            <p>
              Como <strong>Buscador</strong>, pense em inconsistências. Olhe formas retas demais, sombras estranhas, diferença de brilho, bordas do corpo e spots populares que todo mundo tenta copiar. Quem encontra mais rápido normalmente não persegue movimento; lê mal camuflagem e spots previsíveis.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Mansão e biblioteca', 'Livros, quadros, molduras, azulejos e móveis criam ruído visual forte. Ótimo para treinar pintura de superfície e poses agachadas.'],
              ['Fazenda e mapas internos', 'Fardos de feno, caixas, totens, portas vermelhas e mural de céu ajudam iniciantes a testar blocos grandes de cor e spots fáceis.'],
              ['Esgoto e Backrooms', 'Mapas escuros ou muito uniformes punem erro de contorno. Use grafite, placas, canos, sombras e grupos de objetos em vez de áreas vazias.'],
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
