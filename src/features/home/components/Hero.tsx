"use client";

import { useState } from "react";

const quickTags = [
  { label: "SEN", query: "Sistema Eléctrico Nacional" },
  { label: "Ley de Minas", query: "Ley de Minas Reglamento" },
  { label: "Energía Solar", query: "solar fotovoltaica" },
  { label: "Níquel", query: "níquel Moa" },
  { label: "Eólica", query: "potencial eólico" },
  { label: "Plan 2026", query: "proyecciones 2026" },
];

export const Hero = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    window.location.href = `/modules/smart_search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <section className="relative w-full">
      <div
        className="relative flex min-h-[540px] w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.5)), url('/wind_farm.png')`,
        }}
      >
        {/* Textura sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]" />

        <div className="relative z-10 flex max-w-[1000px] flex-col gap-6 text-center">
          <div className="mb-2 inline-flex items-center self-center gap-1.5 rounded-full bg-red-600/90 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-red-900/20 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            HUB CENTRAL DE DATOS
          </div>

          <h1
            className="text-4xl leading-tight font-extrabold text-white md:text-5xl lg:text-7xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)" }}
          >
            Observatorio Cubano de <br />
            <span className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)]">
              ENERGÍA Y MINAS
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-200 md:text-xl">
            Plataforma estratégica para la soberanía energética y el desarrollo minero sostenible.
            Información en tiempo real para la toma de decisiones.
          </p>

          {/* Search bar */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
              className="group relative w-full max-w-lg"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 w-full rounded-full border-none bg-white/95 pr-6 pl-14 text-base text-black shadow-2xl transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Buscador inteligente de recursos..."
              />
              <span className="material-symbols-outlined absolute top-1/2 left-5 -translate-y-1/2 text-[28px] text-gray-400 transition-colors group-focus-within:text-red-500">
                search
              </span>
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
              >
                Buscar
              </button>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-gray-400">Búsquedas rápidas:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => handleSearch(tag.query)}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition-all hover:border-red-400/50 hover:bg-red-500/20 hover:text-white"
                >
                  #{tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
