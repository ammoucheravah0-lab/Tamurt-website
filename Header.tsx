"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logoImg from "./public/Logo.png";
import { BRAND, CONTACT, NAV_LINKS } from "./site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Fond transparent sur le hero, plein dès que l'on défile
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile : scroll bloqué, Échap pour fermer, fermeture au passage en desktop
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "bg-nuit/90 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md" : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            {/* Utilisation du composant Image de Next.js */}
            <Image
              src={logoImg}
              alt={`Logo ${BRAND.name}`}
              width={solid ? 42 : 50}
              height={solid ? 42 : 50}
              className="rounded-full object-cover transition-all duration-500"
            />
            <span className="leading-none">
              <span className="block font-serif text-2xl font-semibold tracking-wide text-chaux">{BRAND.name}</span>
              <span className="mt-1 hidden text-xs text-or md:block">{BRAND.tagline}</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((l) =>
              l.label === "Contact" ? (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-or px-5 py-2 text-sm font-medium text-or transition hover:bg-or hover:text-nuit"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group relative py-1 text-[15px] text-sable transition hover:text-or"
                >
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-or transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              )
            )}
          </nav>

          {/* Bouton burger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="relative h-11 w-11 rounded-full border border-or/60 md:hidden"
          >
            <span className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-sable transition duration-300 ${open ? "rotate-45" : "-translate-y-[6px]"}`} />
            <span className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-sable transition duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-sable transition duration-300 ${open ? "-rotate-45" : "translate-y-[6px]"}`} />
          </button>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-nuit px-8 transition-[opacity,visibility] duration-500 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menu mobile" className="flex flex-col gap-7">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              className={`font-serif text-5xl font-medium text-chaux transition duration-500 hover:text-or ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-14 border-t border-or/30 pt-6 text-sm text-sable/80">
          <a href={`mailto:${CONTACT.email}`} className="block py-1 hover:text-or">{CONTACT.email}</a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="block py-1 hover:text-or">WhatsApp</a>
        </div>
      </div>
    </>
  );
}