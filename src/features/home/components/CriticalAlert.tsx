"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  active: boolean;
  source: string;
}

const severityConfig = {
  INFO: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-200",
    badge: "bg-emerald-500",
    icon: "check_circle",
    label: "Sistema Estable",
  },
  WARNING: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
    badge: "bg-amber-500",
    icon: "warning",
    label: "Atención",
  },
  CRITICAL: {
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    badge: "bg-red-500 animate-pulse",
    icon: "error",
    label: "Alerta Crítica",
  },
};

export const CriticalAlert = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/v1/alerts?active=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(() => {});
  }, []);

  // Rotate through alerts every 5 seconds
  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  const alert = alerts[currentIndex];
  const config = severityConfig[alert.severity] || severityConfig.INFO;

  return (
    <section className={`w-full border-b ${config.border} ${config.bg} px-4 py-2.5 transition-colors duration-500`}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.badge} text-white shadow-sm`}>
            <span className="material-symbols-outlined text-lg">{config.icon}</span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-bold tracking-tight uppercase ${config.text}`}>
                {config.label}
              </h4>
              <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase dark:bg-white/10">
                {alert.source}
              </span>
              {alert.severity === "CRITICAL" && (
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
              )}
            </div>
            <p className="max-w-2xl text-xs font-medium text-black/70 dark:text-white/70">
              {alert.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {alerts.length > 1 && (
            <span className="text-xs text-black/40 dark:text-white/40">
              {currentIndex + 1}/{alerts.length}
            </span>
          )}
          <Link
            href="/security/alert_center"
            className="flex items-center gap-1 rounded-full bg-black/10 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
          >
            PANEL DE CONTROL
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
