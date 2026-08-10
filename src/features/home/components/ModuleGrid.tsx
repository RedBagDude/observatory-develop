"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const modules = [
  {
    title: "Buscador Inteligente",
    icon: "travel_explore",
    description: "Localización avanzada de documentación técnica y datos históricos mediante IA.",
    href: "/modules/smart_search",
    color: "blue",
    liveLabel: "RAG Activo",
  },
  {
    title: "Geoportal de Cuba",
    icon: "map",
    description: "Visualización espacial de la infraestructura energética y recursos minerales.",
    href: "/modules/national_geoportal",
    color: "emerald",
    liveLabel: "12 Capas Activas",
  },
  {
    title: "Estadísticas",
    icon: "analytics",
    description: "Dashboards interactivos y visualización de indicadores clave del sector.",
    href: "/modules/sector_statistics",
    color: "violet",
    liveLabel: "",
    liveData: true,
  },
  {
    title: "Boletines Temáticos",
    icon: "description",
    description: "Publicaciones periódicas sobre el estado y tendencias de la energía y minas.",
    href: "/modules/technical_bulletins",
    color: "slate",
    liveLabel: "",
  },
  {
    title: "Gestión IA",
    icon: "psychology",
    description: "Herramientas de predicción y modelado de datos mediante redes neuronales.",
    href: "/modules/ai_management",
    color: "purple",
    liveLabel: "Beta",
  },
  {
    title: "Alertas Críticas",
    icon: "notifications_active",
    description: "Monitoreo de umbrales críticos y gestión de contingencias en tiempo real.",
    href: "/security/alert_center",
    color: "red",
    isUrgent: true,
    liveLabel: "",
    liveData: true,
  },
  {
    title: "Registro de Fuentes",
    icon: "database",
    description: "Control y validación de las fuentes de datos primarias integradas al sistema.",
    href: "/security/user_registration",
    color: "cyan",
    liveLabel: "",
  },
  {
    title: "Administración",
    icon: "admin_panel_settings",
    description: "Configuración del sistema, roles de usuario y auditoría de seguridad.",
    href: "/security/technical_support",
    color: "zinc",
    liveLabel: "",
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string; gradient: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/20", gradient: "from-blue-500/10 to-transparent" },
  emerald:{ bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20", gradient: "from-emerald-500/10 to-transparent" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-500/20", gradient: "from-violet-500/10 to-transparent" },
  slate:  { bg: "bg-slate-50 dark:bg-slate-950/30", text: "text-slate-600 dark:text-slate-400", ring: "ring-slate-500/20", gradient: "from-slate-500/10 to-transparent" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", ring: "ring-purple-500/20", gradient: "from-purple-500/10 to-transparent" },
  red:    { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", ring: "ring-red-500/20", gradient: "from-red-500/10 to-transparent" },
  cyan:   { bg: "bg-cyan-50 dark:bg-cyan-950/30", text: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-500/20", gradient: "from-cyan-500/10 to-transparent" },
  zinc:   { bg: "bg-zinc-50 dark:bg-zinc-900/30", text: "text-zinc-600 dark:text-zinc-400", ring: "ring-zinc-500/20", gradient: "from-zinc-500/10 to-transparent" },
};

export const ModuleGrid = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Fetch stats to get a sense of "liveness"
    fetch("/api/v1/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setLastUpdated(new Date().toLocaleTimeString("es-CU", { hour: "2-digit", minute: "2-digit" }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="flex grow flex-col bg-white py-16 dark:bg-zinc-950" id="modulos">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col px-6">
        <div className="flex flex-col gap-3 pb-12 text-center md:text-left">
          <div className="flex items-center gap-3">
            <h2 className="border-primary border-l-4 pl-4 text-3xl font-black text-gray-900 md:text-4xl dark:text-white">
              Módulos Estratégicos y Operativos
            </h2>
            {lastUpdated && (
              <span className="mt-1 flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Actualizado {lastUpdated}
              </span>
            )}
          </div>
          <p className="ml-5 max-w-2xl text-gray-500 dark:text-gray-400">
            Acceda de forma segura a las herramientas de análisis, monitoreo y gestión del sector minero-energético nacional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((item) => {
            const colors = colorMap[item.color] || colorMap.slate;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  item.isUrgent
                    ? "border-red-200 bg-red-50/80 hover:border-red-300 hover:shadow-red-500/10 dark:border-red-900/50 dark:bg-red-950/30"
                    : `border-gray-100 bg-gray-50/80 hover:border-gray-200 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900`
                }`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                {/* Top accent border on hover */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-${item.color}-500 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100`} />

                {/* Status badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {item.liveData && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {item.liveLabel && !item.liveData && (
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-white/10 dark:text-gray-400">
                      {item.liveLabel}
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${
                      item.isUrgent
                        ? "bg-red-500 text-white"
                        : `${colors.bg} ${colors.text} ring-1 ${colors.ring}`
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                </div>

                {/* Text */}
                <div className="relative z-10">
                  <h3 className={`mb-2 text-lg font-bold ${item.isUrgent ? "text-red-700 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${item.isUrgent ? "text-red-700/70 dark:text-red-400/70" : "text-gray-600 dark:text-gray-400"}`}>
                    {item.description}
                  </p>
                </div>

                {/* Hover arrow */}
                <div className="relative z-10 mt-auto flex items-center gap-1 text-xs font-semibold text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-red-500">
                  Acceder
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
