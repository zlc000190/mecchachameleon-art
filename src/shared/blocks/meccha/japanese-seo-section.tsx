export function JapaneseSeoSection() {
  return (
    <section id="japanese-guide" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">日本語プレイヤー向け攻略</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            めっちゃカメレオン (Meccha Chameleon) を最短で上達させる隠れ場所 / ペイント / ポーズ 3 点セット
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              日本語の検索では「<strong>隠れ場所</strong>」「<strong>カモフラージュ</strong>」「<strong>シーカー(鬼) 視点</strong>」「<strong>マップ</strong>」「<strong>マルチプレイ</strong>」「<strong>カスタム ルーム</strong>」が頻出するため、このページは翻訳ではなく日本語の呼び方そのままで構成しています。
            </p>
            <p>
              ヒーダー(隠れる側) にとって本当に見つかりにくい場所は、暗い隅でも遠くの棚でもなく、<strong>視覚ノイズが多い場所</strong>、つまり本棚、額縁、タイル、家具、段ボール、影、細かい装飾の周辺です。色相だけを合わせても、輪郭が浮くと秒でバレます。
            </p>
            <p>
              シーカー(探す側) 視点はシンプルで、動いていなくても「<strong>色温度のズレ</strong>」「<strong>影の不自然さ</strong>」「<strong>定番の隠れ場所にいる気配</strong>」を見ます。視差で 1-2 m 横に動いて壁を観察するのが基本です。
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['かくれんぼマンション + 大阪', '本棚・額縁・タイル・暖色木材はペイントの参考宝庫。1.7.0 の大阪マップはジャパン テーマで 12 箇所以上の隠れ場所があり、ヒーダーの基礎練習に最適。'],
              ['田園屋内 + バックルームズ', '藁・牛・空の壁などの大きな色面、または黄色い蛍光灯。ペイント初心者には色面が広く、シーカーにはエッジの汚れが即バレする鬼畜マップ。'],
              ['下水道 + ペンギン ホテル', '暗い通路、グラフィティ、パイプ、ペンギン像、浴室。照明の弱さに頼れる反面、有名スポットはシーカーにチェックされやすい。'],
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
