import type { AtlasMap, AtlasSpot } from './atlas-data';

export const isZh = (locale: string) => locale === 'zh';
export const isEs = (locale: string) => locale === 'es';
export const isPt = (locale: string) => locale === 'pt';
export const isFr = (locale: string) => locale === 'fr';
export const isIt = (locale: string) => locale === 'it';
export const isKo = (locale: string) => locale === 'ko';
export const isJa = (locale: string) => locale === 'ja';
export const isNl = (locale: string) => locale === 'nl';

export const homeCopy = {
  en: {
    title: 'Meccha Chameleon Play Online', playNow: 'Play now', howToPlay: 'How to play',
    faqs: [
      ['Can I play Meccha Chameleon online?', 'Yes. Start with the browser game above, then use the play guide and hiding spot atlas when you want deeper match help.'],
      ['What should I try first?', 'Play one short round, then open the How to play section for role basics, seeker habits, and hider positioning.'],
      ['Does this work on mobile?', 'The browser games load on modern phones, and the guide sections are built to work as a second screen while you play on PC.'],
      ['Where are the best hiding spots?', 'Use the map atlas below for quick spot ideas, paint colors, difficulty labels, and hider notes.'],
    ],
    secondScreenItems: [
      ['External overlay', 'Read about ESP, radar, health bars, and color helpers for windowed / borderless play.'],
      ['Camouflage tools', 'Review F10 photo paint and the CN build\'s F11 segmented texture-paint workflow.'],
      ['Risk notice', 'Educational and research purposes only. Use at your own risk.'],
    ],
    newPlayerEyebrow: 'New player route',
    newPlayerTitle: 'If you searched before downloading, start with the browser game.',
    newPlayerCards: [
      ['What is it?', 'A PC hide-and-seek game where hiders paint their bodies to blend into the map.'],
      ['Can I play here?', 'Yes. Start with the browser game above, then use the guide when you want match tips.'],
      ['Should I install it?', 'Try one quick round first. If hiding, painting, and seeker pressure feel fun, keep this guide open for the next match.'],
      ['What should I learn first?', 'Spot selection, color matching, pose discipline, and staying still after you commit.'],
    ],
    camoEyebrow: 'For real players',
    camoTitle: 'Camo Lab turns search traffic into match-ready help.',
    previewAtlas: 'Preview map atlas',
    camoCards: [
      ['Color reads', 'Show primary and secondary paint colors for each map surface.'],
      ['Pose notes', 'Tell players which side or silhouette should face the seeker.'],
      ['Risk rating', 'Label beginner-safe, high-reward, and obvious bait spots.'],
    ],
    atlasEyebrow: 'Hiding Spot Atlas',
    atlasTitle: 'Five real map guides, fifty hiding spots, one fast second screen.',
    atlasDesc: 'These are the captured Meccha Chameleon map assets Claude already prepared: screenshots, paint colors, difficulty, and match tips.',
    secondEyebrow: 'Game assistant software',
    secondTitle: 'Tools page for external overlay, radar, and camouflage helpers.',
    secondDesc: 'The dedicated tools page summarizes community Meccha Chameleon assistant software, downloads, controls, and safety notes. Educational and research purposes only. Use at your own risk.',
    quickAnswers: 'Quick answers',
  },
  zh: {
    title: '超级变色龙 Meccha Chameleon 在线玩', playNow: '立即开始', howToPlay: '玩法指南',
    faqs: [
      ['可以在线玩超级变色龙吗？', '可以。先从上方浏览器游戏开始，想深入研究对局时再看玩法指南和隐藏点地图图鉴。'],
      ['新手第一步该做什么？', '先玩一小局，再看玩法区：角色基础、搜寻者习惯、隐藏者站位都会快速讲清楚。'],
      ['手机能看这个站吗？', '可以。浏览器游戏能在现代手机加载，攻略区也适合当作 PC 游玩时的第二屏参考。'],
      ['最好的隐藏点在哪里？', '看下方地图图鉴：每张图都有点位思路、涂装颜色、难度标签和隐藏者提示。'],
    ],
    secondScreenItems: [
      ['外部叠加层', '了解透视、雷达、血条和颜色辅助等窗口/无边框模式工具。'],
      ['伪装工具', '查看 F10 伪装采样，以及中文增强版 F11 分片纹理涂色流程。'],
      ['风险提示', 'Educational and research purposes only. Use at your own risk.'],
    ],
    newPlayerEyebrow: '新手路线',
    newPlayerTitle: '如果你是搜索后才准备下载，先从浏览器版体验开始。',
    newPlayerCards: [
      ['这是什么游戏？', '超级变色龙是一款 PC 躲猫猫派对游戏，隐藏者要把身体涂成地图环境的颜色。'],
      ['这里可以玩吗？', '可以。先玩上方浏览器游戏，之后需要对局技巧时再看攻略。'],
      ['值得安装吗？', '先快速试玩一局。如果隐藏、涂色和被搜寻的压力让你觉得有趣，再把这个攻略开着进入下一局。'],
      ['最先学什么？', '先学点位选择、颜色匹配、姿势控制，以及决定隐藏后保持静止。'],
    ],
    camoEyebrow: '给真实玩家',
    camoTitle: '伪装实验室把搜索流量变成能上场的对局帮助。',
    previewAtlas: '预览地图图鉴',
    camoCards: [
      ['颜色读取', '展示每个地图表面的主色和辅助涂装颜色。'],
      ['姿势提示', '告诉玩家该把哪一侧或哪种轮廓朝向搜寻者。'],
      ['风险评级', '标注新手安全点、高收益点和明显诱饵点。'],
    ],
    atlasEyebrow: '隐藏点地图图鉴',
    atlasTitle: '5 张真实地图攻略、50 个隐藏点，一个快速第二屏。',
    atlasDesc: '这里整理了超级变色龙地图素材：截图、涂装颜色、难度和实战提示，方便对局时快速查看。',
    secondEyebrow: '游戏辅助软件',
    secondTitle: '外部叠加层、雷达和伪装辅助的专门说明页。',
    secondDesc: '专门页面整理社区版超级变色龙工具箱的功能、下载、快捷键和风险提示。Educational and research purposes only. Use at your own risk.',
    quickAnswers: '快速解答',
  },
} as const;

type StringPair = readonly [string, string];
type HomeCopy = {
  title: string;
  playNow: string;
  howToPlay: string;
  faqs: readonly StringPair[];
  secondScreenItems: readonly StringPair[];
  newPlayerEyebrow: string;
  newPlayerTitle: string;
  newPlayerCards: readonly StringPair[];
  camoEyebrow: string;
  camoTitle: string;
  previewAtlas: string;
  camoCards: readonly StringPair[];
  atlasEyebrow: string;
  atlasTitle: string;
  atlasDesc: string;
  secondEyebrow: string;
  secondTitle: string;
  secondDesc: string;
  quickAnswers: string;
  openTools: string;
};

const homeCopyOverrides: Record<string, Partial<HomeCopy>> = {
  ru: {
    title: 'Meccha Chameleon Играть Онлайн', playNow: 'Играть сейчас', howToPlay: 'Как играть', openTools: 'Открыть страницу инструментов',
    newPlayerEyebrow: 'Маршрут новичка', newPlayerTitle: 'Если вы нашли сайт перед скачиванием, начните с браузерной версии игры.',
    newPlayerCards: [
      ['Что это?', 'PC-игра в прятки, где прячущиеся раскрашивают персонажа под окружение карты.'],
      ['Можно играть здесь?', 'Да. Начните с браузерной игры выше, а затем используйте гайд для тактики матча.'],
      ['Стоит ли устанавливать?', 'Сначала сыграйте короткий раунд. Если прятки, покраска и давление поиска вам понравятся — держите гайд открытым для следующей партии.'],
      ['Что учить сначала?', 'Выбор места, подбор цвета, дисциплина позы и неподвижность после фиксации.'],
    ],
    camoEyebrow: 'Для настоящих игроков', camoTitle: 'Camo Lab превращает поиск в помощь, готовую к матчу.', previewAtlas: 'Открыть атлас карт',
    camoCards: [
      ['Чтение цвета', 'Показывает основные и дополнительные цвета покраски для поверхностей карты.'],
      ['Заметки по позе', 'Подсказывает, какой силуэт или сторону лучше повернуть к ищущему.'],
      ['Оценка риска', 'Помечает безопасные места для новичков, рискованные точки и очевидные ловушки.'],
    ],
    atlasEyebrow: 'Атлас мест для пряток', atlasTitle: 'Пять реальных гайдов по картам, пятьдесят точек и быстрый второй экран.',
    atlasDesc: 'Здесь собраны материалы Meccha Chameleon: скриншоты, цвета покраски, сложность и практические советы для матча.',
    secondEyebrow: 'Игровое вспомогательное ПО', secondTitle: 'Страница инструментов для внешнего overlay, радара и помощи с камуфляжем.',
    secondDesc: 'Отдельная страница собирает функции, загрузки, горячие клавиши и предупреждения по community tools. Только для образовательных и исследовательских целей. Используйте на свой риск.', quickAnswers: 'Быстрые ответы',
    faqs: [
      ['Можно играть в Meccha Chameleon онлайн?', 'Да. Начните с браузерной игры выше, затем откройте гайд и атлас точек для более глубоких подсказок.'],
      ['Что попробовать первым?', 'Сыграйте один короткий раунд, затем откройте раздел «Как играть» для ролей, поведения ищущего и позиционирования.'],
      ['Работает ли сайт на телефоне?', 'Да. Игровое окно и гайды подходят для современного мобильного браузера и второго экрана рядом с PC.'],
      ['Где лучшие места для пряток?', 'Используйте атлас карт ниже: идеи точек, цвета, сложность и заметки для прячущегося.'],
    ],
    secondScreenItems: [
      ['Внешний overlay', 'ESP, радар, полоски здоровья и цветовые помощники для оконного / borderless режима.'],
      ['Инструменты камуфляжа', 'F10 photo paint и CN-сборка с F11 segmented texture-paint workflow.'],
      ['Предупреждение', 'Только для образовательных и исследовательских целей. Используйте на свой риск.'],
    ],
  },
  it: {
    title: 'Meccha Chameleon in italiano: migliori nascondigli, mappe e mimetizzazione',
    playNow: 'Gioca ora',
    howToPlay: 'Come giocare',
    openTools: 'Apri strumenti',
    newPlayerEyebrow: 'Guida per iniziare',
    newPlayerTitle: 'Se stai cercando Meccha Chameleon in italiano, parti da nascondigli, mimetizzazione, pose e lettura della mappa invece di una traduzione letterale.',
    newPlayerCards: [
      ['Cos’è Meccha Chameleon?', 'Un gioco multiplayer di nascondino su Steam in cui i Nasconditori dipingono il corpo per fondersi con lo scenario mentre i Cercatori controllano silhouette, ombre e colori sospetti.'],
      ['Si può giocare online qui?', 'Puoi usare l’accesso rapido nel browser e tenere questa pagina come secondo schermo. La versione ufficiale completa resta quella su Steam.'],
      ['Cosa deve imparare per primo un principiante?', 'Scegli prima la superficie, copia bene i colori, prova la posa e controlla se il contorno ti tradisce da un’altra angolazione.'],
      ['Cosa cercano i Cercatori?', 'Non guardano solo il movimento: notano bordi strani, toni sbagliati, ombre incoerenti e nascondigli troppo famosi.'],
    ],
    camoEyebrow: 'Nascondigli e mimetizzazione',
    camoTitle: 'I migliori nascondigli non stanno solo negli angoli bui: funzionano quando pittura, posa e rumore visivo si incastrano bene.',
    previewAtlas: 'Vedi mappe e nascondigli',
    camoCards: [
      ['Migliori nascondigli', 'Gli spot forti sono spesso vicino a libri, poster, piastrelle, casse, legno, ombre e zone piene di dettagli dove piccoli errori passano inosservati.'],
      ['Mimetizzazione e pittura', 'Copia colore, luce, ombra e motivo della superficie. Un tono quasi giusto non basta se la tua silhouette resta troppo leggibile.'],
      ['Pose e rischio', 'Una posa semplice aiuta i principianti. Gli spot più forti rendono quando conosci il percorso dei Cercatori e il momento in cui devi restare completamente immobile.'],
    ],
    atlasEyebrow: 'Mappe di Meccha Chameleon',
    atlasTitle: 'Mappe, migliori nascondigli e spot in cui la tua silhouette non urla subito “giocatore”.',
    atlasDesc: 'Questa panoramica usa termini locali come “migliori nascondigli”, “mimetizzazione”, “cercatori”, “mappe” e “pose”. È pensata come porta d’ingresso in italiano per partite reali, non come una semplice traduzione automatica della home inglese.',
    secondEyebrow: 'Strumenti e secondo schermo',
    secondTitle: 'Aiuti per controllare colori, percorsi della mappa e mimetizzazione prima del prossimo round.',
    secondDesc: 'La pagina strumenti raccoglie note su overlay, radar, lettura del colore e utilità di mimetizzazione. Usala come riferimento educativo e a tuo rischio.',
    quickAnswers: 'Risposte rapide',
    faqs: [
      ['Quali sono i migliori nascondigli in Meccha Chameleon?', 'Di solito sono gli spot con molto rumore visivo: librerie, cornici, piastrelle, casse, mobili, ombre e pattern che il Cercatore non controlla due volte.'],
      ['Meglio dire Nasconditore o Camaleonte?', 'Entrambe le forme compaiono in italiano. Qui usiamo Nasconditore per il ruolo e nascondiglio per lo spot, perché la ricerca locale ruota soprattutto attorno a “migliori nascondigli”.'],
      ['Come miglioro la mia mimetizzazione?', 'Non copiare solo il colore principale. Guarda lucentezza, lato in ombra, pattern, materiale e se testa o braccia rompono la posa.'],
      ['Questa pagina è ufficiale?', 'No. È una pagina non ufficiale in italiano su mappe, nascondigli e tattiche. La versione ufficiale del gioco è su Steam.'],
    ],
    secondScreenItems: [
      ['Guida ai nascondigli', 'Usa la pagina come secondo schermo per ricordare le zone con più rumore visivo e meno controlli dei Cercatori.'],
      ['Lettura dei colori', 'Confronta muro, pavimento, legno, tessuto e ombra prima di bloccare la posa finale.'],
      ['Avviso', 'Guida non ufficiale. Meccha Chameleon e i suoi asset appartengono ai rispettivi proprietari. Uso a tuo rischio.'],
    ],
  },
  fr: {
    title: 'Meccha Chameleon en français : meilleures cachettes, cartes et camouflage',
    playNow: 'Jouer maintenant',
    howToPlay: 'Comment jouer',
    openTools: 'Ouvrir les outils',
    newPlayerEyebrow: 'Guide pour débuter',
    newPlayerTitle: 'Si vous cherchez Meccha Chameleon en français, commencez par comprendre les cachettes, le camouflage, les poses et la lecture de carte plutôt que par une traduction littérale.',
    newPlayerCards: [
      ['Qu’est-ce que Meccha Chameleon ?', 'Un jeu multijoueur de cache-cache sur Steam où les Cacheurs peignent leur corps pour se fondre dans le décor pendant que les Chercheurs inspectent les silhouettes, les ombres et les couleurs suspectes.'],
      ['Peut-on jouer en ligne ici ?', 'Vous pouvez utiliser l’accès rapide dans le navigateur et garder cette page comme second écran. La version officielle complète reste celle de Steam.'],
      ['Que faut-il apprendre en premier ?', 'Choisissez d’abord la surface, copiez les bonnes couleurs, testez la pose et vérifiez si votre contour vous trahit sous un autre angle.'],
      ['Que recherchent les Chercheurs ?', 'Ils ne regardent pas seulement les mouvements : ils repèrent les bords étranges, les mauvais tons, les ombres incohérentes et les cachettes trop populaires.'],
    ],
    camoEyebrow: 'Cachettes et camouflage',
    camoTitle: 'Les meilleures cachettes ne sont pas seulement dans les coins sombres : elles marchent quand la peinture, la pose et le bruit visuel se complètent.',
    previewAtlas: 'Voir les cartes et cachettes',
    camoCards: [
      ['Meilleures cachettes', 'Les bons spots se trouvent souvent près des livres, affiches, carreaux, caisses, bois, ombres et zones chargées où de petites erreurs passent inaperçues.'],
      ['Camouflage et peinture', 'Copiez la couleur, la lumière, l’ombre et le motif de la surface. Une teinte “presque juste” ne suffit pas si votre silhouette reste trop lisible.'],
      ['Poses et risque', 'Une pose simple aide les débutants. Les spots plus forts valent surtout quand vous connaissez le trajet des Chercheurs et le bon moment pour rester totalement immobile.'],
    ],
    atlasEyebrow: 'Cartes de Meccha Chameleon',
    atlasTitle: 'Cartes, meilleures cachettes et spots où votre silhouette ne crie pas tout de suite “joueur”.',
    atlasDesc: 'Cette vue reprend les termes locaux « meilleures cachettes », « camouflage », « cacheurs », « chercheurs », « cartes » et « pose ». Elle sert d’entrée en français pour de vraies parties, pas de simple traduction automatique de la home anglaise.',
    secondEyebrow: 'Outils et second écran',
    secondTitle: 'Aides pour vérifier les couleurs, les routes de carte et le camouflage avant la prochaine manche.',
    secondDesc: 'La page outils regroupe des notes sur les overlays, le radar, la lecture des couleurs et les aides de camouflage. Utilisez-la comme ressource éducative et à vos risques.',
    quickAnswers: 'Réponses rapides',
    faqs: [
      ['Quelles sont les meilleures cachettes dans Meccha Chameleon ?', 'En général, ce sont les spots avec beaucoup de bruit visuel : bibliothèques, cadres, carreaux, caisses, meubles, ombres et motifs que le Chercheur ne vérifie pas deux fois.'],
      ['Faut-il dire cacheur ou caméléon ?', 'Les deux apparaissent en français. Ici nous utilisons Cacheur pour le rôle et cachette pour le spot, car la recherche locale tourne surtout autour de “meilleures cachettes”.'],
      ['Comment améliorer mon camouflage ?', 'Ne copiez pas seulement la couleur principale. Regardez la brillance, le côté ombre, le motif, la matière et si la tête ou les bras cassent la pose.'],
      ['Cette page est-elle officielle ?', 'Non. C’est une page d’aide non officielle en français sur les cartes, les cachettes et les tactiques. La version officielle du jeu est sur Steam.'],
    ],
    secondScreenItems: [
      ['Guide de cachette', 'Utilisez la page comme second écran pour mémoriser les zones avec le plus de bruit visuel et le moins de vérifications des Chercheurs.'],
      ['Lecture des couleurs', 'Comparez mur, sol, bois, tissu et ombre avant de verrouiller votre pose finale.'],
      ['Avertissement', 'Guide non officiel. Meccha Chameleon et ses assets appartiennent à leurs ayants droit. Utilisation à vos risques.'],
    ],
  },
  de: {
    title: 'Meccha Chameleon Deutsch: beste Verstecke, Karten und Tarnung',
    playNow: 'Jetzt spielen',
    howToPlay: 'Anleitung',
    openTools: 'Tools öffnen',
    newPlayerEyebrow: 'Anleitung für neue Spieler',
    newPlayerTitle: 'Wenn du Meccha Chameleon auf Deutsch gesucht hast, starte mit Verstecken, Tarnung, Posen und Karten statt mit einer wörtlichen Übersetzung.',
    newPlayerCards: [
      ['Was ist Meccha Chameleon?', 'Ein Multiplayer-Versteckspiel auf Steam: Versteckende bemalen ihren weißen Körper passend zur Umgebung, Sucher prüfen Silhouetten, Farben und verdächtige Muster.'],
      ['Kann ich hier online spielen?', 'Du kannst den schnellen Browser-Einstieg testen und diese Seite als zweiten Bildschirm nutzen. Die offizielle Vollversion spielst du über Steam.'],
      ['Was lernt man zuerst?', 'Wähle zuerst eine Oberfläche, greife passende Farben ab, nimm eine Pose ein und prüfe, ob deine Umrisse aus einem anderen Blickwinkel auffallen.'],
      ['Wonach suchen Sucher?', 'Gute Sucher suchen nicht nur Bewegung. Sie achten auf falsche Farbtöne, harte Körperkanten, seltsame Schatten und beliebte Spots, die jeder kennt.'],
    ],
    camoEyebrow: 'Verstecke und Tarnung',
    camoTitle: 'Die besten Verstecke entstehen nicht in dunklen Ecken, sondern dort, wo Tarnung, Pose und visuelles Rauschen zusammenpassen.',
    previewAtlas: 'Karten und Verstecke ansehen',
    camoCards: [
      ['Beste Verstecke', 'Starke Spots liegen oft neben Büchern, Fliesen, Holz, Postern, Kisten, Schatten oder überladenen Bereichen, in denen kleine Fehler weniger auffallen.'],
      ['Tarnung und Painting', 'Nutze Farben aus der Oberfläche, aber kopiere auch Licht, Schatten und Muster. Eine fast richtige Farbe reicht nicht, wenn die Silhouette sauber sichtbar bleibt.'],
      ['Posen und Risiko', 'Eine einfache Pose hilft Anfängern. Schwierige Spots lohnen sich erst, wenn du weißt, wie Sucher laufen und wann du komplett still bleiben musst.'],
    ],
    atlasEyebrow: 'Meccha Chameleon Karten',
    atlasTitle: 'Karten, beste Verstecke und Spots, an denen du nicht sofort wie ein Spieler aussiehst.',
    atlasDesc: 'Diese Übersicht nutzt deutsche Suchbegriffe wie „beste Verstecke“, „Karten“, „Tarnung“, „Sucher“ und „Versteck-Muster“. Sie ist als deutscher Einstieg für echte Runden gedacht, nicht als Maschinenübersetzung der englischen Seite.',
    secondEyebrow: 'Tools und zweiter Bildschirm',
    secondTitle: 'Hilfen zum Prüfen von Farben, Kartenrouten und Tarnung vor der nächsten Runde.',
    secondDesc: 'Die Tools-Seite sammelt Hinweise zu Overlay, Radar, Farblesen und Tarnhilfen. Nutze sie als Lernreferenz und auf eigenes Risiko.',
    quickAnswers: 'Kurze Antworten',
    faqs: [
      ['Was sind die besten Verstecke in Meccha Chameleon?', 'Meist sind es Orte mit visuellem Rauschen: Bücherregale, Poster, Fliesen, Möbel, Kisten, Schatten oder Muster, an denen Sucher nicht zweimal genau hinsehen.'],
      ['Heißt es Verstecker oder Versteckende?', 'In deutschen Guides tauchen beide Varianten auf. Wir nutzen Versteckende für die Rolle und Verstecke für die Spots, weil viele Spieler nach „beste Verstecke“ suchen.'],
      ['Wie wird meine Tarnung besser?', 'Kopiere nicht nur die Grundfarbe. Achte auf Beleuchtung, Schattenseite, Muster, Materialglanz und darauf, ob Kopf oder Arme aus der Pose herausstechen.'],
      ['Ist das die offizielle Steam-Seite?', 'Nein. Dies ist eine inoffizielle deutsche Hilfeseite zu Karten, Verstecken und Taktiken. Die offizielle Version des Spiels liegt auf Steam.'],
    ],
    secondScreenItems: [
      ['Versteck-Guide', 'Nutze die Seite als zweiten Bildschirm, um Kartenideen, Tarnmuster und Sucher-Gewohnheiten schnell wiederzufinden.'],
      ['Farb-Check', 'Vergleiche Wand, Boden, Holz, Stoff und Schatten, bevor du deine finale Pose fixierst.'],
      ['Hinweis', 'Inoffizielle Fan-Hilfe. Meccha Chameleon und Assets gehören den jeweiligen Rechteinhabern. Nutzung auf eigenes Risiko.'],
    ],
  },
  es: {
    title: 'Meccha Chameleon en español: guía de escondites, mapas y camuflaje',
    playNow: 'Jugar ahora',
    howToPlay: 'Cómo jugar',
    openTools: 'Abrir herramientas',
    newPlayerEyebrow: 'Guía para empezar',
    newPlayerTitle: 'Si llegaste buscando Meccha Chameleon en español, empieza por entender cómo esconderte, pintar tu cuerpo y leer cada mapa.',
    newPlayerCards: [
      ['¿Qué es Meccha Chameleon?', 'Un juego multijugador de escondite en Steam donde los Ocultistas se pintan para fundirse con el escenario y los Buscadores revisan sombras, siluetas y colores sospechosos.'],
      ['¿Se puede jugar online aquí?', 'Puedes probar el acceso rápido desde el navegador y usar esta página como segunda pantalla. Para la versión oficial, compra y juega en Steam.'],
      ['¿Qué aprende primero un jugador nuevo?', 'Antes de memorizar trucos, aprende tres bases: elegir una superficie, copiar bien el color y adoptar una pose que no rompa la silueta.'],
      ['¿Qué busca un Buscador?', 'No solo persigue movimiento: detecta bordes raros, tonos que no coinciden, objetos fuera de sitio y escondites demasiado populares.'],
    ],
    camoEyebrow: 'Escondites y camuflaje',
    camoTitle: 'La clave no es esconderse en una esquina: es crear un disfraz visual que el Buscador pase por alto.',
    previewAtlas: 'Ver mapas y escondites',
    camoCards: [
      ['Mejores escondites', 'Priorizamos lugares con ruido visual: libros, carteles, azulejos, muebles, sombras y patrones repetidos donde tu silueta se rompe.'],
      ['Pintura y camuflaje', 'Usa el cuentagotas o copia tonos cercanos: pared, suelo, madera, tela o metal. Un color casi correcto puede fallar si el borde del cuerpo se ve limpio.'],
      ['Riesgo por mapa', 'Un escondite fácil sirve al inicio; uno de alto riesgo funciona cuando conoces rutas de Buscadores y sabes cuándo quedarte inmóvil.'],
    ],
    atlasEyebrow: 'Mapas de Meccha Chameleon',
    atlasTitle: 'Mapas, mejores escondites y puntos donde camuflarte sin parecer un objeto pegado.',
    atlasDesc: 'Esta sección resume mapas y lugares útiles para jugadores que buscan “mejores escondites”, “guía de mapas” y “camuflaje” en Meccha Chameleon. Cada idea está pensada para usarla durante una partida, no como traducción literal de una guía inglesa.',
    secondEyebrow: 'Herramientas y segunda pantalla',
    secondTitle: 'Herramientas para revisar colores, rutas y ayudas de camuflaje antes de entrar a la partida.',
    secondDesc: 'La página de herramientas reúne notas sobre overlay, radar, lectura de color y utilidades de camuflaje. Úsalo como referencia educativa y bajo tu responsabilidad.',
    quickAnswers: 'Preguntas rápidas',
    faqs: [
      ['¿Cuál es el mejor escondite en Meccha Chameleon?', 'Depende del mapa, pero casi siempre gana un lugar con ruido visual: librerías, carteles, azulejos, muebles repetidos o zonas donde el Buscador no mira dos veces.'],
      ['¿Ocultista o Escondido: qué término usamos?', 'En español aparecen ambos. Usamos Ocultista para el rol y escondite para la acción, porque las búsquedas locales mezclan “ocultarse”, “esconderse” y “mejores escondites”.'],
      ['¿Cómo mejorar el camuflaje?', 'No copies solo el color principal. Fíjate en sombras, brillo, borde de la silueta y postura. Una pose mal elegida delata incluso una pintura buena.'],
      ['¿Esta página reemplaza a Steam?', 'No. Es una guía no oficial en español para entender mapas, escondites y tácticas. La versión oficial del juego está en Steam.'],
    ],
    secondScreenItems: [
      ['Guía de escondites', 'Usa la página como segunda pantalla para recordar qué zonas tienen más ruido visual y menos revisión de Buscadores.'],
      ['Lectura de colores', 'Compara tonos de pared, suelo, madera y tela antes de decidir la pose final.'],
      ['Aviso', 'Guía no oficial. Meccha Chameleon y sus recursos pertenecen a sus respectivos propietarios. Úsalo bajo tu responsabilidad.'],
    ],
  },
  pt: {
    title: 'Meccha Chameleon em português: melhores esconderijos, mapas e camuflagem',
    playNow: 'Jogar agora',
    howToPlay: 'Como jogar',
    openTools: 'Abrir ferramentas',
    newPlayerEyebrow: 'Guia para novos jogadores',
    newPlayerTitle: 'Se você buscou Meccha Chameleon em português, comece entendendo esconderijos, camuflagem, poses e leitura de mapa em vez de uma tradução literal.',
    newPlayerCards: [
      ['O que é Meccha Chameleon?', 'Um jogo multiplayer de esconde-esconde no Steam em que os Escondedores pintam o corpo para combinar com o cenário e os Buscadores procuram silhuetas, sombras e cores suspeitas.'],
      ['Posso jogar online por aqui?', 'Você pode usar o acesso rápido no navegador e esta página como segunda tela. A versão oficial completa continua sendo a do Steam.'],
      ['O que um iniciante aprende primeiro?', 'Escolha primeiro a superfície, copie as cores certas, teste a pose e confira se o seu contorno não denuncia você em outro ângulo.'],
      ['O que os Buscadores procuram?', 'Eles não olham só movimento: procuram bordas estranhas, cor fora do tom, sombras erradas e esconderijos famosos demais.'],
    ],
    camoEyebrow: 'Esconderijos e camuflagem',
    camoTitle: 'Os melhores esconderijos não ficam só em cantos escuros: eles funcionam quando pintura, pose e ruído visual se encaixam.',
    previewAtlas: 'Ver mapas e esconderijos',
    camoCards: [
      ['Melhores esconderijos', 'Os spots mais fortes costumam ficar perto de livros, pôsteres, azulejos, caixas, madeira, sombras e áreas cheias de detalhes onde pequenos erros passam batido.'],
      ['Camuflagem e pintura', 'Copie cor, luz, sombra e padrão da superfície. Uma cor quase certa perde valor se o seu contorno continuar parecendo um jogador.'],
      ['Poses e risco', 'Uma pose simples ajuda no começo. Spots mais apelões só valem quando você já entende a rota dos Buscadores e sabe a hora de ficar totalmente imóvel.'],
    ],
    atlasEyebrow: 'Mapas de Meccha Chameleon',
    atlasTitle: 'Mapas, melhores esconderijos e spots em que você não entrega a silhueta logo de cara.',
    atlasDesc: 'Esta visão usa termos locais como “melhores esconderijos”, “camuflagem”, “buscadores”, “mapas” e “poses”. Ela serve como página de entrada em português para rodadas reais, não como uma tradução automática da home em inglês.',
    secondEyebrow: 'Ferramentas e segunda tela',
    secondTitle: 'Ajuda para revisar cores, rotas de mapa e camuflagem antes da próxima rodada.',
    secondDesc: 'A página de ferramentas reúne notas sobre overlay, radar, leitura de cor e utilitários de camuflagem. Use como referência educacional e por sua conta e risco.',
    quickAnswers: 'Respostas rápidas',
    faqs: [
      ['Quais são os melhores esconderijos em Meccha Chameleon?', 'Normalmente são spots com ruído visual: bibliotecas, quadros, azulejos, caixas, móveis, sombras e padrões em que o Buscador não checa duas vezes.'],
      ['É melhor falar Escondedor ou Camaleão?', 'Os dois aparecem em português. Aqui usamos Escondedor para a função e esconderijo para o spot, porque a busca local gira em torno de “melhores esconderijos”.'],
      ['Como melhorar minha camuflagem?', 'Não copie só a cor principal. Observe brilho, lado de sombra, padrão, material e se cabeça, braços ou pernas quebram a pose.'],
      ['Esta página é oficial da Steam?', 'Não. Esta é uma página não oficial em português para mapas, esconderijos e táticas. A versão oficial do jogo está no Steam.'],
    ],
    secondScreenItems: [
      ['Guia de esconderijos', 'Use a página como segunda tela para lembrar áreas com mais ruído visual e menos revisão de Buscadores.'],
      ['Leitura de cor', 'Compare parede, chão, madeira, tecido e sombra antes de travar a pose final.'],
      ['Aviso', 'Guia não oficial. Meccha Chameleon e seus assets pertencem aos respectivos donos. Uso por sua conta e risco.'],
    ],
  },
  ko: {
    title: 'Meccha Chameleon 메차 카멜레온 한국어: 숨는 장소·지도·위장 가이드',
    playNow: '지금 플레이',
    howToPlay: '플레이 방법',
    openTools: '도구 페이지 열기',
    newPlayerEyebrow: '신규 플레이어 가이드',
    newPlayerTitle: 'Meccha Chameleon 을 검색해서 들어왔다면, "숨는 장소 / 위장 / 자세 / 지도 읽기" 4 가지를 먼저 익히고 실전에 합류하세요.',
    newPlayerCards: [
      ['Meccha Chameleon 이란?', 'PC 용 파티형 숨바꼭질 게임. 숨는 쪽은 캐릭터 몸에 색을 칠해 배경에 섞이고, 찾는 쪽(시커) 은 색온도·윤곽·그림자·단골 스팟을 봅니다. 2026 년 6 월 10 일 출시, 초동 700 만 본 판매.'],
      ['온라인 플레이 어디서?', '페이지 상단 브라우저 플레이 입구로 바로 시작. 풀 버전은 Steam/공식 클라이언트만 제공되며 Mac/모바일 네이티브 정식판은 없음.'],
      ['입문자가 먼저 배울 것?', '위치 → 페인트 → 자세 → 지도 읽기 순서로 익히기. 색만 맞추면 시커에게 즉시 들킴.'],
      ['시커는 무엇을 보나요?', '움직임이 없어도 "색온도 미스매치, 부자연스러운 그림자, 윤곽선, 단골 스팟" 을 봅니다.'],
    ],
    camoEyebrow: '위장 / 카모플라주',
    camoTitle: '진짜 안 들키는 장소는 "어두운 구석" 이 아니라, 색 / 자세 / 시각적 노이즈 가 모두 맞는 자리입니다.',
    previewAtlas: '지도와 숨는 스팟 보기',
    camoCards: [
      ['베스트 숨는 스팟', '책장, 액자, 타일, 나무, 골판지, 그림자, 디테일이 많은 사물 주변. 시각적 노이즈가 많을수록 시커가 놓침.'],
      ['페인트 / 위장', '색상뿐 아니라 명도·하이라이트·소재감·패턴까지 복사. 색이 비슷해도 윤곽이 떠 있으면 즉시 들킴.'],
      ['자세와 포즈', '기본은 "막대 자세 + 완전 정지". 숙련자는 맵의 오목함, 벽면, 가구에 녹아드는 자세를 사용.'],
    ],
    atlasEyebrow: '맵 목록',
    atlasTitle: '6 개 공식 맵 + 50+ 숨는 스팟: 스크린샷과 페인트 샘플까지 한 페이지에서.',
    atlasDesc: '이 한국어 페이지는 "숨는 장소 / 카모플라주 / 시커 / 자세 / 멀티플레이 / 커스텀 룸" 6 개 키워드를 모두 다루는 비공식 가이드 허브입니다.',
    secondEyebrow: '서브 화면 활용',
    secondTitle: '매치 직전, 두 번째 화면에서 점검하는 맵 컬러와 도구 노트.',
    secondDesc: '커뮤니티가 만든 비공식 미러. 컬러 샘플, 도구 설명, 커뮤니티 갤러리를 한 곳에 정리했습니다.',
    quickAnswers: '자주 묻는 질문',
    faqs: [
      ['Meccha Chameleon 추천 맵은?', '1.7.0 의 신맵 오사카는 일본식 테마 + 12+ 스팟이라 하이더 연습에 최적. 그 외 단골은 "숨바꼭질 저택", "실내 농장", "하수도", "백룸", "펭귄 호텔".'],
      ['시커(술래) 는 어떻게 움직이나요?', '"색온도 차이, 부자연스러운 그림자, 단골 스팟에 있는 사람" 을 봅니다. 시차 효과를 위해 1-2m 옆으로 비껴서 벽을 확인하는 게 기본.'],
      ['페인트의 정석은?', '반드시 3-5 색을 샘플. 하이라이트와 그림자 모두 잡고, 소재감(메탈릭/러프니스)도 맞춥니다.'],
      ['이 페이지는 공식인가요?', '아닙니다. 비공식 한국어 커뮤니티 가이드. 공식은 Steam 스토어와 공식 Wiki 를 확인하세요.'],
    ],
    secondScreenItems: [
      ['맵 아틀라스', '6 개 공식 맵과 50+ 스팟을 한 페이지에서 한눈에.'],
      ['컬러 샘플 + RGB', '스팟별 스크린샷과 페인트용 RGB 값 함께.'],
      ['주의', 'Meccha Chameleon 및 관련 에셋의 권리는 LEMORION 과 원작자에게 있습니다. 본 페이지는 팬이 만든 비공식 미러.'],
    ],
  },
  ja: {
    title: 'Meccha Chameleon オンラインプレイ', playNow: '今すぐプレイ', howToPlay: '遊び方', openTools: 'ツールページを開く',
    newPlayerEyebrow: '新規プレイヤールート', newPlayerTitle: 'ダウンロード前に検索して来たなら、まずブラウザ版から始めましょう。',
    camoEyebrow: '実戦プレイヤー向け', camoTitle: 'Camo Lab は検索流入を試合で使えるヘルプに変えます。', previewAtlas: 'マップアトラスを見る',
    atlasEyebrow: '隠れ場所アトラス', atlasTitle: '5つの実マップガイド、50の隠れ場所、すばやいセカンドスクリーン。',
    atlasDesc: 'Meccha Chameleon のマップ用スクリーンショット、塗装色、難易度、実戦ヒントをまとめています。',
    secondEyebrow: 'ゲーム補助ソフト', secondTitle: '外部オーバーレイ、レーダー、カモフラージュ補助のツールページ。',
    secondDesc: '専用ツールページではコミュニティ製補助ソフト、ダウンロード、操作、注意事項をまとめています。教育・研究目的のみ。自己責任で使用してください。', quickAnswers: 'クイック回答',
  },
  ar: {
    title: 'Meccha Chameleon بالعربية: أفضل أماكن الاختباء والخرائط والتمويه',
    playNow: 'العب الآن',
    howToPlay: 'كيف تلعب',
    openTools: 'افتح الأدوات',
    newPlayerEyebrow: 'دليل البداية',
    newPlayerTitle: 'إذا كنت تبحث عن Meccha Chameleon بالعربية، فابدأ بفهم أماكن الاختباء والتمويه والوضعية وقراءة الخريطة بدلاً من ترجمة حرفية سريعة.',
    newPlayerCards: [
      ['ما هي Meccha Chameleon؟', 'لعبة اختباء جماعية على Steam يلوّن فيها المختبئون أجسادهم لتشبه البيئة، بينما يفتش الباحثون عن الظلال والحواف والألوان المريبة.'],
      ['هل أستطيع اللعب هنا أونلاين؟', 'يمكنك استخدام مدخل اللعب السريع في المتصفح وترك هذه الصفحة مفتوحة كشاشة ثانية. أما النسخة الرسمية الكاملة فهي على Steam.'],
      ['ما أول شيء يجب أن يتعلمه المبتدئ؟', 'اختر السطح أولاً، ثم انسخ الألوان الصحيحة، وجرّب الوضعية، وتحقق إن كان شكل جسمك يفضحك من زاوية أخرى.'],
      ['عمّ يبحث الباحثون؟', 'ليس عن الحركة فقط، بل عن الحواف الغريبة، والدرجات اللونية الخاطئة، والظلال غير المنطقية، وأماكن الاختباء المشهورة جداً.'],
    ],
    camoEyebrow: 'الاختباء والتمويه',
    camoTitle: 'أفضل أماكن الاختباء لا تكون فقط في الزوايا المظلمة؛ بل تنجح عندما تتكامل الألوان والوضعية والضوضاء البصرية.',
    previewAtlas: 'اعرض الخرائط وأماكن الاختباء',
    camoCards: [
      ['أفضل أماكن الاختباء', 'الأماكن الأقوى تكون غالباً قرب الكتب والملصقات والبلاط والصناديق والخشب والظلال والمناطق المزدحمة بالتفاصيل.'],
      ['التمويه والطلاء', 'انسخ اللون والضوء والظل والنمط من السطح. اللون القريب لا يكفي إذا بقي silhouette واضحاً جداً.'],
      ['الوضعية والمخاطرة', 'الوضعية البسيطة تساعد المبتدئ. أما الأماكن الأقوى فتحتاج فهماً لمسار الباحثين ومعرفة اللحظة التي يجب أن تتجمد فيها تماماً.'],
    ],
    atlasEyebrow: 'خرائط Meccha Chameleon',
    atlasTitle: 'خرائط وأفضل أماكن الاختباء ونقاط لا يصرخ فيها شكل جسمك فوراً: هذا لاعب.',
    atlasDesc: 'تستخدم هذه الصفحة كلمات محلية مثل أفضل أماكن الاختباء والتمويه والباحثين والخرائط والوضعية. وهي مدخل عربي عملي للمباريات الحقيقية، لا مجرد ترجمة آلية للصفحة الإنجليزية.',
    secondEyebrow: 'الأدوات والشاشة الثانية',
    secondTitle: 'مساعدة لمراجعة الألوان ومسارات الخريطة والتمويه قبل الجولة التالية.',
    secondDesc: 'تجمع صفحة الأدوات ملاحظات عن الـ overlay والرادار وقراءة الألوان ومساعدات التمويه. استخدمها كمصدر تعليمي وعلى مسؤوليتك.',
    quickAnswers: 'إجابات سريعة',
    faqs: [
      ['ما أفضل أماكن الاختباء في Meccha Chameleon؟', 'غالباً هي الأماكن المليئة بالضوضاء البصرية: مكتبات وإطارات وبلاط وصناديق وأثاث وظلال وأنماط لا يفحصها الباحث مرتين.'],
      ['هل نقول مختبئ أم حرباء؟', 'كلاهما يظهر عربياً. هنا نستخدم مختبئ للدور ومكان اختباء للنقطة لأن نية البحث المحلية تدور أكثر حول أفضل أماكن الاختباء.'],
      ['كيف أحسن التمويه؟', 'لا تنسخ اللون الأساسي فقط. راقب اللمعان والجهة المظللة والنمط والخامة وهل يفسد الرأس أو الذراعان الوضعية.'],
      ['هل هذه الصفحة رسمية؟', 'لا. هذه صفحة مساعدة عربية غير رسمية للخرائط وأماكن الاختباء والتكتيكات. النسخة الرسمية للعبة موجودة على Steam.'],
    ],
    secondScreenItems: [
      ['دليل أماكن الاختباء', 'استخدم الصفحة كشاشة ثانية لتتذكر المناطق ذات الضوضاء البصرية الأعلى والفحص الأقل من الباحثين.'],
      ['فحص الألوان', 'قارن بين الجدار والأرضية والخشب والقماش والظل قبل تثبيت الوضعية النهائية.'],
      ['تنبيه', 'دليل غير رسمي. تعود Meccha Chameleon وموادها إلى أصحابها. الاستخدام على مسؤوليتك.'],
    ],
  },
  th: {
    title: 'Meccha Chameleon เล่นออนไลน์', playNow: 'เล่นเลย', howToPlay: 'วิธีเล่น', openTools: 'เปิดหน้าเครื่องมือ',
    newPlayerEyebrow: 'เส้นทางผู้เล่นใหม่', newPlayerTitle: 'ถ้าคุณค้นหาก่อนดาวน์โหลด ให้เริ่มจากเกมบนเบราว์เซอร์ก่อน',
    camoEyebrow: 'สำหรับผู้เล่นจริง', camoTitle: 'Camo Lab เปลี่ยนการค้นหาให้เป็นตัวช่วยพร้อมใช้ในแมตช์', previewAtlas: 'ดูแผนที่ตัวอย่าง',
    atlasEyebrow: 'แผนที่จุดซ่อน', atlasTitle: 'คู่มือแผนที่จริง 5 แผนที่ จุดซ่อน 50 จุด และหน้าจอที่สองแบบรวดเร็ว',
    atlasDesc: 'รวมภาพ สีพราง ระดับความยาก และทิปสำหรับแผนที่ Meccha Chameleon',
    secondEyebrow: 'ซอฟต์แวร์ช่วยเล่นเกม', secondTitle: 'หน้าเครื่องมือสำหรับ overlay ภายนอก เรดาร์ และตัวช่วยพรางตัว',
    secondDesc: 'หน้าเครื่องมือสรุปซอฟต์แวร์ชุมชน ลิงก์ดาวน์โหลด ปุ่มควบคุม และคำเตือนด้านความปลอดภัย ใช้เพื่อการศึกษาและวิจัยเท่านั้น รับความเสี่ยงเอง', quickAnswers: 'คำตอบสั้น ๆ',
  },
  vi: {
    title: 'Meccha Chameleon Chơi Online', playNow: 'Chơi ngay', howToPlay: 'Cách chơi', openTools: 'Mở trang công cụ',
    newPlayerEyebrow: 'Lộ trình người chơi mới', newPlayerTitle: 'Nếu bạn tìm kiếm trước khi tải, hãy bắt đầu với bản chơi trên trình duyệt.',
    camoEyebrow: 'Cho người chơi thật', camoTitle: 'Camo Lab biến lượt tìm kiếm thành trợ giúp sẵn sàng cho trận đấu.', previewAtlas: 'Xem atlas bản đồ',
    atlasEyebrow: 'Atlas điểm ẩn nấp', atlasTitle: 'Năm hướng dẫn bản đồ thật, năm mươi điểm ẩn, một màn hình phụ nhanh.',
    atlasDesc: 'Ảnh chụp, màu sơn, độ khó và mẹo trận đấu cho các bản đồ Meccha Chameleon.',
    secondEyebrow: 'Phần mềm hỗ trợ game', secondTitle: 'Trang công cụ cho overlay ngoài, radar và hỗ trợ ngụy trang.',
    secondDesc: 'Trang công cụ tóm tắt phần mềm hỗ trợ cộng đồng, tải xuống, điều khiển và ghi chú an toàn. Chỉ dành cho giáo dục và nghiên cứu. Tự chịu rủi ro khi dùng.', quickAnswers: 'Trả lời nhanh',
  },
  'zh-TW': {
    title: 'Meccha Chameleon 線上遊玩', playNow: '立即遊玩', howToPlay: '玩法指南', openTools: '開啟工具頁',
    newPlayerEyebrow: '新手路線', newPlayerTitle: '如果你是搜尋後才準備下載，先從瀏覽器版體驗開始。',
    camoEyebrow: '給實戰玩家', camoTitle: '偽裝實驗室把搜尋流量變成能上場的對局幫助。', previewAtlas: '預覽地圖圖鑑',
    atlasEyebrow: '隱藏點地圖圖鑑', atlasTitle: '5 張真實地圖攻略、50 個隱藏點，一個快速第二螢幕。',
    atlasDesc: '這裡整理了 Meccha Chameleon 地圖素材：截圖、塗裝顏色、難度和實戰提示。',
    secondEyebrow: '遊戲輔助軟體', secondTitle: '外部疊加層、雷達和偽裝輔助的專門說明頁。',
    secondDesc: '專門頁面整理社群版 Meccha Chameleon 工具的功能、下載、快捷鍵和風險提示。Educational and research purposes only. Use at your own risk.', quickAnswers: '快速解答',
  },
  nl: {
    title: 'Meccha Chameleon in het Nederlands: beste schuilplekken, kaarten en camouflage',
    playNow: 'Nu spelen',
    howToPlay: 'Hoe speel je',
    openTools: 'Open tools',
    newPlayerEyebrow: 'Startgids',
    newPlayerTitle: 'Als je Meccha Chameleon in het Nederlands zoekt, begin dan met schuilplekken, camouflage, houding en kaartlezen in plaats van een letterlijke vertaling.',
    newPlayerCards: [
      ['Wat is Meccha Chameleon?', 'Een multiplayer verstopspel op Steam waarin Verstoppers hun lichaam verven om op de omgeving te lijken, terwijl Zoekers letten op rare silhouetten, schaduwen en verdachte kleuren.'],
      ['Kun je hier online spelen?', 'Je kunt de snelle browser-ingang gebruiken en deze pagina openhouden als tweede scherm. De volledige officiële versie blijft die op Steam.'],
      ['Wat moet een beginner eerst leren?', 'Kies eerst een oppervlak, kopieer de juiste kleuren, test je houding en controleer of je contour vanuit een andere hoek opvalt.'],
      ['Waar letten Zoekers op?', 'Niet alleen op beweging. Ze zien ook foute tinten, harde lichaamsranden, vreemde schaduwen en verstopplekken die te bekend zijn.'],
    ],
    camoEyebrow: 'Schuilplekken en camouflage',
    camoTitle: 'De beste schuilplekken zitten niet alleen in donkere hoeken: ze werken wanneer verf, houding en visuele ruis goed samenkomen.',
    previewAtlas: 'Bekijk kaarten en schuilplekken',
    camoCards: [
      ['Beste schuilplekken', 'Sterke plekken zitten vaak bij boeken, posters, tegels, kratten, hout, schaduwen en drukke zones waar kleine fouten minder opvallen.'],
      ['Camouflage en verf', 'Kopieer kleur, licht, schaduw en patroon van het oppervlak. Een bijna goede tint helpt niet als je silhouet nog steeds te duidelijk is.'],
      ['Houding en risico', 'Een eenvoudige houding helpt beginners. Sterkere spots werken vooral als je de route van de Zoekers kent en weet wanneer je volledig stil moet blijven.'],
    ],
    atlasEyebrow: 'Meccha Chameleon-kaarten',
    atlasTitle: 'Kaarten, beste schuilplekken en spots waar je silhouet niet meteen “speler” schreeuwt.',
    atlasDesc: 'Deze overzichtspagina gebruikt lokale termen zoals “beste schuilplekken”, “camouflage”, “zoekers”, “verstoppers”, “kaarten” en “houding”. Ze is bedoeld als Nederlandse instappagina voor echte matches, niet als automatische vertaling van de Engelse home.',
    secondEyebrow: 'Tools en tweede scherm',
    secondTitle: 'Hulp om kleuren, kaartlijnen en camouflage te checken vóór je volgende ronde.',
    secondDesc: 'De tools-pagina verzamelt notities over overlays, radar, kleurlezing en camouflagehulpen. Gebruik dit als educatieve referentie en op eigen risico.',
    quickAnswers: 'Snelle antwoorden',
    faqs: [
      ['Wat zijn de beste schuilplekken in Meccha Chameleon?', 'Meestal zijn dat spots met veel visuele ruis: boekenkasten, lijsten, tegels, kratten, meubels, schaduwen en patronen waar een Zoeker niet twee keer naar kijkt.'],
      ['Is het beter om Verstopper of Kameleon te zeggen?', 'Beide komen voor in het Nederlands. Hier gebruiken we Verstopper voor de rol en schuilplek voor de spot, omdat de lokale zoekintentie vooral rond “beste schuilplekken” draait.'],
      ['Hoe verbeter ik mijn camouflage?', 'Kopieer niet alleen de hoofdkleur. Let ook op glans, schaduwkant, patroon, materiaal en of hoofd of armen de houding breken.'],
      ['Is deze pagina officieel?', 'Nee. Dit is een onofficiële Nederlandse hulppagina voor kaarten, schuilplekken en tactieken. De officiële gameversie staat op Steam.'],
    ],
    secondScreenItems: [
      ['Schuilplekgids', 'Gebruik de pagina als tweede scherm om zones met veel visuele ruis en minder controle door Zoekers snel terug te vinden.'],
      ['Kleurcheck', 'Vergelijk muur, vloer, hout, stof en schaduw voordat je je definitieve houding vastzet.'],
      ['Waarschuwing', 'Onofficiële gids. Meccha Chameleon en de assets horen bij hun rechthebbenden. Gebruik op eigen risico.'],
    ],
  },
};

export function getHomeCopy(locale: string): HomeCopy {
  const base = locale === 'zh' ? homeCopy.zh : homeCopy.en;
  return {
    ...base,
    openTools: locale === 'zh' ? '查看辅助工具页面' : 'Open tools page',
    ...(homeCopyOverrides[locale] ?? {}),
  } as HomeCopy;
}

// Only `/zh/tools` and `/ru/tools` are fully localized.
// All other reopened locales should land on the English `/tools` page
// until those pages get native rewrites. This avoids the proxy 301→/
// redirect that swallows in-page links.
const TOOLS_LOCALES = new Set(['zh', 'ru']);

export function getLocalizedPath(locale: string, path: string): string {
  if (locale === 'en') return path;
  if (path === '/tools' && !TOOLS_LOCALES.has(locale)) return '/tools';
  if (path === '/new-player' && !TOOLS_LOCALES.has(locale)) return '/new-player';
  return `/${locale}${path}`;
}

export const mapLabels = {
  en: { spots: 'spots', difficulty: 'difficulty', selectedSpot: 'Selected spot', paintColors: 'Paint colors', primary: 'Primary', secondary: 'Secondary', back: 'Back to atlas', guide: 'Meccha Chameleon map guide', hidingSpots: 'Hiding Spots', ready: 'Ready for the real match?', readyBody: 'Keep this atlas open while you queue up, compare map colors, and pick your next hiding route.', play: 'Play online', titleSuffix: 'Hiding Spots — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon hiding spot atlas (10 spots): screenshots, paint RGB, difficulty, and hider tips.', altPreview: 'Meccha Chameleon map preview' },
  zh: { spots: '个点位', difficulty: '难度', selectedSpot: '当前点位', paintColors: '涂装颜色', primary: '主色', secondary: '辅色', back: '返回图鉴', guide: '超级变色龙地图攻略', hidingSpots: '隐藏点', ready: '准备进入真实对局了吗？', readyBody: '排队时保持这个图鉴打开，对照地图颜色，选择下一条隐藏路线。', play: '在线玩', titleSuffix: '隐藏点 — 超级变色龙', descriptionSuffix: '超级变色龙隐藏点地图图鉴（10 个点位）：截图、涂装 RGB、难度和隐藏者提示。', altPreview: '超级变色龙地图预览' },
  es: { spots: 'escondites', difficulty: 'dificultad', selectedSpot: 'Escondite seleccionado', paintColors: 'Colores de pintura', primary: 'Principal', secondary: 'Secundario', back: 'Volver al atlas', guide: 'Guía de mapas de Meccha Chameleon', hidingSpots: 'Mejores escondites', ready: '¿Listo para la partida real?', readyBody: 'Mantén este atlas abierto como segunda pantalla, compara colores del mapa y elige tu próxima ruta de escondite.', play: 'Jugar online', titleSuffix: 'Mejores escondites — Meccha Chameleon', descriptionSuffix: 'Atlas de escondites de Meccha Chameleon: capturas, RGB, dificultad y consejos para Ocultistas.', altPreview: 'Vista previa de mapa de Meccha Chameleon' },
  de: { spots: 'Verstecke', difficulty: 'Schwierigkeit', selectedSpot: 'Ausgewählter Spot', paintColors: 'Painting-Farben', primary: 'Primär', secondary: 'Sekundär', back: 'Zurück zum Atlas', guide: 'Meccha Chameleon Karten-Guide', hidingSpots: 'Beste Verstecke', ready: 'Bereit für die echte Runde?', readyBody: 'Lass den Atlas als zweiten Bildschirm offen, vergleiche Kartenfarben und wähle deine nächste Versteckroute.', play: 'Online spielen', titleSuffix: 'Beste Verstecke — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon Versteck-Atlas: Screenshots, RGB, Schwierigkeit und Tipps für Versteckende.', altPreview: 'Meccha Chameleon Karten-Vorschau' },
  pt: { spots: 'esconderijos', difficulty: 'dificuldade', selectedSpot: 'Spot selecionado', paintColors: 'Cores de pintura', primary: 'Primária', secondary: 'Secundária', back: 'Voltar ao atlas', guide: 'Guia de mapas de Meccha Chameleon', hidingSpots: 'Melhores esconderijos', ready: 'Pronto para a partida real?', readyBody: 'Deixe o atlas aberto como segunda tela, compare as cores do mapa e escolha sua próxima rota de esconderijo.', play: 'Jogar online', titleSuffix: 'Melhores esconderijos — Meccha Chameleon', descriptionSuffix: 'Atlas de esconderijos de Meccha Chameleon: capturas, RGB, dificuldade e dicas para Escondedores.', altPreview: 'Prévia do mapa de Meccha Chameleon' },
  fr: { spots: 'cachettes', difficulty: 'difficulté', selectedSpot: 'Cachette sélectionnée', paintColors: 'Couleurs de peinture', primary: 'Principale', secondary: 'Secondaire', back: 'Retour à l’atlas', guide: 'Guide des cartes de Meccha Chameleon', hidingSpots: 'Meilleures cachettes', ready: 'Prêt pour la vraie partie ?', readyBody: 'Gardez cet atlas ouvert en second écran, comparez les couleurs de la carte et choisissez votre prochaine route de cachette.', play: 'Jouer en ligne', titleSuffix: 'Meilleures cachettes — Meccha Chameleon', descriptionSuffix: 'Atlas des cachettes de Meccha Chameleon : captures, RGB, difficulté et conseils pour les Cacheurs.', altPreview: 'Aperçu de carte Meccha Chameleon' },
  it: { spots: 'nascondigli', difficulty: 'difficoltà', selectedSpot: 'Spot selezionato', paintColors: 'Colori di pittura', primary: 'Primario', secondary: 'Secondario', back: 'Torna all’atlante', guide: 'Guida mappe di Meccha Chameleon', hidingSpots: 'Migliori nascondigli', ready: 'Pronto per la partita vera?', readyBody: 'Tieni aperto l’atlante come secondo schermo, confronta i colori della mappa e scegli il tuo prossimo percorso di nascondiglio.', play: 'Gioca online', titleSuffix: 'Migliori nascondigli — Meccha Chameleon', descriptionSuffix: 'Atlante dei nascondigli di Meccha Chameleon: screenshot, RGB, difficoltà e consigli per i Nasconditori.', altPreview: 'Anteprima mappa Meccha Chameleon' },
  nl: { spots: 'schuilplekken', difficulty: 'moeilijkheid', selectedSpot: 'Geselecteerde plek', paintColors: 'Verfkleuren', primary: 'Primair', secondary: 'Secundair', back: 'Terug naar atlas', guide: 'Meccha Chameleon kaartgids', hidingSpots: 'Beste schuilplekken', ready: 'Klaar voor de echte match?', readyBody: 'Houd deze atlas open als tweede scherm, vergelijk kaartkleuren en kies je volgende schuilroute.', play: 'Speel online', titleSuffix: 'Beste schuilplekken — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon schuilplekatlas: screenshots, RGB, moeilijkheid en tips voor Verstoppers.', altPreview: 'Meccha Chameleon kaartvoorbeeld' },
  ar: { spots: 'أماكن', difficulty: 'الصعوبة', selectedSpot: 'النقطة المحددة', paintColors: 'ألوان الطلاء', primary: 'أساسي', secondary: 'ثانوي', back: 'العودة إلى الأطلس', guide: 'دليل خرائط Meccha Chameleon', hidingSpots: 'أفضل أماكن الاختباء', ready: 'جاهز للمباراة الحقيقية؟', readyBody: 'اترك هذا الأطلس مفتوحاً كشاشة ثانية، وقارن ألوان الخريطة واختر طريق اختبائك التالي.', play: 'العب أونلاين', titleSuffix: 'أفضل أماكن الاختباء — Meccha Chameleon', descriptionSuffix: 'أطلس أماكن الاختباء في Meccha Chameleon: لقطات شاشة وRGB وصعوبة ونصائح للمختبئين.', altPreview: 'معاينة خريطة Meccha Chameleon' },
  ja: { spots: '隠れスポット', difficulty: '難易度', selectedSpot: '選択中のスポット', paintColors: 'ペイント色', primary: 'メイン', secondary: 'サブ', back: 'アトラスへ戻る', guide: 'Meccha Chameleon マップ ガイド', hidingSpots: '最強の隠れ場所', ready: '実戦の準備はいいですか?', readyBody: 'このアトラスをサブ画面で開いたまま、マップの色彩とベスト スポットを比較しましょう。', play: 'オンラインでプレイ', titleSuffix: '最強の隠れ場所 — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon 隠れスポット アトラス: スクリーンショット、RGB、難易度、ヒダー向け Tips。', altPreview: 'Meccha Chameleon マップ プレビュー' },
  ko: { spots: '숨는 스팟', difficulty: '난이도', selectedSpot: '선택한 스팟', paintColors: '페인트 색상', primary: '메인', secondary: '서브', back: '아틀라스로 돌아가기', guide: 'Meccha Chameleon 맵 가이드', hidingSpots: '최고의 숨는 장소', ready: '실전 준비 완료?', readyBody: '이 아틀라스를 서브 화면에서 열어 두고, 맵 컬러와 베스트 스팟을 비교하세요.', play: '온라인 플레이', titleSuffix: '최고의 숨는 장소 — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon 숨는 스팟 아틀라스: 스크린샷, RGB, 난이도, 하이더 팁.', altPreview: 'Meccha Chameleon 맵 미리보기' },
} as const;

const mapZh: Record<string, Pick<AtlasMap, 'name' | 'desc' | 'difficulty'>> = {
  'vintage-room': { name: '复古会客厅', difficulty: 'medium', desc: '巴洛克绿色锦缎墙纸、黑白棋盘地板、镀金画框和吊灯光线。适合练习绿色与金色的伪装涂装。' },
  'cow-farm': { name: '田园奶牛农场', difficulty: 'easy', desc: '开阔牧场、奶牛、干草堆、红色谷仓和卡通天空壁画。新手友好，亮绿、草黄和谷仓红对比清晰。' },
  'brick-tavern': { name: '砖墙酒馆大厅', difficulty: 'medium', desc: '红砖墙、外露木梁和金色马雕像，经典酒馆氛围。适合练习砖红和木棕色匹配。' },
  'grand-ballroom': { name: '豪华宴会厅', difficulty: 'hard', desc: '水晶吊灯、三角钢琴、宴会桌和弧形楼梯。暖黄和深红很多，装饰面复杂，是最难地图之一。' },
  'blue-parlor': { name: '蓝色花纹客厅', difficulty: 'hard', desc: '蓝色花纹墙纸、红色天鹅绒贵妃椅、圆形吊灯和衣帽架。冷蓝与红色点缀并存，对颜色匹配要求很高。' },
};

const mapEs: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'Mansión del escondite', desc: 'Mansión clásica con biblioteca, baño de azulejos, cocina y salón de baile. Buen mapa para aprender escondites entre libros, cuadros, marcos dorados y madera cálida.' },
  'indoor-country': { name: 'Campo interior', desc: 'Granja interior con vacas, pacas de paja, puertas rojas, calabazas y murales de cielo. Ideal para practicar camuflaje básico con bloques grandes de color.' },
  'sewer': { name: 'Alcantarillado', desc: 'Túneles oscuros con tuberías, barriles rojos y paredes con grafiti. La luz tenue ayuda a los Ocultistas, pero los Buscadores revisan rápido las zonas conocidas.' },
  'backrooms': { name: 'Backrooms', desc: 'Oficinas amarillas con mucha luz y pocos escondites obvios. Es difícil para Ocultistas porque cualquier borde mal pintado se nota enseguida.' },
  'penguin-hotel': { name: 'Hotel Pingüino', desc: 'Hotel invernal con habitaciones, baños, estatuas de pingüino, patos y globos. Tiene mucho ruido visual, pero también muchos objetos que los Buscadores revisan.' },
  'osaka': { name: 'Osaka', desc: 'Mapa japonés compacto con camión, carteles, bolsas de basura, madera y tiendas abiertas. Conviene planear rutas cortas y usar señales elevadas para romper la silueta.' },
};

const mapDe: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'Versteck-Mansion', desc: 'Klassische Mansion mit Bibliothek, Badfliesen, Küche und Ballsaal. Stark für Verstecke zwischen Büchern, Bildern, goldenen Rahmen und warmem Holz.' },
  'indoor-country': { name: 'Indoor Country', desc: 'Innenraum-Farm mit Kühen, Heuballen, roten Scheunentoren, Kürbissen und Himmel-Wandbild. Gut, um Tarnung mit großen Farbflächen zu üben.' },
  'sewer': { name: 'Kanalisation', desc: 'Dunkle Tunnel mit Rohren, roten Fässern und Graffiti-Wänden. Schwaches Licht hilft Versteckenden, aber bekannte Spots werden schnell von Suchern geprüft.' },
  'backrooms': { name: 'Backrooms', desc: 'Gelbe Büroräume mit starker Beleuchtung und wenig natürlicher Deckung. Schwer für Versteckende, weil jede harte Kante sofort auffällt.' },
  'penguin-hotel': { name: 'Pinguin-Hotel', desc: 'Winterliches Hotel mit Zimmern, Bädern, Pinguin-Statuen, Enten und Ballons. Viel visuelles Rauschen, aber auch viele Objekte, die Sucher kontrollieren.' },
  'osaka': { name: 'Osaka', desc: 'Kompakter Japan-Stadtblock mit Truck, Schildern, Müllsäcken, Holzstapeln und offenen Läden. Kurze Routen und erhöhte Schilder brechen die Silhouette.' },
};

const mapPt: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'Mansão do esconde-esconde', desc: 'Mansão clássica com biblioteca, banheiro azulejado, cozinha e salão. Ótima para esconderijos entre livros, quadros, molduras douradas e madeira quente.' },
  'indoor-country': { name: 'Campo interno', desc: 'Fazenda indoor com vacas, fardos de feno, portas vermelhas, abóboras e mural de céu. Boa para treinar camuflagem com blocos grandes de cor.' },
  'sewer': { name: 'Esgoto', desc: 'Túneis escuros com canos, barris vermelhos e paredes grafitadas. A luz fraca ajuda os Escondedores, mas spots conhecidos são checados rápido pelos Buscadores.' },
  'backrooms': { name: 'Backrooms', desc: 'Salas amarelas muito iluminadas e com pouca cobertura natural. É um mapa duro porque qualquer borda pintada errado aparece na hora.' },
  'penguin-hotel': { name: 'Hotel Pinguim', desc: 'Hotel de inverno com quartos, banheiros, estátuas de pinguim, patos e balões. Tem muito ruído visual, mas também muitos objetos que os Buscadores inspecionam.' },
  'osaka': { name: 'Osaka', desc: 'Mapa urbano compacto com caminhão, letreiros, sacos de lixo, madeira empilhada e lojas abertas. Rotas curtas e placas elevadas ajudam a quebrar a silhueta.' },
};

const mapFr: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'Manoir cache-cache', desc: 'Manoir classique avec bibliothèque, salle de bain carrelée, cuisine et salle de bal. Excellent pour apprendre les cachettes entre livres, cadres, dorures et bois chaud.' },
  'indoor-country': { name: 'Campagne intérieure', desc: 'Ferme intérieure avec vaches, bottes de foin, portes rouges, citrouilles et fresque de ciel. Bonne carte pour entraîner un camouflage simple sur de grands aplats de couleur.' },
  'sewer': { name: 'Égouts', desc: 'Tunnels sombres avec tuyaux, barils rouges et murs couverts de graffitis. La faible lumière aide les Cacheurs, mais les spots connus sont vite vérifiés par les Chercheurs.' },
  'backrooms': { name: 'Backrooms', desc: 'Bureaux jaunes très éclairés avec peu de couverture naturelle. Carte difficile car la moindre bordure mal peinte saute immédiatement aux yeux.' },
  'penguin-hotel': { name: 'Hôtel Pingouin', desc: 'Hôtel hivernal avec chambres, salles de bain, statues de pingouin, canards et ballons. Beaucoup de bruit visuel, mais aussi beaucoup d’objets inspectés par les Chercheurs.' },
  'osaka': { name: 'Osaka', desc: 'Bloc urbain compact avec camion, enseignes, sacs-poubelle, piles de bois et boutiques ouvertes. Les trajets courts et les panneaux en hauteur aident à casser la silhouette.' },
};

const mapIt: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'Villa nascondino', desc: 'Villa classica con biblioteca, bagno piastrellato, cucina e sala da ballo. Ottima per imparare i nascondigli tra libri, quadri, cornici dorate e legno caldo.' },
  'indoor-country': { name: 'Campagna indoor', desc: 'Fattoria interna con mucche, balle di fieno, porte rosse, zucche e murale del cielo. Buona per allenare una mimetizzazione semplice su grandi blocchi di colore.' },
  'sewer': { name: 'Fogne', desc: 'Tunnel scuri con tubi, barili rossi e muri coperti di graffiti. La luce bassa aiuta i Nasconditori, ma gli spot famosi vengono controllati in fretta dai Cercatori.' },
  'backrooms': { name: 'Backrooms', desc: 'Uffici gialli molto illuminati e con poca copertura naturale. Mappa dura perché ogni bordo dipinto male salta subito all’occhio.' },
  'penguin-hotel': { name: 'Hotel Pinguino', desc: 'Hotel invernale con stanze, bagni, statue di pinguino, paperelle e palloncini. Ha tanto rumore visivo, ma anche molti oggetti che i Cercatori ispezionano.' },
  'osaka': { name: 'Osaka', desc: 'Blocco urbano compatto con camion, insegne, sacchi della spazzatura, cataste di legno e negozi aperti. Percorsi corti e cartelli alti aiutano a spezzare la silhouette.' },
};

const mapNl: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'Verstopvilla', desc: 'Klassieke villa met bibliotheek, betegelde badkamer, keuken en balzaal. Sterke map om schuilplekken tussen boeken, schilderijen, gouden lijsten en warm hout te leren.' },
  'indoor-country': { name: 'Binnenboerderij', desc: 'Boerderij binnen met koeien, hooibalen, rode deuren, pompoenen en een luchtmuur. Goed om eenvoudige camouflage met grote kleurvlakken te oefenen.' },
  'sewer': { name: 'Riolering', desc: 'Donkere tunnels met pijpen, rode vaten en graffitiwanden. Het zwakke licht helpt Verstoppers, maar bekende spots worden snel door Zoekers nagekeken.' },
  'backrooms': { name: 'Backrooms', desc: 'Gele kantoorruimtes met veel licht en weinig natuurlijke dekking. Moeilijke map omdat elke verkeerd geverfde rand meteen opvalt.' },
  'penguin-hotel': { name: 'Pinguïnhotel', desc: 'Winterhotel met kamers, badkamers, pinguïnbeelden, eendjes en ballonnen. Veel visuele ruis, maar ook veel objecten die Zoekers controleren.' },
  'osaka': { name: 'Osaka', desc: 'Compact stadsblok met vrachtwagen, borden, vuilniszakken, houtstapels en open winkels. Korte routes en hoge borden helpen om je silhouet te breken.' },
};

const mapAr: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'قصر الاختباء', desc: 'قصر كلاسيكي فيه مكتبة وحمام مبلط ومطبخ وقاعة رقص. ممتاز لتعلّم الاختباء بين الكتب والإطارات الذهبية والخشب الدافئ.' },
  'indoor-country': { name: 'الريف الداخلي', desc: 'مزرعة داخلية فيها أبقار ولفائف قش وأبواب حمراء ويقطين ولوحة سماء. جيدة لتعلّم تمويه بسيط على مساحات لونية كبيرة.' },
  'sewer': { name: 'المجاري', desc: 'أنفاق مظلمة مع أنابيب وبراميل حمراء وجدران غرافيتي. الإضاءة الخافتة تساعد المختبئين، لكن النقاط المعروفة تُفحص بسرعة.' },
  'backrooms': { name: 'Backrooms', desc: 'مكاتب صفراء شديدة الإضاءة وبغطاء طبيعي قليل. خريطة قاسية لأن أي حافة مطلية بشكل سيئ تظهر فوراً.' },
  'penguin-hotel': { name: 'فندق البطريق', desc: 'فندق شتوي مع غرف وحمامات وتماثيل بطاريق وبطّات وبالونات. فيه ضوضاء بصرية كثيرة، لكن فيه أيضاً عناصر كثيرة يفتشها الباحثون.' },
  'osaka': { name: 'أوساكا', desc: 'حي حضري مضغوط فيه شاحنة ولافتات وأكياس قمامة وخشب متراكم ومتاجر مفتوحة. المسارات القصيرة واللافتات العالية تساعد على كسر silhouette الجسم.' },
};

const mapKo: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: '숨바꼭질 저택', desc: '책장, 액자, 타일, 따뜻한 조명, 주방, 거실. 하이더가 시각 노이즈 많은 위치를 익히기 좋은 맵.' },
  'indoor-country': { name: '실내 농장', desc: '소, 건초, 빨간 문, 호박, 하늘 벽. 색면이 넓어 페인트 입문에 좋음.' },
  'sewer': { name: '하수도', desc: '파이프, 빨간 드럼, 그래피티 벽. 어두운 조명은 하이더에 유리하지만 단골 스팟은 빠르게 스캔됨.' },
  'backrooms': { name: '백룸', desc: '노란 사무실, 형광등, 자연 은폐 부족. 가장 까다로운 맵, 작은 가장자리도 즉시 노출.' },
  'penguin-hotel': { name: '펭귄 호텔', desc: '객실, 욕실, 펭귄 조각상, 오리 소품, 풍선. 시각 노이즈는 많지만 시커의 체크 항목도 많음.' },
  'osaka': { name: '오사카', desc: '1.7.0 신규 일본식 도시 블록: 트럭, 간판, 쓰레기 봉투, 나무 더미, 개방된 가게. 좁은 통로와 높은 간판이 실루엣을 끊어줌.' },
};

const mapJa: Record<string, Pick<AtlasMap, 'name' | 'desc'>> = {
  'hide-and-seek-mansion': { name: 'かくれんぼマンション', desc: '本棚、額縁、タイル、暖色照明、キッチン、キッチン タイル、暖色木材が特徴。ヒーダーが視覚ノイズの多い位置を覚えるのに最適。' },
  'indoor-country': { name: '田園屋内', desc: '牛、藁、赤い扉、カボチャ、空の壁がある屋内ファーム。色面が大きく、ペイント練習の入門に最適。' },
  'sewer': { name: '下水道', desc: 'パイプ、赤いドラム缶、グラフィティ ウォール。薄暗さがヒーダーに有利だが、有名スポットはシーカーにチェックされやすい。' },
  'backrooms': { name: 'バックルームズ', desc: '黄色いオフィス、蛍光灯、少ない自然カバー。エッジが少し浮いただけで即バレする鬼畜マップ。' },
  'penguin-hotel': { name: 'ペンギン ホテル', desc: '客室、浴室、ペンギン像、アヒル グッズ、風船。視覚ノイズは多いが、シーカーがチェックする対象も多い。' },
  'osaka': { name: '大阪', desc: '1.7.0 で追加されたジャパニーズ テーマの街ブロック: トラック、看板、ゴミ袋、材木、商店が密集。狭い通路と高い看板がシルエットを切る。' },
};

const spotZh: Record<string, Pick<AtlasSpot, 'name' | 'tip'>> = {
  'vintage-01': { name: '镀金画框伪装', tip: '蹲在金色画框后方，把身体涂成深锦缎绿，贴近周围墙纸纹理。' },
  'vintage-02': { name: '走廊花瓶藏点', tip: '站在派对旗帜下的高花瓶旁，使用米白底色并点上绿色花纹。' },
  'vintage-03': { name: '棋盘地板彩蛋堆', tip: '钻进黑白地板上的彩蛋堆，把自己涂成随机粉彩斑块。' },
  'vintage-04': { name: '壁灯阴影角落', tip: '卡在壁灯下方的阴暗角落，绿色墙纸接近黑色时用深炭灰伪装。' },
  'vintage-05': { name: '楼梯踏步阴影', tip: '爬到楼梯中段，蹲在踏步阴影里，使用深木棕色。' },
  'vintage-06': { name: '皮沙发背后', tip: '贴到棕色皮沙发背面，把身体涂成偏红的皮革棕色。' },
  'vintage-07': { name: '桌布褶皱', tip: '躲到垂落桌布下，使用暖灰褐色匹配布料褶皱阴影。' },
  'vintage-08': { name: '窗帘落地处', tip: '贴着及地窗帘底部，涂成带灰尘感的米色融入布料堆叠。' },
  'vintage-09': { name: '古董钟柜顶部', tip: '跳到祖父钟旁的柜顶，涂成深木色并加一点黄铜色。' },
  'vintage-10': { name: '镜框金边', tip: '卡进镀金镜框边缘，涂成暖金色并保持完全静止。' },
  'farm-01': { name: '奶牛花纹干草堆', tip: '站在干草堆旁的斑点奶牛附近，用黑白竖条模仿奶牛皮。' },
  'farm-02': { name: '卷草垛中心', tip: '蜷进圆形草垛里，使用麦金色并加深琥珀色条纹。' },
  'farm-03': { name: '红谷仓门阴影', tip: '躲到红色谷仓门拱后，使用深谷仓红并在阴影侧加暗红。' },
  'farm-04': { name: '白色栅栏柱', tip: '贴齐白色栅栏柱，涂成干净的灰白色并加轻微风化边缘。' },
  'farm-05': { name: '卡通云壁画', tip: '靠在天空壁画的云朵上，使用天蓝底色和蓬松白色斑块。' },
  'farm-06': { name: '木箱堆缝隙', tip: '挤进木箱堆之间，涂成咖啡棕匹配老松木。' },
  'farm-07': { name: '热气球篮子', tip: '躲在热气球篮下方，使用醒目的蓝白竖条。' },
  'farm-08': { name: '拖拉机轮胎阴影', tip: '蹲在拖拉机大后轮旁，涂成哑黑并带一点胎纹阴影。' },
  'farm-09': { name: '草绿色屋顶角', tip: '爬到草地和棚顶交界处，用鲜绿色融进草坪。' },
  'farm-10': { name: '牛奶罐群', tip: '挤进金属奶罐堆里，涂成拉丝银并加浅凹痕阴影。' },
  'brick-01': { name: '金马雕像底座', tip: '蹲在金色马雕像台座旁，涂成金属金色融入青铜质感。' },
  'brick-02': { name: '砖缝凹槽', tip: '贴进更深的砖墙凹槽，使用暖砖棕并画出暗色灰缝。' },
  'brick-03': { name: '木梁阴影', tip: '藏在粗重天花木梁下，涂成深木棕并加焦黑阴影。' },
  'brick-04': { name: '木桶侧面', tip: '贴住墙边酒桶，涂成红棕色匹配老橡木。' },
  'brick-05': { name: '红地毯花纹', tip: '趴在波斯地毯上，使用深红并画出金色花纹。' },
  'brick-06': { name: '壁炉灰烬区', tip: '站进冷壁炉里，涂成烟灰炭黑并保留砖边色。' },
  'brick-07': { name: '楼梯踏步侧边', tip: '坐在木楼梯踏步侧面，涂成中棕色匹配立板阴影。' },
  'brick-08': { name: '古董烛台旁', tip: '站在青铜烛台旁，涂成古铜色并利用暗木背景。' },
  'brick-09': { name: '酒馆长凳下', tip: '钻到长橡木凳下，使用暖灰棕匹配座位阴影。' },
  'brick-10': { name: '画框后方', tip: '贴在墙画后面，使用深红棕并加金色画框高光。' },
  'ballroom-01': { name: '三角钢琴漆面', tip: '蹲在黑色亮漆三角钢琴旁，涂成纯黑并加一点光泽高光。' },
  'ballroom-02': { name: '水晶吊灯杆', tip: '站在吊灯杆下，涂成奶油金，让落光把轮廓吞掉。' },
  'ballroom-03': { name: '宴会桌布折痕', tip: '趴在宴会桌上靠近折好的餐巾，涂成纯白并加灰色折痕。' },
  'ballroom-04': { name: '雕花高背椅', tip: '卡进高背雕花椅缝，涂成深胡桃木色并加深木纹。' },
  'ballroom-05': { name: '楼梯常春藤花环', tip: '贴进楼梯扶手常春藤，涂成森林绿并加暗苔藓色。' },
  'ballroom-06': { name: '派对气球簇', tip: '站进气球花束，用强烈红蓝色块混进气球。' },
  'ballroom-07': { name: '大理石柱纹', tip: '贴住大理石柱，涂成奶油色并画出焦糖色纹理。' },
  'ballroom-08': { name: '窗帘深褶阴影', tip: '藏进厚天鹅绒窗帘褶里，使用近黑咖啡棕。' },
  'ballroom-09': { name: '壁灯之间的阴影池', tip: '停在两盏壁灯之间，涂成中灰色融入阴影谷。' },
  'ballroom-10': { name: '红色垂幅', tip: '贴住悬挂红色垂幅，涂成深绯红并加暗褶皱。' },
  'parlor-01': { name: '睡姿贴墙技巧', tip: '侧躺在蓝色花纹墙上，用主蓝色把身体压平成墙纸的一部分。' },
  'parlor-02': { name: '红色贵妃椅扶手', tip: '蜷在红天鹅绒扶手上，涂成深红并加暗侧阴影。' },
  'parlor-03': { name: '灰色窗帘褶', tip: '滑进两道灰色窗帘褶之间，涂成中灰并画出深折线。' },
  'parlor-04': { name: '衣帽架轮廓', tip: '站在木制衣帽架后面，涂成深胡桃木融入柱子阴影。' },
  'parlor-05': { name: '天花灯眩光', tip: '站在圆形吊灯正下方，涂成灯白色，让眩光吞掉你。' },
  'parlor-06': { name: '蓝色花墙角', tip: '贴进两块蓝色墙纸交汇的深角落，使用海军蓝并加暗褶。' },
  'parlor-07': { name: '镜面盲角', tip: '站在镜子的盲角，涂成冷灰蓝，让反射把你当成背景。' },
  'parlor-08': { name: '床头柜侧面', tip: '蹲在木床头柜旁，涂成暖栗色匹配抽屉正面。' },
  'parlor-09': { name: '蓝色印花地毯', tip: '坐在蓝色花纹地毯上，涂成海军蓝并加清晰白花。' },
  'parlor-10': { name: '昏暗角落池', tip: '走进客厅最暗的角落，涂成暮色灰蓝融入阴影。' },
};

export function localizeMap(map: AtlasMap, locale: string): AtlasMap {
  if (isZh(locale)) return { ...map, ...(mapZh[map.id] ?? {}) };
  if (isEs(locale)) return { ...map, ...(mapEs[map.id] ?? {}) };
  if (locale === 'de') return { ...map, ...(mapDe[map.id] ?? {}) };
  if (isPt(locale)) return { ...map, ...(mapPt[map.id] ?? {}) };
  if (isFr(locale)) return { ...map, ...(mapFr[map.id] ?? {}) };
  if (isIt(locale)) return { ...map, ...(mapIt[map.id] ?? {}) };
  if (isNl(locale)) return { ...map, ...(mapNl[map.id] ?? {}) };
  if (locale === 'ar') return { ...map, ...(mapAr[map.id] ?? {}) };
  if (locale === 'ja') return { ...map, ...(mapJa[map.id] ?? {}) };
  return map;
}

export function localizeSpot(spot: AtlasSpot, locale: string): AtlasSpot {
  if (!isZh(locale)) return spot;
  return { ...spot, ...(spotZh[spot.id] ?? {}) };
}
