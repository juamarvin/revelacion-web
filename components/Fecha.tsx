"use client";

import { useEffect, useState } from "react";
import { contenido } from "@/app/content";
import { Calendar } from "./icons";

function calcular(diaISO: string) {
  const diff = new Date(diaISO).getTime() - Date.now();
  const clamp = (n: number) => Math.max(0, n);
  if (diff <= 0) return null;
  return {
    dias: clamp(Math.floor(diff / 86_400_000)),
    horas: clamp(Math.floor(diff / 3_600_000) % 24),
    minutos: clamp(Math.floor(diff / 60_000) % 60),
    segundos: clamp(Math.floor(diff / 1000) % 60),
  };
}

export function Fecha() {
  const f = contenido.fecha;
  const [t, setT] = useState<ReturnType<typeof calcular> | null>(null);

  useEffect(() => {
    const tick = () => setT(calcular(contenido.diaISO));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const valores = t ? [t.dias, t.horas, t.minutos, t.segundos] : [null, null, null, null];
  const pad = (n: number | null) => (n === null ? "—" : n > 99 ? String(n) : String(n).padStart(2, "0"));

  return (
    <section id="fecha" className="px-4 py-6">
      <div className="mx-auto max-w-lg rounded-[1.8rem] border border-gold/30 bg-panel p-5 text-center shadow-sm">
        <div className="mx-auto flex max-w-[300px] items-center gap-4 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
            <Calendar className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/65">{f.kicker}</p>
            <p className="mt-0.5 font-display text-[1.55rem] font-semibold uppercase leading-tight text-ink">
              {contenido.diaLabel}
            </p>
            <p className="text-[11px] italic text-ink/60">{f.cta}</p>
          </div>
        </div>

        <div className="mx-auto mt-5 grid max-w-[340px] grid-cols-4 gap-2">
          {valores.map((v, i) => (
            <div key={i} className="rounded-xl border border-gold/30 bg-cream px-1 py-2.5">
              <p className="font-display text-xl font-semibold text-gold">{pad(v)}</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/55">{f.unidades[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
