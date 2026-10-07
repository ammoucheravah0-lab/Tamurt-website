"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./Header";
import Footer from "./Footer";
import RegionDrawer from "./RegionDrawer";
import { PRODUCTS, REGIONS, requestMailto, whatsappLink, type Product } from "./regions";

// Photo du désert importée pour l'optimisation Next.js
import desertBg from "./public/Desert-Algerie.jpg"; // Assure-toi que l'extension est correcte (.jpg, .png, etc.)

// Three.js n'est chargé que côté client, quand la section approche
const AlgeriaMap3D = dynamic(() => import("./AlgeriaMap3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-serif text-xl italic text-sable/70">
      La carte se déploie…
    </div>
  ),
});

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const INTRO =
  "Ici, chaque objet a un visage, un village et une main. Un tapis n'est pas seulement un tapis : c'est la mémoire du M'zab. Une huile n'est pas seulement une huile : c'est la lumière d'une colline kabyle. Avant d'acquérir une pièce, venez rencontrer la terre qui l'a vue naître.";

// Mise en page asymétrique : largeur, décalage vertical et ratio de chaque carte
const LAYOUT = [
  "md:col-span-7 aspect-[4/5]",
  "md:col-span-5 md:mt-24 aspect-square",
  "md:col-span-5 aspect-square",
  "md:col-span-7 md:mt-16 aspect-[4/3]",
  "md:col-span-4 aspect-[3/4]",
  "md:col-span-4 md:mt-14 aspect-[3/4]",
  "md:col-span-4 aspect-[3/4]",
];

const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 4 44 24 24 44 4 24Z M24 14 34 24 24 34 14 24Z' fill='none' stroke='%23FBF8F2' stroke-opacity='0.14' stroke-width='1'/%3E%3C/svg%3E\")";

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = REGIONS.find((r) => r.id === selectedId) ?? null;

  useIsoLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;

      // Un seul moment orchestré à l'arrivée : le titre se lève ligne par ligne
      gsap.from(".hero-line", { yPercent: 110, duration: 1.3, ease: "power4.out", stagger: 0.2, delay: 0.2 });
      gsap.from(".hero-sub", { opacity: 0, duration: 1.2, delay: 1.1 });

      // Les dunes et l'image de fond défilent à des vitesses différentes
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.speed),
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
        });
      });

      // Le texte d'intro s'éclaire mot à mot avec le scroll
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "#intro", start: "top 70%", end: "bottom 55%", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const goToMap = () => document.getElementById("carte")?.scrollIntoView({ behavior: "smooth" });
  const openRegionFromProduct = (regionId: string) => {
    setSelectedId(regionId);
    goToMap();
  };

  const craftCount = new Set(REGIONS.flatMap((r) => r.crafts.map((c) => c.name))).size;

  return (
    <div ref={root} className="w-full relative">
      {/* Header global */}
      <Header />

      {/* ============================ HERO ============================ */}
      <section id="hero" className="w-full relative h-screen min-h-[640px] overflow-hidden bg-nuit text-chaux">
        <div className="absolute inset-0 bg-gradient-to-b from-nuit via-[#4A1E10] to-ocre" />
        <div
          className="absolute left-1/2 top-[52%] h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full animate-breathe"
          style={{ background: "radial-gradient(circle, rgba(201,162,75,0.75) 0%, rgba(200,135,58,0.25) 45%, transparent 70%)" }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: PATTERN }} aria-hidden />

        <svg data-speed="8" className="absolute bottom-0 left-0 h-[46%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
          <path d="M0 240 C240 120 420 300 720 200 C1000 110 1200 260 1440 170 V400 H0Z" fill="#B5542F" opacity="0.85" />
        </svg>
        <svg data-speed="16" className="absolute bottom-0 left-0 h-[32%] w-full" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden>
          <path d="M0 160 C300 60 520 230 820 140 C1060 70 1260 190 1440 120 V300 H0Z" fill="#C8873A" />
        </svg>
        <svg data-speed="26" className="absolute bottom-0 left-0 h-[18%] w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
          <path d="M0 110 C260 30 520 150 860 80 C1100 30 1280 110 1440 70 V200 H0Z" fill="#F3E6CF" />
        </svg>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center pt-20">
          
          {/* ================= BLOC TITRE AVEC PHOTO DU DÉSERT ================= */}
          {/* Conteneur plein écran relatif pour le titre et son fond */}
          <div className="relative w-full overflow-hidden py-16 my-4 flex justify-center items-center rounded-3xl shadow-2xl">
            
            {/* Image de fond optimisée avec effet de parallaxe doux */}
            <div data-speed="4" className="absolute inset-0 h-[120%] w-full -top-[10%]">
              <Image
                src={ desertBg }
                alt="Splendeur du désert algérien, tadrart rouge"
                fill
                priority
                className="object-cover object-center pointer-events-none"
                sizes="100vw"
              />
              {/* Superposition pour la lisibilité : dégradé sombre + motif */}
              <div className="absolute inset-0 bg-gradient-to-b from-nuit/80 via-nuit/40 to-ocre/60" />
              <div className="absolute inset-0Opacity-20" style={{ backgroundImage: PATTERN }} aria-hidden />
            </div>

            {/* Titre positionné au-dessus avec un z-index supérieur */}
            <h1 className="relative z-10 font-serif text-5xl font-semibold leading-[1.05] sm:text-7xl md:text-8xl text-chaux mix-blend-lighten">
              {["L'Algérie se tisse,", "se forge,", "se transmet."].map((line) => (
                <span key={line} className="block overflow-hidden pb-2">
                  <span className="hero-line block">{line}</span>
                </span>
              ))}
            </h1>
          </div>

          <p className="hero-sub mt-6 max-w-xl text-lg text-sable/90">
            Une galerie-musée où chaque pièce garde le nom de sa terre et la main qui l'a faite.
          </p>
          <button
            onClick={goToMap}
            className="hero-sub mt-10 flex flex-col items-center gap-2 font-serif text-xl italic text-or"
          >
            Explorer la carte
            <svg className="animate-nudge" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ============================ INTRO ============================ */}
      <section id="intro" className="w-full bg-sable px-6 py-32 md:py-44">
        <div className="mx-auto max-w-4xl">
          <p className="font-serif text-3xl font-medium leading-[1.3] text-oasis md:text-5xl">
            {INTRO.split(" ").map((w, i) => (
              <span key={i} className="intro-word mr-[0.25em] inline-block">
                {w}
              </span>
            ))}
          </p>
          <dl className="mt-16 flex flex-wrap gap-x-14 gap-y-6 border-t border-ocre/40 pt-8">
            {[
              [REGIONS.length, "régions culturelles"],
              [craftCount, "savoir-faire"],
              [PRODUCTS.length, "pièces à acquérir"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="font-serif text-5xl font-semibold text-terracotta">{n}</dt>
                <dd className="text-sm text-nuit/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ========================== CARTE 3D ========================== */}
      <section
        id="carte"
        className="w-full relative h-[100svh] min-h-[640px] overflow-hidden bg-gradient-to-b from-nuit via-[#2A130C] to-[#4A1E10]"
      >
        <div className="pointer-events-none absolute left-0 top-0 z-10 max-w-xl p-6 md:p-12">
          <h2 className="font-serif text-4xl font-semibold leading-tight text-chaux md:text-6xl">
            Choisissez une terre, découvrez ses mains.
          </h2>
        </div>

        <div className="absolute inset-0">
          <AlgeriaMap3D selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Liste de régions : accès clavier et alternative au survol */}
        <nav
          aria-label="Régions"
          className="absolute inset-x-0 bottom-4 z-10 flex gap-2 overflow-x-auto px-6 pb-1 md:bottom-8 md:max-w-[58%] md:flex-wrap md:overflow-visible md:px-12"
        >
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              aria-pressed={r.id === selectedId}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
                r.id === selectedId
                  ? "border-or bg-or text-nuit"
                  : "border-sable/30 text-sable hover:border-or hover:text-or"
              }`}
            >
              {r.name}
            </button>
          ))}
        </nav>

        <RegionDrawer region={selected} onClose={() => setSelectedId(null)} />
      </section>

      {/* ======================= PIÈCES CHOISIES ======================= */}
      <section id="pieces" className="w-full bg-chaux px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl font-serif text-5xl font-semibold leading-tight text-oasis md:text-7xl">
            Pièces choisies
          </h2>
          <p className="mt-4 max-w-xl text-lg text-nuit/70">
            Pas de panier : vous choisissez une pièce, nous vous répondons personnellement avec la disponibilité, la livraison et le règlement.
          </p>

          <div className="mt-16 grid grid-cols-1 items-start gap-x-8 gap-y-14 md:grid-cols-12">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.slug} product={p} layout={LAYOUT[i % LAYOUT.length]} onRegion={openRegionFromProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer global */}
      <Footer />
    </div>
  );
}

/* --------------------------- Carte produit --------------------------- */
function ProductCard({
  product: p,
  layout,
  onRegion,
}: {
  product: Product;
  layout: string;
  onRegion: (regionId: string) => void;
}) {
  return (
    <article className={`group ${layout.split(" ").filter((c) => c.startsWith("md:")).join(" ")}`}>
      <div
        className={`relative w-full overflow-hidden rounded-[2rem] ${layout.split(" ").filter((c) => c.startsWith("aspect")).join(" ")}`}
        style={{
          background: p.image
            ? `center/cover url(${p.image})`
            : p.gradient
              ? `linear-gradient(145deg, ${p.gradient[0]}, ${p.gradient[1]})`
              : "#E8D4AA",
        }}
      >
        {!p.image && <div className="absolute inset-0" style={{ backgroundImage: PATTERN }} aria-hidden />}

        {/* Étiquette dorée : relie la pièce à sa région sur la carte */}
        <button
          onClick={() => onRegion(p.regionId)}
          className="absolute left-4 top-4 rounded-full bg-or px-3.5 py-1.5 text-sm font-medium text-nuit shadow transition hover:bg-sable"
          title="Voir cette région sur la carte"
        >
          {p.origin}
        </button>

        {/* L'histoire apparaît au survol (toujours visible au toucher) */}
        <p className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-nuit/90 to-transparent p-6 pt-16 font-serif text-xl italic leading-snug text-chaux opacity-100 transition duration-500 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          {p.teaser}
        </p>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-serif text-3xl font-semibold text-nuit">{p.name}</h3>
          <p className="text-sm text-nuit/60">{p.craft}</p>
        </div>
        <span className="font-serif text-2xl text-terracotta">{p.price}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={requestMailto(p)}
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-chaux transition hover:bg-ocre"
        >
          Demander cette pièce
        </a>
        <a
          href={whatsappLink(p)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-oasis px-5 py-2.5 text-sm text-oasis transition hover:bg-oasis hover:text-chaux"
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
}