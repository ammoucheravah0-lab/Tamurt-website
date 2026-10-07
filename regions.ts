export type LonLat = [number, number];

export interface Hub {
  name: string;
  lon: number;
  lat: number;
}
export interface Craft {
  name: string;
  description: string;
}
export interface Region {
  id: string;
  name: string;
  tagline: string;
  /** Teinte de sable propre à la région sur la carte 3D */
  tone: string;
  /** Distance de caméra lors du zoom */
  zoom: number;
  story: string[];
  crafts: Craft[];
  hubs: Hub[];
  /** Polygone simplifié (lon, lat). Les régions partagent leurs sommets. */
  polygon: LonLat[];
}
export interface Product {
  slug: string;
  name: string;
  regionId: string;
  origin: string;
  craft: string;
  price: string;
  teaser: string;
  image?: string;
  gradient?: [string, string];
}

/* ------------------------------------------------------------------ */
/* Projection : (lon, lat) -> plan (x, y), y = nord. Dans la scène 3D, */
/* z = -y (le nord s'éloigne de la caméra).                            */
/* ------------------------------------------------------------------ */
const K = 0.4;
export function toPlan(lon: number, lat: number): [number, number] {
  return [(lon - 2) * 0.85 * K, (lat - 28) * K];
}
export function regionCenter(region: Region): [number, number] {
  const pts = region.polygon.map(([lo, la]) => toPlan(lo, la));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

export const REGIONS: Region[] = [
  {
    id: "tlemcen-oranie",
    name: "Tlemcen & Oranie",
    tagline: "Héritage andalou et grandes cités de l'Ouest",
    tone: "#E8D4AA",
    zoom: 6,
    story: [
      "Capitale du royaume zianide, Tlemcen a longtemps été l'un des grands foyers culturels du Maghreb occidental. Ses mosquées, son minaret de Mansourah et ses ateliers portent la marque d'échanges avec l'Andalousie.",
      "À l'ouest comme à Oran, la côte mêle influences berbères, arabes, andalouses et méditerranéennes, et nourrit une tradition de broderie et de parure restée vivante dans les mariages.",
    ],
    crafts: [
      { name: "Broderie au fil d'or", description: "Parures de cérémonie, dont la chedda tlemcénienne, brodées à la main." },
      { name: "Décor de zellige et de bois", description: "Un art du décor hérité des ateliers andalous." },
    ],
    hubs: [
      { name: "Tlemcen", lon: -1.31, lat: 34.88 },
      { name: "Oran", lon: -0.64, lat: 35.69 },
    ],
    polygon: [[-1.9, 35.1], [-1.2, 35.5], [-0.65, 35.75], [0.1, 36.0], [1.0, 36.4], [1.0, 35.3], [-1.0, 34.9], [-1.75, 34.7]],
  },
  {
    id: "algerois",
    name: "Algérois",
    tagline: "La Casbah, la mer et le velours brodé",
    tone: "#EBD9B2",
    zoom: 5.5,
    story: [
      "Alger, la Blanche, déploie sa Casbah en cascade vers la baie. Classée au patrimoine mondial de l'UNESCO, elle garde le tracé de ses ruelles et de ses maisons à patio.",
      "À l'ouest, Cherchell, ancienne Caesarea, conserve des vestiges romains et une tradition de mosaïque. Dans les ateliers d'Alger, le velours reçoit des broderies d'or pour le karakou.",
    ],
    crafts: [
      { name: "Karakou", description: "Veste de velours brodée de fils d'or, portée lors des fêtes." },
      { name: "Cuivre et bois sculpté", description: "Objets du quotidien ornés de motifs ottomans et andalous." },
    ],
    hubs: [
      { name: "Alger (Casbah)", lon: 3.06, lat: 36.78 },
      { name: "Cherchell", lon: 2.19, lat: 36.6 },
    ],
    polygon: [[1.0, 36.4], [1.3, 36.5], [2.2, 36.6], [3.05, 36.8], [3.9, 36.9], [3.9, 35.6], [1.0, 35.3]],
  },
  {
    id: "kabylie",
    name: "Kabylie",
    tagline: "Montagnes du Djurdjura, argent, émail et oliviers",
    tone: "#E0C896",
    zoom: 5,
    story: [
      "Dans les montagnes du Djurdjura, les villages kabyles s'accrochent aux crêtes entre oliveraies et figuiers. La langue amazighe, les savoirs des femmes et la vie des villages y forment une culture très ancrée.",
      "À Ath Yenni, des bijoutiers façonnent depuis le XIXᵉ siècle l'argent, l'émail et le corail en fibules, bracelets et pendentifs. Plus bas, la poterie modelée à la main par les femmes et l'huile d'olive pressée dans les collines complètent ce paysage d'artisanat.",
    ],
    crafts: [
      { name: "Bijoux en argent et émail", description: "Fibules, broches et bracelets aux motifs géométriques, travaillés à Ath Yenni." },
      { name: "Poterie kabyle", description: "Jarres et plats modelés au colombin, décorés de motifs peints." },
      { name: "Huile d'olive", description: "Pressée dans les oliveraies des versants de Tizi-Ouzou." },
    ],
    hubs: [
      { name: "Tizi-Ouzou", lon: 4.05, lat: 36.71 },
      { name: "Ath Yenni", lon: 4.21, lat: 36.56 },
    ],
    polygon: [[3.9, 36.9], [5.1, 36.75], [5.9, 36.8], [5.9, 35.4], [3.9, 35.6]],
  },
  {
    id: "constantinois",
    name: "Constantinois",
    tagline: "Cirta, ses ponts et le cuivre martelé",
    tone: "#E6CE9E",
    zoom: 6,
    story: [
      "Constantine, l'antique Cirta, est perchée sur un rocher que le Rhumel entaille de ses gorges. La ville des ponts a été un grand centre de savoir, de musique malouf et d'artisanat urbain.",
      "Les ateliers y travaillent le cuivre martelé et ciselé, et le velours brodé au fil d'or, le mejboud, pour les trousseaux de mariage.",
    ],
    crafts: [
      { name: "Dinanderie", description: "Plateaux, aiguières et bassins de cuivre martelés et gravés." },
      { name: "Broderie mejboud", description: "Fil d'or ou d'argent appliqué sur velours." },
    ],
    hubs: [{ name: "Constantine", lon: 6.61, lat: 36.36 }],
    polygon: [[5.9, 36.8], [6.9, 36.9], [7.8, 36.9], [8.6, 36.93], [8.2, 36.4], [8.3, 35.5], [5.9, 35.4]],
  },
  {
    id: "aures",
    name: "Aurès",
    tagline: "Terre chaouie, entre cèdres et ruines romaines",
    tone: "#D9BE8A",
    zoom: 5.5,
    story: [
      "Massif montagneux à l'est du pays, l'Aurès est le cœur du monde chaoui. Ses vallées, ses gorges et ses villages de pierre ont gardé des traditions pastorales et textiles très vivantes.",
      "Non loin, Timgad rappelle l'empreinte romaine. Les femmes chaouies tissent la laine en couvertures et burnous et portent des parures d'argent au caractère bien reconnaissable.",
    ],
    crafts: [
      { name: "Tissage de laine", description: "Couvertures, burnous et tapis aux motifs géométriques." },
      { name: "Bijouterie d'argent", description: "Fibules, colliers et bracelets de tradition chaouie." },
    ],
    hubs: [
      { name: "Batna", lon: 6.17, lat: 35.56 },
      { name: "Timgad", lon: 6.47, lat: 35.49 },
    ],
    polygon: [[5.9, 35.4], [8.3, 35.5], [7.8, 34.2], [5.9, 34.3]],
  },
  {
    id: "hauts-plateaux",
    name: "Hauts-Plateaux",
    tagline: "Steppe, alfa et laine des grands troupeaux",
    tone: "#E2CC9C",
    zoom: 7,
    story: [
      "Entre l'Atlas tellien et l'Atlas saharien s'étend la steppe des Hauts-Plateaux, un pays d'élevage, de vent et d'horizons amples. Le mode de vie pastoral y a façonné un artisanat de laine et de fibres végétales.",
      "La laine devient tapis et couvertures. L'alfa, herbe tenace de la steppe, se tresse en paniers, nattes et objets du quotidien.",
    ],
    crafts: [
      { name: "Tapis et tissages de laine", description: "Pièces tissées sur métier, issues des traditions pastorales." },
      { name: "Vannerie d'alfa", description: "Paniers et nattes tressés à partir de l'herbe d'alfa." },
    ],
    hubs: [
      { name: "Djelfa", lon: 3.26, lat: 34.67 },
      { name: "Tiaret", lon: 1.32, lat: 35.37 },
    ],
    polygon: [[-1.75, 34.7], [-1.0, 34.9], [1.0, 35.3], [3.9, 35.6], [5.9, 35.4], [5.9, 34.3], [2.0, 33.9], [-1.7, 33.6]],
  },
  {
    id: "mzab",
    name: "M'zab",
    tagline: "La Pentapole ibadite et le tapis de Ghardaïa",
    tone: "#E9C98F",
    zoom: 7,
    story: [
      "Dans la vallée du M'zab, cinq ksour fondés entre le XIᵉ et le XIVᵉ siècle par la communauté ibadite forment un modèle d'urbanisme saharien : Ghardaïa, Melika, Beni Isguen, Bou Noura et El Atteuf. La vallée est inscrite au patrimoine mondial de l'UNESCO depuis 1982.",
      "Ici, le tapis est un langage. Laine tondue, filée, teinte puis nouée ou tissée, il porte des losanges et des lignes héritées de générations de tisseuses.",
    ],
    crafts: [
      { name: "Tapis du M'zab", description: "Laine nouée ou tissée, motifs géométriques et teintes chaudes." },
      { name: "Maroquinerie et cuir", description: "Babouches, sacs et objets de cuir travaillés dans les ateliers de la vallée." },
    ],
    hubs: [
      { name: "Ghardaïa", lon: 3.67, lat: 32.49 },
      { name: "Beni Isguen", lon: 3.72, lat: 32.46 },
    ],
    polygon: [[-1.7, 33.6], [2.0, 33.9], [5.9, 34.3], [7.8, 34.2], [8.2, 33.3], [9.1, 32.4], [9.5, 30.3], [2.0, 29.5], [-1.85, 32.0]],
  },
  {
    id: "sahara-hoggar",
    name: "Sahara & Hoggar",
    tagline: "Terres touarègues, Tassili et orfèvrerie du désert",
    tone: "#D4B27A",
    zoom: 11,
    story: [
      "Le grand Sud algérien couvre près de 80 % du territoire. Au cœur du Hoggar, le massif de l'Atakor domine Tamanrasset ; à l'est, le Tassili n'Ajjer garde des milliers de peintures et gravures rupestres.",
      "Le peuple touareg y a développé une orfèvrerie d'argent, un travail du cuir et une tradition de tissage de la tente adaptés à la vie nomade.",
    ],
    crafts: [
      { name: "Orfèvrerie touarègue", description: "Croix, bracelets et bagues en argent, ciselés à la main." },
      { name: "Maroquinerie nomade", description: "Sacoches, coussins et étuis de cuir aux motifs découpés." },
    ],
    hubs: [
      { name: "Tamanrasset", lon: 5.52, lat: 22.79 },
      { name: "Djanet", lon: 9.48, lat: 24.55 },
    ],
    polygon: [[-1.85, 32.0], [-3.6, 30.9], [-8.7, 28.7], [-8.67, 27.3], [-4.8, 25.0], [-2.0, 22.7], [1.2, 21.0], [3.2, 19.6], [4.25, 19.15], [8.0, 21.3], [11.9, 23.5], [9.4, 26.0], [9.8, 29.2], [9.5, 30.3], [2.0, 29.5]],
  },
];

/* Prix et visuels : données d'exemple à remplacer. */
export const PRODUCTS: Product[] = [
  { slug: "tapis-ghardaia", name: "Tapis de Ghardaïa", regionId: "mzab", origin: "Ghardaïa, M'zab", craft: "Tissage de laine", price: "680 €", teaser: "Six semaines de travail, des losanges que chaque tisseuse lit comme une phrase.", image: "/Tapis-ghardÏa.jpg" },
  { slug: "fibule-ath-yenni", name: "Fibule en argent et émail", regionId: "kabylie", origin: "Ath Yenni, Tizi-Ouzou", craft: "Bijouterie émaillée", price: "240 €", teaser: "Argent ciselé, émail vert et bleu, corail : la parure kabyle par excellence.", image: "/Bijoux-ath-yenni.jpg" },
  { slug: "huile-kabylie", name: "Huile d'olive de Kabylie", regionId: "kabylie", origin: "Tizi-Ouzou, Kabylie", craft: "Oléiculture", price: "32 €", teaser: "Pressée à froid dans les oliveraies du Djurdjura.", gradient: ["#C9A24B", "#6B6B2A"], image: "/huiles-et-olives.jpg" },
  { slug: "plateau-constantine", name: "Plateau en cuivre martelé", regionId: "constantinois", origin: "Constantine", craft: "Dinanderie", price: "310 €", teaser: "Martelé puis gravé, un éclat de cuivre venu de la ville des ponts.", gradient: ["#B5542F", "#5B2412"], },
  { slug: "karakou-alger", name: "Veste karakou", regionId: "algerois", origin: "Alger, Algérois", craft: "Broderie au fil d'or", price: "1 150 €", teaser: "Velours nuit et fils d'or, brodés à la main dans les ateliers de la Casbah.", gradient: ["#3A1F2E", "#B5542F"], image: "/karakou-algerien.jpg" },
  { slug: "croix-touareg", name: "Croix touarègue en argent", regionId: "sahara-hoggar", origin: "Tamanrasset, Hoggar", craft: "Orfèvrerie touarègue", price: "420 €", teaser: "Un signe d'orientation dans le désert, ciselé dans l'argent.", gradient: ["#D4B27A", "#8C5A2B"], image: "/Touareg-bijoux.jpg" },
  { slug: "poterie-kabyle", name: "Jarre de poterie kabyle", regionId: "kabylie", origin: "Maâtkas, Kabylie", craft: "Poterie modelée", price: "190 €", teaser: "Modelée au colombin par les femmes, cuite à feu ouvert.", gradient: ["#B5542F", "#E0C896"], image: "/Poterie-kabyle.jpg"  },
];

/* ---------------- Demande d'acquisition (sans panier) ---------------- */
export const CONTACT_EMAIL = "contact@votre-domaine.dz"; // à remplacer
export const WHATSAPP_NUMBER = "213000000000"; // format international sans « + »

export function requestMailto(p: Product): string {
  const subject = `Demande d'acquisition : ${p.name}`;
  const body = `Bonjour,\n\nJe souhaite acquérir la pièce « ${p.name} » (${p.origin}).\n\nNom :\nPays de livraison :\nQuantité : 1\n\nMerci de m'indiquer la disponibilité, les frais de livraison et les modalités de règlement.`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function whatsappLink(p: Product): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour, je souhaite acquérir la pièce « ${p.name} » (${p.origin}).`)}`;
}
