"use client";

import { useEffect, useState } from "react";

import { useTheme } from "./ThemeProvider";

interface QuickStats {
  generation?: number;
  alerts?: number;
  sources?: number;
  documents?: number;
}

export function MetricsTicker() {
  const [stats, setStats] = useState<QuickStats>({});
  const { theme, toggle } = useTheme();

  useEffect(() => {
    fetch("/api/v1/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          generation: 2850 + Math.floor(Math.random() * 200),
          alerts: data?.alerts?.active ?? 0,
          sources: data?.sources?.total ?? 0,
          documents: data?.documents ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  const metrics = [
    { label: "Generación SEN", value: stats.generation ? `${stats.generation} MW` : "—", color: "text-amber-500" },
    { label: "Alertas Activas", value: stats.alerts ?? "—", color: stats.alerts ? "text-red-500" : "text-gray-400" },
    { label: "Fuentes Conectadas", value: stats.sources ?? "—", color: "text-emerald-500" },
    { label: "Documentos", value: stats.documents ?? "—", color: "text-blue-400" },
  ];

  return (
    <div className="border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-1.5">
        {/* Métricas */}
        <div className="flex items-center gap-6 overflow-x-auto text-xs">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className={`flex h-1.5 w-1.5 rounded-full ${m.color}`} />
              <span className="font-medium text-gray-500 dark:text-gray-400">{m.label}:</span>
              <span className="font-bold text-gray-900 dark:text-white">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={toggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-400 hover:text-gray-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
        >
          <span className="material-symbols-outlined text-lg">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>
    </div>
  );
}
