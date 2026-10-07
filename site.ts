import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "./regions";

/* Tout ce qui est marqué « à remplacer » est un exemple. */
export const BRAND = {
  name: "Tamurt", // à remplacer par votre nom de marque
  tagline: "Artisanat et mémoire d'Algérie",
  logo: "/images/logo.svg", // remplacez par /images/logo.png (votre logo)
  initials: "T",
};

export const NAV_LINKS = [
  { label: "Histoire", href: "/#intro" },
  { label: "Culture", href: "/#carte" },
  { label: "Produits & articles", href: "/#pieces" },
  { label: "Contact", href: "/#contact" },
];

export const CONTACT = {
  email: CONTACT_EMAIL,
  phone: "+33 7 52 08 11 44",
  whatsapp: `https://wa.me/${+33699503776}`,
  address: "Adresse de l'atelier, Ville, Algérie",
  hours: "Du lundi au samedi, 9 h à 18 h",
};

export const FOUNDER = {
  name: "Farid Belhanafi",
  role: "Fondateur",
  photo: "/images/founder.jpg", // déposez la photo dans public/images/
  initials: "FB",
  word: "Je voulais que chaque pièce garde le nom de sa terre et le visage de la main qui l'a faite.",
};

export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Facebook", href: "https://facebook.com/" },
  { label: "TikTok", href: "https://tiktok.com/" },
];

export const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Livraison et retours", href: "/livraison-retours" },
  { label: "Conditions générales", href: "/cgv" },
  { label: "Confidentialité", href: "/confidentialite" },
];
