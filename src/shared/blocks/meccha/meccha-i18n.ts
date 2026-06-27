import type { AtlasMap, AtlasSpot } from './atlas-data';

export const isZh = (locale: string) => locale === 'zh';
export const isEs = (locale: string) => locale === 'es';
export const isPt = (locale: string) => locale === 'pt';

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
    title: 'Meccha Chameleon Gioca Online', playNow: 'Gioca ora', howToPlay: 'Come giocare', openTools: 'Apri pagina strumenti',
    newPlayerEyebrow: 'Percorso per nuovi giocatori', newPlayerTitle: 'Se hai cercato prima di scaricare, inizia dal gioco nel browser.',
    camoEyebrow: 'Per giocatori veri', camoTitle: 'Camo Lab trasforma la ricerca in aiuto pronto per la partita.', previewAtlas: 'Anteprima atlante mappe',
    atlasEyebrow: 'Atlante dei nascondigli', atlasTitle: 'Cinque guide mappa reali, cinquanta nascondigli, un secondo schermo veloce.',
    atlasDesc: 'Screenshot, colori di pittura, difficoltà e consigli pratici per le mappe di Meccha Chameleon.',
    secondEyebrow: 'Software assistente di gioco', secondTitle: 'Pagina strumenti per overlay esterno, radar e aiuti mimetici.',
    secondDesc: 'La pagina strumenti raccoglie download, controlli e note di sicurezza del software assistente della community. Solo per scopi educativi e di ricerca. Usalo a tuo rischio.', quickAnswers: 'Risposte rapide',
  },
  fr: {
    title: 'Meccha Chameleon Jouer en Ligne', playNow: 'Jouer maintenant', howToPlay: 'Comment jouer', openTools: 'Ouvrir les outils',
    newPlayerEyebrow: 'Parcours nouveau joueur', newPlayerTitle: 'Si vous avez cherché avant de télécharger, commencez par le jeu navigateur.',
    camoEyebrow: 'Pour les vrais joueurs', camoTitle: 'Camo Lab transforme le trafic de recherche en aide prête pour la partie.', previewAtlas: 'Voir l’atlas des cartes',
    atlasEyebrow: 'Atlas des cachettes', atlasTitle: 'Cinq guides de cartes, cinquante cachettes, un second écran rapide.',
    atlasDesc: 'Captures, couleurs de peinture, difficulté et conseils de match pour les cartes Meccha Chameleon.',
    secondEyebrow: 'Logiciel assistant de jeu', secondTitle: 'Page d’outils pour overlay externe, radar et aides de camouflage.',
    secondDesc: 'La page outils résume les logiciels assistants communautaires, téléchargements, contrôles et notes de sécurité. À des fins éducatives et de recherche uniquement. Utilisez à vos risques.', quickAnswers: 'Réponses rapides',
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
  ja: {
    title: 'Meccha Chameleon オンラインプレイ', playNow: '今すぐプレイ', howToPlay: '遊び方', openTools: 'ツールページを開く',
    newPlayerEyebrow: '新規プレイヤールート', newPlayerTitle: 'ダウンロード前に検索して来たなら、まずブラウザ版から始めましょう。',
    camoEyebrow: '実戦プレイヤー向け', camoTitle: 'Camo Lab は検索流入を試合で使えるヘルプに変えます。', previewAtlas: 'マップアトラスを見る',
    atlasEyebrow: '隠れ場所アトラス', atlasTitle: '5つの実マップガイド、50の隠れ場所、すばやいセカンドスクリーン。',
    atlasDesc: 'Meccha Chameleon のマップ用スクリーンショット、塗装色、難易度、実戦ヒントをまとめています。',
    secondEyebrow: 'ゲーム補助ソフト', secondTitle: '外部オーバーレイ、レーダー、カモフラージュ補助のツールページ。',
    secondDesc: '専用ツールページではコミュニティ製補助ソフト、ダウンロード、操作、注意事項をまとめています。教育・研究目的のみ。自己責任で使用してください。', quickAnswers: 'クイック回答',
  },
  ko: {
    title: 'Meccha Chameleon 온라인 플레이', playNow: '지금 플레이', howToPlay: '플레이 방법', openTools: '도구 페이지 열기',
    newPlayerEyebrow: '신규 플레이어 루트', newPlayerTitle: '다운로드 전에 검색해 왔다면 브라우저 게임부터 시작하세요.',
    camoEyebrow: '실전 플레이어용', camoTitle: 'Camo Lab은 검색 방문자를 바로 경기에서 쓸 수 있는 도움으로 바꿉니다.', previewAtlas: '지도 아틀라스 보기',
    atlasEyebrow: '숨는 위치 아틀라스', atlasTitle: '실제 지도 가이드 5개, 숨는 위치 50개, 빠른 세컨드 스크린.',
    atlasDesc: 'Meccha Chameleon 지도 스크린샷, 도색 색상, 난이도, 경기 팁을 정리했습니다.',
    secondEyebrow: '게임 보조 소프트웨어', secondTitle: '외부 오버레이, 레이더, 위장 보조 도구 페이지.',
    secondDesc: '도구 페이지는 커뮤니티 보조 소프트웨어, 다운로드, 조작법, 안전 안내를 정리합니다. 교육 및 연구 목적 전용입니다. 사용은 본인 책임입니다.', quickAnswers: '빠른 답변',
  },
  ar: {
    title: 'Meccha Chameleon العب أونلاين', playNow: 'العب الآن', howToPlay: 'طريقة اللعب', openTools: 'افتح صفحة الأدوات',
    newPlayerEyebrow: 'مسار اللاعب الجديد', newPlayerTitle: 'إذا وصلت من البحث قبل التنزيل، ابدأ بلعبة المتصفح أولاً.',
    camoEyebrow: 'للاعبين الحقيقيين', camoTitle: 'Camo Lab يحوّل البحث إلى مساعدة جاهزة للمباراة.', previewAtlas: 'معاينة أطلس الخرائط',
    atlasEyebrow: 'أطلس أماكن الاختباء', atlasTitle: 'خمسة أدلة خرائط حقيقية، خمسون مكان اختباء، وشاشة ثانية سريعة.',
    atlasDesc: 'لقطات شاشة وألوان طلاء ومستوى صعوبة ونصائح لعب لخرائط Meccha Chameleon.',
    secondEyebrow: 'برنامج مساعد للعبة', secondTitle: 'صفحة أدوات للطبقة الخارجية والرادار ومساعدات التمويه.',
    secondDesc: 'تلخص صفحة الأدوات برامج المجتمع المساعدة والتنزيلات والتحكم وملاحظات السلامة. للأغراض التعليمية والبحثية فقط. استخدمه على مسؤوليتك.', quickAnswers: 'إجابات سريعة',
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
    title: 'Meccha Chameleon Online Spelen', playNow: 'Nu spelen', howToPlay: 'Hoe speel je', openTools: 'Open tools-pagina',
    newPlayerEyebrow: 'Nieuwe-speler route', newPlayerTitle: 'Als je zocht vóór het downloaden, begin dan met de browsergame.',
    camoEyebrow: 'Voor echte spelers', camoTitle: 'Camo Lab verandert zoekverkeer in hulp die klaar is voor de match.', previewAtlas: 'Bekijk kaartatlas',
    atlasEyebrow: 'Verstopplek-atlas', atlasTitle: 'Vijf echte kaartgidsen, vijftig verstopplekken en één snelle tweede scherm.',
    atlasDesc: 'Screenshots, verfkleuren, moeilijkheid en wedstrijdtips voor Meccha Chameleon-kaarten.',
    secondEyebrow: 'Game-assistentsoftware', secondTitle: 'Toolspagina voor externe overlay, radar en camouflagehulp.',
    secondDesc: 'De toolspagina vat community-assistentsoftware, downloads, bediening en veiligheidsnotities samen. Alleen voor educatie en onderzoek. Gebruik op eigen risico.', quickAnswers: 'Snelle antwoorden',
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

export function getLocalizedPath(locale: string, path: string): string {
  return locale === 'en' ? path : `/${locale}${path}`;
}

export const mapLabels = {
  en: { spots: 'spots', difficulty: 'difficulty', selectedSpot: 'Selected spot', paintColors: 'Paint colors', primary: 'Primary', secondary: 'Secondary', back: 'Back to atlas', guide: 'Meccha Chameleon map guide', hidingSpots: 'Hiding Spots', ready: 'Ready for the real match?', readyBody: 'Keep this atlas open while you queue up, compare map colors, and pick your next hiding route.', play: 'Play online', titleSuffix: 'Hiding Spots — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon hiding spot atlas (10 spots): screenshots, paint RGB, difficulty, and hider tips.', altPreview: 'Meccha Chameleon map preview' },
  zh: { spots: '个点位', difficulty: '难度', selectedSpot: '当前点位', paintColors: '涂装颜色', primary: '主色', secondary: '辅色', back: '返回图鉴', guide: '超级变色龙地图攻略', hidingSpots: '隐藏点', ready: '准备进入真实对局了吗？', readyBody: '排队时保持这个图鉴打开，对照地图颜色，选择下一条隐藏路线。', play: '在线玩', titleSuffix: '隐藏点 — 超级变色龙', descriptionSuffix: '超级变色龙隐藏点地图图鉴（10 个点位）：截图、涂装 RGB、难度和隐藏者提示。', altPreview: '超级变色龙地图预览' },
  es: { spots: 'escondites', difficulty: 'dificultad', selectedSpot: 'Escondite seleccionado', paintColors: 'Colores de pintura', primary: 'Principal', secondary: 'Secundario', back: 'Volver al atlas', guide: 'Guía de mapas de Meccha Chameleon', hidingSpots: 'Mejores escondites', ready: '¿Listo para la partida real?', readyBody: 'Mantén este atlas abierto como segunda pantalla, compara colores del mapa y elige tu próxima ruta de escondite.', play: 'Jugar online', titleSuffix: 'Mejores escondites — Meccha Chameleon', descriptionSuffix: 'Atlas de escondites de Meccha Chameleon: capturas, RGB, dificultad y consejos para Ocultistas.', altPreview: 'Vista previa de mapa de Meccha Chameleon' },
  de: { spots: 'Verstecke', difficulty: 'Schwierigkeit', selectedSpot: 'Ausgewählter Spot', paintColors: 'Painting-Farben', primary: 'Primär', secondary: 'Sekundär', back: 'Zurück zum Atlas', guide: 'Meccha Chameleon Karten-Guide', hidingSpots: 'Beste Verstecke', ready: 'Bereit für die echte Runde?', readyBody: 'Lass den Atlas als zweiten Bildschirm offen, vergleiche Kartenfarben und wähle deine nächste Versteckroute.', play: 'Online spielen', titleSuffix: 'Beste Verstecke — Meccha Chameleon', descriptionSuffix: 'Meccha Chameleon Versteck-Atlas: Screenshots, RGB, Schwierigkeit und Tipps für Versteckende.', altPreview: 'Meccha Chameleon Karten-Vorschau' },
  pt: { spots: 'esconderijos', difficulty: 'dificuldade', selectedSpot: 'Spot selecionado', paintColors: 'Cores de pintura', primary: 'Primária', secondary: 'Secundária', back: 'Voltar ao atlas', guide: 'Guia de mapas de Meccha Chameleon', hidingSpots: 'Melhores esconderijos', ready: 'Pronto para a partida real?', readyBody: 'Deixe o atlas aberto como segunda tela, compare as cores do mapa e escolha sua próxima rota de esconderijo.', play: 'Jogar online', titleSuffix: 'Melhores esconderijos — Meccha Chameleon', descriptionSuffix: 'Atlas de esconderijos de Meccha Chameleon: capturas, RGB, dificuldade e dicas para Escondedores.', altPreview: 'Prévia do mapa de Meccha Chameleon' },
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
  return map;
}

export function localizeSpot(spot: AtlasSpot, locale: string): AtlasSpot {
  if (!isZh(locale)) return spot;
  return { ...spot, ...(spotZh[spot.id] ?? {}) };
}
