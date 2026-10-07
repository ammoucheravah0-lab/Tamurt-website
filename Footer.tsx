import Link from "next/link";
import Image from "next/image";
import logoImg from "./public/Logo.png"; // ou depuis /public directement avec une string
import { REGIONS } from "./regions";
import { BRAND, CONTACT, FOUNDER, LEGAL_LINKS, NAV_LINKS, SOCIALS } from "./site";

const PAGES = [
  ...NAV_LINKS.filter((l) => l.label !== "Contact"),
  { label: "Artisanat à découvrir", href: "/#artisanat" },
  { label: "Journal", href: "/journal" },
  { label: "À propos", href: "/a-propos" },
];

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-16 bg-nuit text-sable">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 md:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Marque */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <div className="relative h-18 w-18 overflow-hidden rounded-full shrink-0">
                <Image
                  src={logoImg}
                  alt={`Logo ${logoImg}`}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-3xl font-semibold text-chaux">{BRAND.name}</p>
                <p className="text-sm text-or">{BRAND.tagline}</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm leading-relaxed text-sable/75">
              Une galerie-musée où chaque pièce garde le nom de sa terre. Nous travaillons avec des artisans de plusieurs régions d'Algérie, et chaque demande reçoit une réponse personnelle.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-or/40 px-4 py-1.5 text-sm transition hover:border-or hover:text-or"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <nav aria-label="Pages du site" className="lg:col-span-2">
            <h3 className="font-serif text-xl text-or">Pages</h3>
            <ul className="mt-4 space-y-2.5">
              {PAGES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-or">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Régions */}
          <nav aria-label="Régions" className="lg:col-span-2">
            <h3 className="font-serif text-xl text-or">Régions</h3>
            <ul className="mt-4 space-y-2.5">
              {REGIONS.map((r) => (
                <li key={r.id}>
                  <Link href={`/regions/${r.id}`} className="transition hover:text-or">{r.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-xl text-or">Contact</h3>
            <address className="mt-4 space-y-2.5 not-italic">
              <p><a href={`mailto:${CONTACT.email}`} className="transition hover:text-or">{CONTACT.email}</a></p>
              <p><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="transition hover:text-or">{CONTACT.phone}</a></p>
              <p><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="transition hover:text-or">Écrire sur WhatsApp</a></p>
              <p className="text-sable/75">{CONTACT.address}</p>
              <p className="text-sable/75">{CONTACT.hours}</p>
            </address>
            <p className="mt-5 text-sm text-sable/60">
              Nous répondons sous 24 h. Paiement et livraison sont convenus ensemble.
            </p>
          </div>
        </div>

        {/* Fondateur */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-[2rem] border border-or/30 bg-oasis/40 p-6 sm:flex-row sm:items-center md:p-8">
          <div className="relative h-26 w-26 overflow-hidden rounded-full shrink-0">
            <Image
              src={FOUNDER.photo}
              alt={`Portrait de ${FOUNDER.name}`}
              width={104}
              height={104}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold text-chaux">{FOUNDER.name}</p>
            <p className="text-sm text-or">{FOUNDER.role}</p>
            <p className="mt-3 max-w-2xl font-serif text-xl italic leading-snug text-sable">{FOUNDER.word}</p>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-12 flex flex-col gap-4 border-t border-sable/15 pt-6 text-sm text-sable/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-or">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}