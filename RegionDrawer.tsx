"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRODUCTS, requestMailto, whatsappLink, type Region } from "./regions";

type TabId = "histoire" | "savoir-faire" | "pieces";
const TABS: { id: TabId; label: string }[] = [
  { id: "histoire", label: "Histoire" },
  { id: "savoir-faire", label: "Savoir-faire" },
  { id: "pieces", label: "Pièces" },
];

interface RegionDrawerProps {
  region: Region | null;
  onClose: () => void;
}

export default function RegionDrawer({ region, onClose }: RegionDrawerProps) {
  // On garde la dernière région affichée pendant l'animation de fermeture
  const [shown, setShown] = useState<Region | null>(region);
  const [tab, setTab] = useState<TabId>("histoire");
  const open = region !== null;

  useEffect(() => {
    if (region) {
      setShown(region);
      setTab("histoire");
    }
  }, [region]);

  const pieces = shown ? PRODUCTS.filter((p) => p.regionId === shown.id) : [];

  return (
    <aside
      aria-label={shown ? `Région ${shown.name}` : "Région"}
      aria-hidden={!open}
      className={`absolute z-20 flex flex-col bg-chaux text-nuit shadow-2xl transition-[transform,visibility] duration-700 ease-[cubic-bezier(.22,1,.36,1)]
        inset-x-0 bottom-0 h-[58%] rounded-t-3xl
        md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[40%] md:rounded-none
        ${open ? "visible translate-y-0 md:translate-x-0" : "invisible translate-y-full md:translate-y-0 md:translate-x-full"}`}
    >
      <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-ocre/40 md:hidden" />

      {shown && (
        <>
          <header className="relative shrink-0 border-b border-sable-deep px-6 pb-4 pt-4 md:px-9 md:pt-9">
            <button
              onClick={onClose}
              aria-label="Retour à la carte"
              className="absolute right-4 top-3 rounded-full px-3 py-1 text-sm text-terracotta transition hover:bg-sable md:right-7 md:top-7"
            >
              Retour à la carte
            </button>
            <h3 className="pr-36 font-serif text-3xl font-semibold leading-tight text-oasis md:text-5xl">
              {shown.name}
            </h3>
            <p className="mt-1 font-serif text-lg italic text-terracotta">{shown.tagline}</p>

            <div role="tablist" aria-label="Contenu de la région" className="mt-5 flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    tab === t.id ? "bg-oasis text-chaux" : "text-nuit/70 hover:bg-sable"
                  }`}
                >
                  {t.label}
                  {t.id === "pieces" && pieces.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-or px-1.5 text-xs text-nuit">{pieces.length}</span>
                  )}
                </button>
              ))}
            </div>
          </header>

          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            key={`${shown.id}-${tab}`}
            className="flex-1 overflow-y-auto px-6 py-6 md:px-9"
          >
            {tab === "histoire" && (
              <div className="space-y-4 font-serif text-xl leading-relaxed">
                {shown.story.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="pt-2 font-sans text-sm text-nuit/60">
                  Points dorés sur la carte : {shown.hubs.map((h) => h.name).join(", ")}.
                </p>
              </div>
            )}

            {tab === "savoir-faire" && (
              <ul className="space-y-5">
                {shown.crafts.map((c) => (
                  <li key={c.name} className="border-l-2 border-or pl-4">
                    <h4 className="font-serif text-2xl font-semibold text-terracotta">{c.name}</h4>
                    <p className="mt-1 leading-relaxed text-nuit/80">{c.description}</p>
                  </li>
                ))}
              </ul>
            )}

            {tab === "pieces" && (
              <div className="space-y-4">
                {pieces.length === 0 && (
                  <p className="leading-relaxed text-nuit/70">
                    Les pièces de cette région arrivent bientôt. Écrivez-nous pour être prévenu de leur ouverture.
                  </p>
                )}
                {pieces.map((p) => (
                  <article key={p.slug} className="overflow-hidden rounded-2xl border border-sable-deep">
                    <div
                      className="h-24"
                      style={{
                        background: p.image
                          ? `center/cover url(${p.image})`
                          : p.gradient
                            ? `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`
                            : "#E8D4AA",
                      }}
                    />
                    <div className="p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-serif text-2xl font-semibold">{p.name}</h4>
                        <span className="shrink-0 font-medium text-terracotta">{p.price}</span>
                      </div>
                      <p className="mt-1 text-sm text-nuit/70">{p.teaser}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={requestMailto(p)}
                          className="rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-chaux transition hover:bg-ocre"
                        >
                          Demander cette pièce
                        </a>
                        <a
                          href={whatsappLink(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-oasis px-4 py-2 text-sm text-oasis transition hover:bg-oasis hover:text-chaux"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <footer className="shrink-0 border-t border-sable-deep px-6 py-4 md:px-9">
            <Link href={`/regions/${shown.id}`} className="font-medium text-oasis underline-offset-4 hover:underline">
              Explorer toute la région
            </Link>
          </footer>
        </>
      )}
    </aside>
  );
}
