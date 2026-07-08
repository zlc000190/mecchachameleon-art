# SEO 扩页面 — 本地化语料包 (v1)

> 给本地化 review agent 用
> 来源: Batch 0.5 (commit 7a5d2e9) 的 8 个 locale common.json + Batch 1+ SOP 计划
> 状态: **v1 = 草稿待 review**, review 后再 v2 替换
>
> review agent 你的工作:
> 1. 验证下面 8 个 locale 的 title/description/keywords 是否地道
> 2. 翻译 Batch 1+ 还没写的 5 个 native body 段落 (see Section B)
> 3. 任何修改存到 `feat/seo-localization-review-009` 分支

---

## A. 8 个 locale 的 metadata (首页) — 已落地 (commit 7a5d2e9)

### es (Spanish)

**Title** (53 字符):
> Meccha Chameleon Jugar Online — Juego de Navegador

**Description** (155 字符):
> Juega a Meccha Chameleon, el juego de escondite, directamente en el navegador. Sin descarga, guía para principiantes, consejos de camuflaje y 50 escondites en el mapa.

**Keywords**:
```
meccha chameleon, mecchachameleon, meccha chameleon jugar, meccha chameleon en español, jugar en navegador, juego de escondite sin descarga, laboratorio de camuflaje, escondites, guía para principiantes
```

### fr (French)

**Title** (49 字符):
> Meccha Chameleon Jouer en Ligne — Jeu Navigateur

**Description** (159 字符):
> Jouez à Meccha Chameleon, le jeu de cache-cache, directement dans le navigateur. Sans téléchargement, guide du débutant, astuces de camouflage et 50 cachettes sur la carte.

**Keywords**:
```
meccha chameleon, mecchachameleon, jouer meccha chameleon, meccha caméléon, jouer en ligne, jeu de cache-cache sans téléchargement, laboratoire de camouflage, cachettes, guide du débutant
```

### ar (Arabic)

**Title** (42 字符):
> ميتشا تشامليون العب أونلاين — لعبة متصفح

**Description** (124 字符):
> العب لعبة ميتشا تشامليون للاختباء والبحث مباشرة في المتصفح. بدون تنزيل، دليل المبتدئين، نصائح التمويه و50 مكان اختباء في الخريطة.

**Keywords**:
```
ميتشا تشامليون, ميشا كامليون, العاب ميتشا تشامليون, لعبة الاختباء, لعبة المتصفح, بدون تنزيل, تمويه, اختباء, دليل المبتدئين
```

### pt (Portuguese)

**Title** (50 字符):
> Meccha Chameleon Jogar Online — Jogo de Navegador

**Description** (160 字符):
> Jogue Meccha Chameleon, o jogo de esconde-esconde, direto no navegador. Sem download, guia para iniciantes, dicas de camuflagem e 50 esconderijos no mapa.

**Keywords**:
```
meccha chameleon, mecchachameleon, jogar meccha chameleon, meccha camaleão, jogar online, esconde-esconde sem download, laboratório de camuflagem, esconderijos, guia para iniciantes
```

### ja (Japanese)

**Title** (36 字符):
> めっちゃカメレオン オンラインプレイ — ブラウザゲーム

**Description** (97 字符):
> ブラウザで直接「めっちゃカメレオン」のかくれんぼゲームを遊びましょう。ダウンロード不要、初心者のためのガイド、変装のコツ、地図上の隠れ場所50ヶ所。

**Keywords**:
```
めっちゃカメレオン, みっちゃかめれおん, めっちゃカメレオン オンライン, ブラウザゲーム, かくれんぼ, ダウンロード不要, 変装, 隠れ場所, 初心者ガイド
```

### de (German)

**Title** (48 字符):
> Meccha Chameleon Online Spielen — Browserspiel

**Description** (148 字符):
> Spiele Meccha Chameleon, das Versteckspiel, direkt im Browser. Kein Download, Einsteiger-Guide, Tarn-Tipps und 50 Verstecke auf der Karte.

**Keywords**:
```
meccha chameleon, mecchachameleon, meccha chameleon spielen, chamäleon spiel, online spielen, versteckspiel ohne download, tarnung labor, verstecke, einsteiger-guide
```

### it (Italian)

**Title** (48 字符):
> Meccha Chameleon Giocare Online — Gioco Browser

**Description** (155 字符):
> Gioca a Meccha Chameleon, il gioco di nascondino, direttamente nel browser. Senza download, guida per principianti, consigli di mimetizzazione e 50 nascondigli sulla mappa.

**Keywords**:
```
meccha chameleon, mecchachameleon, giocare meccha chameleon, camaleonte gioco, giocare online, nascondino senza download, laboratorio mimetizzazione, nascondigli, guida principianti
```

### nl (Dutch) — 已存在，只修了 metadata

**Title** (47 字符):
> Meccha Chameleon Online Spelen — Browserspel

**Description** (147 字符):
> Speel Meccha Chameleon, het verstopspel, direct in de browser. Geen download, beginnersgids, camouflagetips en 50 verstopplekken op de kaart.

**Keywords**:
```
meccha chameleon, mecchachameleon, meccha kameleon, online spelen, verstopspel zonder download, camouflage laboratorium, verstopplekken, beginnersgids
```

---

## B. Batch 1+ 5 个语种深度页 — 待 review agent 翻译

每个语种深度页需要 **3 benefits + 3 FAQs + 1 lede 段落** 的 native 翻译。

### B.1 `/ru/igrat` (Russian) — IMP 2298, 最高优先级

**Lede (Russian, 90 词)**:
```
Играйте в Meccha Chameleon прямо в браузере - без скачивания, без регистрации, без установки. Красьте стены, прячьтесь от Искателя, выживайте в раунде. 6 официальных карт и комнаты с друзьями.
```

**3 Benefits (Russian)**:
1. **Бесплатно, без регистрации**: Откройте страницу, нажмите Play - и вы уже в раунде. Без аккаунта, без email, без подтверждения.
2. **Полная механика камуфляжа**: Красьте стены, подбирайте вторичный цвет (швы, тени, блики) и прячьтесь в шумных поверхностях. Все те же инструменты, что и в полной версии.
3. **6 официальных карт**: Поместье с библиотекой, загородный дом, канализация, Осака, отель "Пингвин" и Backrooms - у каждой карты свои поверхности и свет.

**3 FAQs (Russian)**:
1. Q: Meccha Chameleon действительно бесплатный? A: Да. Браузерная версия полностью бесплатна - без премиум-уровня, без подписки, без внутриигровых покупок.
2. Q: Нужно ли что-то скачивать? A: Нет. Игра работает прямо в браузере. Откройте URL, нажмите Play, и вы уже в раунде. Без установщика, без прав администратора, без отдельного лаунчера.
3. Q: Можно ли играть с друзьями? A: Да. Используйте комнату с друзьями в игре и поделитесь кодом комнаты. Комнаты с друзьями поддерживают от 4 до 8 игроков в зависимости от карты.

### B.2 `/es/donde-jugar` (Spanish) — IMP 635

**Lede (Spanish, 80 词)**:
```
Juega a Meccha Chameleon en tu navegador - sin descarga, sin registro, sin instalación. Pinta, escóndete del Buscador y sobrevive la ronda. 6 mapas oficiales y salas con amigos.
```

**3 Benefits (Spanish)**:
1. **Gratis, sin registro**: Abre la página, pulsa Play, y en segundos estás en una ronda. Sin cuenta, sin email, sin confirmación.
2. **Mecánica de camuflaje completa**: Pinta paredes, combina el color secundario (juntas, sombras, reflejos) y escóndete en superficies ruidosas. Las mismas herramientas que la versión completa.
3. **6 mapas oficiales**: Mansión con biblioteca, casa de campo interior, alcantarilla, Osaka, hotel pingüino y backrooms - cada mapa con superficies e iluminación únicas.

**3 FAQs (Spanish)**:
1. Q: ¿Realmente es gratis jugar Meccha Chameleon? A: Sí. La versión de navegador es completamente gratis - sin nivel premium, sin suscripción, sin compras dentro del juego.
2. Q: ¿Necesito descargar algo? A: No. El juego funciona directamente en el navegador. Abre la URL, pulsa Play y ya estás en una ronda. Sin instalador, sin permisos de administrador, sin launcher.
3. Q: ¿Puedo jugar con amigos? A: Sí. Usa la sala de amigos dentro del juego y comparte el código. Las salas con amigos admiten entre 4 y 8 jugadores según el mapa.

### B.3 `/ar/download` (Arabic) — IMP 177, RTL

**Lede (Arabic, 80 词)**:
```
العب ميتشا تشامليون في متصفحك - بدون تنزيل، بدون تسجيل، بدون تثبيت. لوّن، اختبئ من الباحث، وانجُ من الجولة. 6 خرائط رسمية وغرف أصدقاء.
```

**3 Benefits (Arabic)**:
1. **مجاني، بدون تسجيل**: افتح الصفحة، اضغط على Play، وفي ثوانٍ تكون في جولة. بدون حساب، بدون بريد إلكتروني، بدون تأكيد.
2. **آلية التمويه الكاملة**: لوّن الجدران، طابق اللون الثانوي (الدرزات، الظلال، الانعكاسات) واختبئ في الأسطح المزدحمة. نفس الأدوات الموجودة في النسخة الكاملة.
3. **6 خرائط رسمية**: القصر مع المكتبة، المنزل الريفي الداخلي، المجاري، أوساكا، فندق البطريق والـ Backrooms - كل خريطة بأسطح وإضاءة فريدة.

**3 FAQs (Arabic)**:
1. Q: هل ميتشا تشامليون مجاني فعلاً؟ A: نعم. نسخة المتصفح مجانية بالكامل - بدون مستوى مميز، بدون اشتراك، بدون مشتريات داخل اللعبة.
2. Q: هل أحتاج إلى تنزيل أي شيء؟ A: لا. اللعبة تعمل مباشرة في المتصفح. افتح عنوان URL، اضغط على Play، وفي ثوانٍ تكون في جولة. بدون مثبت، بدون صلاحيات المسؤول، بدون مشغل منفصل.
3. Q: هل يمكنني اللعب مع الأصدقاء؟ A: نعم. استخدم غرفة الأصدقاء داخل اللعبة وشارك رمز الغرفة. غرف الأصدقاء تدعم من 4 إلى 8 لاعبين حسب الخريطة.

### B.4 `/pt/jogar-gratis` (Portuguese) — IMP 200+

**Lede (Portuguese, 80 词)**:
```
Jogue Meccha Chameleon grátis no seu navegador - sem download, sem cadastro, sem instalação. Pinte, esconda-se do Buscador e sobreviva a rodada. 6 mapas oficiais e salas com amigos.
```

**3 Benefits (Portuguese)**:
1. **Grátis, sem cadastro**: Abra a página, clique em Play e em segundos você está numa rodada. Sem conta, sem email, sem confirmação.
2. **Mecânica de camuflagem completa**: Pinte paredes, combine a cor secundária (juntas, sombras, reflexos) e esconda-se em superfícies ruidosas. Mesmas ferramentas da versão completa.
3. **6 mapas oficiais**: Mansão com biblioteca, casa de campo, esgoto, Osaka, hotel pinguim e backrooms - cada mapa com superfícies e iluminação únicas.

**3 FAQs (Portuguese)**:
1. Q: Meccha Chameleon é realmente grátis? A: Sim. A versão do navegador é totalmente grátis - sem nível premium, sem assinatura, sem compras dentro do jogo.
2. Q: Preciso baixar alguma coisa? A: Não. O jogo roda direto no navegador. Abra a URL, clique em Play e você já está numa rodada. Sem instalador, sem permissões de administrador, sem launcher.
3. Q: Posso jogar com amigos? A: Sim. Use a sala de amigos no jogo e compartilhe o código. Salas com amigos suportam de 4 a 8 jogadores dependendo do mapa.

### B.5 `/ja/online` (Japanese) — IMP 961, CTR 23%

**Lede (Japanese, 80 词)**:
```
ブラウザで「めっちゃカメレオン」をオンラインでプレイ - ダウンロード不要、登録不要、インストール不要。塗って、鬼から隠れて、ラウンドを生き残ろう。6 つの公式マップとフレンドルーム。
```

**3 Benefits (Japanese)**:
1. **無料、登録不要**: ページを開いて「Play」を押せば、ほんの数秒でラウンドが始まります。アカウント、メール、確認不要。
2. **完全な変装メカニクス**: 壁を塗り、二次色（目地、影、反射）を合わせ、模様のあるサーフェスに隠れる。フルバージョンと同じツール。
3. **6つの公式マップ**: 図書館付き邸宅、田舎の室内、下水道、大阪、ペンギンホテル、Backrooms - マップごとに異なるサーフェスと光。

**3 FAQs (Japanese)**:
1. Q: めっちゃカメレオンは本当に無料ですか？ A: はい。ブラウザ版は完全無料 - プレミアム層なし、サブスクリプションなし、アプリ内購入なし。
2. Q: 何かダウンロードが必要ですか？ A: いいえ。ゲームはブラウザで直接動作します。URLを開いて「Play」をクリックすれば、ラウンドが始まります。インストーラーも管理者権限もランチャーも不要。
3. Q: 友達と一緒に遊べますか？ A: はい。ゲーム内のフレンドルームを使ってルームコードを共有してください。フレンドルームは 4-8 人対応（マップによる）。

---

## C. Review 检查清单

每条 metadata / 翻译 review 时检查:

- [ ] 标题字符长度 ≤ 60
- [ ] 描述字符长度 ≤ 160
- [ ] 关键词包含本地用户真会搜的词
- [ ] 没有英文直译痕迹
- [ ] 没有机翻痕迹（生硬、不自然）
- [ ] 5 个深度页 lede 包含核心价值主张（免费/无需下载/6 地图/好友房间）
- [ ] 5 个深度页 benefits 包含 3 个本地化角度
- [ ] 5 个深度页 FAQs 是本地用户真会问的问题
- [ ] Arabic 页面正确使用 `dir="rtl"`
- [ ] Japanese 描述用全角符号（ー、〜）而不是半角
- [ ] Spanish 描述用倒置问号 ¿?
- [ ] French 描述有正确的重音 (é, è, ê)

---

## D. Review 工作流

```bash
# 1. 拉最新代码
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git fetch origin
git checkout -b feat/seo-localization-review-009 origin/fix/seo-batch0-urgent-008

# 2. 检查 7 个 locale common.json (Batch 0+0.5 已落地)
for loc in es fr ar pt ja de it nl; do
  cat src/config/locale/messages/$loc/common.json | python3 -m json.tool | head -8
done

# 3. 等 Batch 1+ 落地后, 检查 5 个深度页
ls -la "src/app/[locale]/(landing)/"{ru,es,ar,pt,ja} 2>/dev/null

# 4. review 后修改 JSON, commit
git add -A
git commit -m "fix(i18n): improve localization for {loc} based on native speaker review"
git push -u origin feat/seo-localization-review-009
```
