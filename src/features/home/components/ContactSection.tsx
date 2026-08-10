"use client";

import { useState } from "react";
import Link from "next/link";

export const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const validateEmail = (email: string) => {
    if (!email) { setEmailValid(null); return; }
    setEmailValid(email.endsWith(".cu") || email.endsWith(".gob.cu"));
  };

  const charsLeft = 500 - form.message.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setEmailValid(null);
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "email") validateEmail(value);
  };

  return (
    <section className="bg-white py-24 dark:bg-zinc-950" id="contacto">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-16 lg:flex-row">
          {/* FORMULARIO */}
          <div className="lg:w-2/3">
            <div className="mb-10">
              <h2 className="border-primary mb-4 border-l-4 pl-4 text-3xl font-black text-gray-900 md:text-4xl dark:text-white">
                Contacte con Nosotros
              </h2>
              <p className="ml-5 text-gray-600 dark:text-gray-400">
                Utilice el siguiente formulario para enviarnos sus consultas técnicas, solicitudes
                de información o reportes institucionales.
              </p>
            </div>

            <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="fullName">
                  Nombre Completo
                </label>
                <input
                  className={`w-full rounded-lg border bg-gray-50/50 px-4 py-3 transition-all outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                    form.name.length > 0
                      ? "border-emerald-300 focus:ring-emerald-500/50"
                      : "border-gray-200 focus:border-red-400 focus:ring-red-500/30 dark:border-zinc-700"
                  }`}
                  id="fullName"
                  placeholder="Ej. Juan Pérez García"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="email">
                  Correo Institucional
                </label>
                <input
                  className={`w-full rounded-lg border bg-gray-50/50 px-4 py-3 transition-all outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                    emailValid === true
                      ? "border-emerald-300 focus:ring-emerald-500/50"
                      : emailValid === false
                        ? "border-amber-300 focus:ring-amber-500/50"
                        : "border-gray-200 focus:border-red-400 focus:ring-red-500/30 dark:border-zinc-700"
                  }`}
                  id="email"
                  placeholder="usuario@dominio.cu"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
                {emailValid === false && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Se recomienda correo institucional (.cu / .gob.cu)
                  </p>
                )}
                {emailValid === true && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    ✓ Correo institucional válido
                  </p>
                )}
              </div>

              {/* Asunto */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="ml-1 text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="subject">
                  Asunto
                </label>
                <input
                  className={`w-full rounded-lg border bg-gray-50/50 px-4 py-3 transition-all outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                    form.subject.length > 0
                      ? "border-emerald-300 focus:ring-emerald-500/50"
                      : "border-gray-200 focus:border-red-400 focus:ring-red-500/30 dark:border-zinc-700"
                  }`}
                  id="subject"
                  placeholder="Motivo de su mensaje"
                  type="text"
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  required
                />
              </div>

              {/* Mensaje */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="ml-1 text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="message">
                    Mensaje
                  </label>
                  <span className={`text-xs ${charsLeft < 50 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                    {charsLeft} caracteres
                  </span>
                </div>
                <textarea
                  className={`min-h-[160px] w-full resize-none rounded-lg border bg-gray-50/50 px-4 py-3 transition-all outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                    form.message.length > 10
                      ? "border-emerald-300 focus:ring-emerald-500/50"
                      : "border-gray-200 focus:border-red-400 focus:ring-red-500/30 dark:border-zinc-700"
                  }`}
                  id="message"
                  placeholder="Escriba aquí los detalles de su consulta..."
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <div className="mt-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "success"}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-10 py-4 font-bold text-white shadow-lg transition-all md:w-auto ${
                    status === "success"
                      ? "bg-emerald-500"
                      : status === "error"
                        ? "bg-red-500"
                        : "bg-red-600 hover:bg-red-700 hover:shadow-xl active:scale-[0.98]"
                  }`}
                >
                  {status === "sending" ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enviando...
                    </>
                  ) : status === "success" ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      ¡Mensaje Enviado!
                    </>
                  ) : status === "error" ? (
                    <>
                      <span className="material-symbols-outlined">error</span>
                      Error — Reintentar
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined !text-[20px]">send</span>
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* INFO DE CONTACTO */}
          <div className="lg:w-1/3">
            <div className="h-full rounded-2xl border border-gray-100 bg-gray-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <span className="material-symbols-outlined text-primary">info</span>
                Información de Contacto
              </h3>

              <div className="flex flex-col gap-8">
                {/* Dirección */}
                <div className="flex gap-4">
                  <div className="text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-colors hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold tracking-wide text-gray-900 uppercase dark:text-white">
                      Dirección Física
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      Avenida Salvador Allende No. 666, Plaza de la Revolución, La Habana, Cuba.
                    </p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex gap-4">
                  <div className="text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-colors hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold tracking-wide text-gray-900 uppercase dark:text-white">
                      Atención Telefónica
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      (+53) 7 877 5000
                      <br />
                      Lunes - Viernes: 8:00 AM - 4:30 PM
                    </p>
                  </div>
                </div>

                {/* Digital */}
                <div className="flex gap-4">
                  <div className="text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-colors hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold tracking-wide text-gray-900 uppercase dark:text-white">
                      Canales Digitales
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      contacto@ocem.minem.gob.cu
                    </p>
                    <div className="flex gap-3">
                      {["language", "share", "rss_feed"].map((icon) => (
                        <Link
                          key={icon}
                          href="/"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-400"
                        >
                          <span className="material-symbols-outlined !text-[18px]">{icon}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cita institucional */}
              <div className="mt-12 border-t border-gray-200 pt-8 dark:border-zinc-800">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-5 text-white shadow-lg">
                  {/* Marca de agua de comillas */}
                  <span className="absolute -top-4 -left-2 text-[80px] leading-none font-serif text-white/10 select-none">&ldquo;</span>
                  <p className="relative z-10 text-sm leading-relaxed font-medium italic">
                    Comprometidos con la transparencia y el acceso a la información estratégica del sector energético cubano.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/20" />
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">OCEM · MINEM</span>
                    <div className="h-px flex-1 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
