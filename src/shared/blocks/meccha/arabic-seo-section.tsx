export function ArabicSeoSection() {
  return (
    <section id="arabic-guide" className="border-b border-[#D8CFC6] bg-white">
      <div className="container py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">دليل مخصص للاعب العربي</p>
          <h2 className="text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
            كيف تجد أفضل أماكن الاختباء في Meccha Chameleon من غير أن تعتمد على ترجمة سطحية
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#4C3B35]">
            <p>
              في العربية تدور نية البحث حول <strong>أفضل أماكن الاختباء</strong> و<strong>التمويه</strong> و<strong>الباحثين</strong> و<strong>الخرائط</strong> و<strong>الوضعية</strong>. لذلك تستخدم هذه الصفحة هذه الكلمات نفسها لتشرح اللعبة كلغة مباراة حقيقية، لا كنسخة معرّبة حرفياً من الصفحة الإنجليزية.
            </p>
            <p>
              عندما تلعب كمختبئ، لا يكفي أن تقف في زاوية مظلمة. ما ينجح فعلاً هو أن تتكامل الألوان والوضعية مع الضوضاء البصرية حولك: كتب، إطارات، بلاط، صناديق، خشب، ظلال وتفاصيل كثيرة تُربك الباحث.
            </p>
            <p>
              وعندما تلعب كباحث، لا تبحث عن الحركة فقط. ابحث عن اللون الخاطئ قليلاً، أو ظل غير منطقي، أو حافة جسم نظيفة أكثر من اللازم، أو نقطة اختباء يعرفها الجميع أصلاً.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['القصر والمكتبة', 'الكتب والإطارات الذهبية والبلاط والأثاث تعطي ضوضاء بصرية ممتازة. مكان رائع لتعلم مطابقة السطح ووضعيات الانحناء.'],
              ['الريف الداخلي', 'القش والصناديق والأبواب الحمراء ولوحات السماء تعطي المبتدئ مساحات لونية كبيرة يسهل نسخها.'],
              ['المجاري وBackrooms', 'الخرائط الداكنة أو المتجانسة تعاقب الحواف السيئة بسرعة. الغرافيتي والأنابيب واللافتات والظلال أفضل من الفراغات الفارغة.'],
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
