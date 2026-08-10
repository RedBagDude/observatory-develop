"use client";

import Image from "next/image";

export const AboutSection = () => {
  return (
    <section className="bg-background-alt border-y border-gray-200 py-20 dark:border-zinc-800 dark:bg-zinc-900/50" id="quienes-somos">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          {/* Mapa estilizado */}
          <div className="order-2 flex-1 lg:order-1">
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-2xl dark:border-zinc-700">
              {/* Overlay oscuro sutil para estilizar */}
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-slate-900/20 via-transparent to-transparent mix-blend-multiply dark:mix-blend-overlay" />
              <Image
                src="/map.png"
                alt="Infraestructura Energética de Cuba"
                width={500}
                height={300}
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
              />
              {/* Pin marcador animado */}
              <div className="absolute top-[40%] left-[35%] z-20">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                  <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 shadow-lg">
                    <span className="text-[8px] font-bold text-white">★</span>
                  </span>
                </span>
              </div>
              {/* Etiqueta del pin */}
              <div className="absolute top-[38%] left-[38%] z-20 rounded-lg border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                MINEM · La Habana
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="order-1 flex flex-1 flex-col gap-6 lg:order-2">
            <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
              Institucional
            </span>
            <h2 className="text-3xl leading-tight font-black text-gray-900 md:text-5xl dark:text-white">
              ¿Quiénes Somos?
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              El <strong className="text-primary">Observatorio Cubano de Energía y Minas (OCEM)</strong> es el centro
              neurálgico para la recopilación, análisis y difusión de información técnica y estratégica.
            </p>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              Nuestra misión es proveer una visión integral del panorama minero-energético de la
              nación, facilitando el monitoreo de recursos, la planificación prospectiva y el
              soporte científico-tecnológico al Ministerio de Energía y Minas.
            </p>

            {/* Botones con jerarquía corregida */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 rounded-lg bg-red-600 px-8 py-3 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30 active:scale-[0.98]">
                <span className="material-symbols-outlined text-xl">description</span>
                Documentos Oficiales
              </button>
              <button className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-8 py-3 font-bold text-gray-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400">
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                Leer Más
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
