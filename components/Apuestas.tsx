"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { contenido } from "@/app/content";
import { supabase } from "@/lib/supabase";
import { Corona } from "./Gatos";
import { Envelope, Paw } from "./icons";

export function Apuestas() {
  const a = contenido.apuestas;
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [apuesta, setApuesta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok">("idle");
  const [error, setError] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !apuesta.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setEstado("enviando");

    const { error: dbError } = await supabase.from("apuestas").insert({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      apuesta: apuesta.trim(),
      mensaje: mensaje.trim() || null,
    });

    if (dbError) {
      console.error(dbError);
      setEstado("idle");
      return;
    }

    setEstado("ok");
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#e88ca0", "#6e9bd1", "#c2a054", "#fff"],
    });
  };

  const reset = () => {
    setNombre("");
    setApellido("");
    setApuesta("");
    setMensaje("");
    setEstado("idle");
  };

  return (
    <section id="apuestas" className="px-4 py-6">
      <div className="mx-auto max-w-lg rounded-[1.8rem] border border-gold/25 bg-panel p-5 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Paw className="h-3.5 w-3.5 text-gold" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-ink/80">{a.titulo}</h2>
          <Paw className="h-3.5 w-3.5 text-gold" />
        </div>
        <p className="mt-3 text-center font-display text-[1.7rem] font-semibold text-ink">{a.pregunta}</p>
        <p className="mt-1 text-center text-[12px] text-ink/70">{a.sub}</p>

        {estado === "ok" ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-gold/50 bg-[#fdfbf3] px-6 py-8 text-center">
            <Corona className="relative text-gold" />
            <p className="mt-3 font-display text-3xl font-semibold text-ink">{a.exitoTitulo}</p>
            <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-ink/75">{a.exitoTexto(nombre, apuesta)}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full border border-gold/70 px-5 py-2 font-display text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold/10"
            >
              {a.exitoBoton}
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                  {a.labelNombre}
                </span>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder={a.placeholderNombre}
                  className="w-full rounded-xl border border-gold/40 bg-[#fdfbf3] px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                  {a.labelApellido}
                </span>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder={a.placeholderApellido}
                  className="w-full rounded-xl border border-gold/40 bg-[#fdfbf3] px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                {a.labelApuesta}
              </span>
              <input
                type="text"
                maxLength={60}
                value={apuesta}
                onChange={(e) => setApuesta(e.target.value)}
                placeholder={a.placeholderApuesta}
                className="w-full rounded-xl border border-gold/40 bg-[#fdfbf3] px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                {a.mensajeLabel}
              </span>
              <textarea
                rows={3}
                maxLength={150}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder={a.mensajePlaceholder}
                className="w-full resize-none rounded-xl border border-gold/40 bg-[#fdfbf3] px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
              <span className="mt-0.5 block text-right text-[10px] text-ink/40">{mensaje.length}/150</span>
            </label>

            {error && <p className="text-center text-[11px] font-semibold text-rose">{a.error}</p>}

            <button
              type="submit"
              disabled={estado === "enviando"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[11px] font-bold uppercase tracking-[0.28em] text-cream transition-all hover:bg-black/85 disabled:opacity-60"
            >
              {estado === "enviando" ? (
                <span className="min-w-[220px]">Maullando…</span>
              ) : (
                <>
                  <Envelope className="h-4 w-4 text-goldsoft" />
                  {a.enviar}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
