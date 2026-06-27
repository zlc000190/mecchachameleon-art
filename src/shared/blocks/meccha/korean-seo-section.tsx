export function KoreanSeoSection() {
  return (
    <section id="korean-guide" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">한국어 플레이어 가이드</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            Meccha Chameleon (메차 카멜레온) 한국어 가이드: 숨는 장소 / 위장 / 자세 3 종 세트
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              한국어 검색은 "숨는 장소 / 카모플라주 / 시커(술래) / 맵 / 멀티플레이 / 커스텀 룸" 위주로 돌아가므로, 이 페이지는 단순 번역이 아니라 한국어 검색 표현 그 자체로 구성되어 있습니다.
            </p>
            <p>
              하이더 입장에서 가장 들키지 않는 자리는 어두운 구석이 아닙니다. <strong>시각 노이즈가 많은 자리</strong>, 즉 책장·액자·타일·나무·골판지·그림자·디테일이 많은 사물 주변입니다. 색상만 맞추어도 윤곽이 떠 있으면 초 단위로 들킵니다.
            </p>
            <p>
              시커(술래) 시점은 단순합니다. 움직임이 없어도 <strong>색온도 미스매치, 부자연스러운 그림자, 단골 스팟에 있는 사람</strong>을 봅니다. 시차(parallax) 효과로 1-2m 옆으로 비껴서 벽을 확인하는 것이 기본.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['숨바꼭질 저택 + 오사카', '책장, 액자, 타일, 따뜻한 나무는 페인트 공부에 최고. 1.7.0 의 오사카 맵은 일본식 테마 + 12+ 스팟이라 하이더 입문 연습에 적합.'],
              ['실내 농장 + 백룸', '건초·소·하늘 벽처럼 색면이 넓거나, 노란 형광등 + 적은 자연 은폐. 페인트 입문자에게는 색면이 넓어 좋고, 시커에게는 윤곽 오염이 바로 보임.'],
              ['하수도 + 펭귄 호텔', '파이프·그래피티·어두운 통로, 또는 펭귄 조각상·욕실·풍선. 약한 조명에 기대기 좋지만, 단골 스팟은 시커가 먼저 체크함.'],
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
