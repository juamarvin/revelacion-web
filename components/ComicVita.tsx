"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import confetti from "canvas-confetti";
import { GATOS } from "@/app/content";
import {
  AUDIO_SRC,
  PANELES,
  PERSONAJES,
  type Panel,
  type PersonajeKey,
} from "@/app/comic/comic-data";
import { ESCENA_POR_PANEL, escenaSrc } from "@/app/comic/escenas";
import { MENSAJES } from "@/app/comic/mensajes";

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const ORDEN: PersonajeKey[] = ["gordo", "junior", "naruto", "doris"];

const CLAVES = new Set([
  "niño",
  "niña",
  "nene",
  "nena",
  "niñita",
  "niñoooo",
  "neeeño",
  "vita",
  "misterio",
  "amor",
  "apuestas",
  "apuesta",
  "misión",
  "investigación",
  "falso",
  "hambre",
  "holix",
  "princesa",
  "revelar",
  "respuesta",
  "ganó",
  "mimos",
  "porotito",
  "porotita",
  "pajarito",
  "sorpresa",
]);

function esClave(w: string) {
  const limpio = w
    .toLowerCase()
    .replace(/[^a-záéíóúñü]/gi, "");
  return CLAVES.has(limpio) || NOMBRES.has(limpio);
}

// Nombres propios de la familia: siempre resaltados.
const NOMBRES = new Set([
  "romina",
  "paula",
  "claudia",
  "ángeles",
  "angeles",
  "anabel",
  "andrés",
  "andres",
  "pablo",
  "renzo",
  "meli",
  "marcela",
  "gabriela",
  "aldana",
  "giuliana",
  "laura",
  "ian",
]);

const MAYUS = new Set(["teoría", "escenario", "anabel", "andrés"]);

const ESTILO_GLOBO: Record<string, { clase: string; anim: string; beat: number; pad: string }> = {
  gordo: { clase: "g-ovalo", anim: "movGordo", beat: 4, pad: "px-7 py-4" },
  doris: { clase: "g-elegante", anim: "movDoris", beat: 8, pad: "px-4 py-2" },
  naruto: { clase: "g-burst", anim: "movNaruto", beat: 2.5, pad: "px-5 py-3" },
  junior: { clase: "g-blob", anim: "movJunior", beat: 1.5, pad: "px-4 py-2" },
  grupo: { clase: "g-banner", anim: "movGrupo", beat: 4, pad: "px-6 py-2" },
  sfx: { clase: "g-pill", anim: "movDoris", beat: 8, pad: "px-5 py-2" },
  ian: { clase: "g-redondo", anim: "movGordo", beat: 4, pad: "px-5 py-3" },
};

type Item = { idx: number; panel: Panel };
type Bloque = { tipo: "escena"; src: string; items: Item[] } | { tipo: "splash"; item: Item };

function nombreDe(p: Panel) {
  if (p.tipo === "linea") {
    const g = PERSONAJES[p.quien];
    return { nombre: g.nombre, color: g.color, tag: true };
  }
  if (p.tipo === "grupo") return { nombre: "Los cuatro", color: "#c2a054", tag: true };
  return { nombre: "", color: "#c2a054", tag: false };
}

// Fusiona viñetas consecutivas que comparten la misma imagen en un solo bloque.
function construirBloques(): Bloque[] {
  const out: Bloque[] = [];
  PANELES.forEach((p, i) => {
    if (p.tipo === "reveal") {
      out.push({ tipo: "splash", item: { idx: i, panel: p } });
      return;
    }
    const src = escenaSrc(ESCENA_POR_PANEL[i]);
    if (!src) {
      out.push({ tipo: "splash", item: { idx: i, panel: p } });
      return;
    }
    const last = out[out.length - 1];
    if (last && last.tipo === "escena" && last.src === src) {
      last.items.push({ idx: i, panel: p });
    } else {
      out.push({ tipo: "escena", src, items: [{ idx: i, panel: p }] });
    }
  });
  return out;
}

const BLOQUES = construirBloques();

// Capítulos de la canción (para el indicador de sección).
const CAPITULOS: { t: number; nombre: string; sinTitulo?: boolean }[] = [
  { t: 0, nombre: "El misterio" },
  { t: 32.7, nombre: "La familia opina" },
  { t: 69.5, nombre: "Las teorías" },
  { t: 90.4, nombre: "El estribillo" },
  { t: 150.6, nombre: "Las apuestas" },
  { t: 187.5, nombre: "La última pista" },
  { t: 206.1, nombre: "El suspenso" },
  { t: 218.4, nombre: "¡Es nena!", sinTitulo: true },
  { t: 234.4, nombre: "¡Bienvenida VITA!" },
];

const itemsDe = (b: Bloque): Item[] => (b.tipo === "escena" ? b.items : [b.item]);

function computeActivo(time: number) {
  let b = 0;
  let k = 0;
  for (let bi = 0; bi < BLOQUES.length; bi++) {
    const items = itemsDe(BLOQUES[bi]);
    for (let ki = 0; ki < items.length; ki++) {
      if (time + 0.22 >= items[ki].panel.t) {
        b = bi;
        k = ki;
      } else {
        return { b, k };
      }
    }
  }
  return { b, k };
}

const ACENTOS = ["#c85c78", "#c2a054", "#6e9bd1", "#dd7a3a", "#b0863d"];

// 4 casilleros: 0=izq-arriba, 1=der-arriba, 2=izq-abajo, 3=der-abajo.
// Cada mensaje vive DUR y el siguiente del mismo casillero entra justo cuando
// el anterior se va.
const SLOTS = [
  { left: true, top: 15 },
  { left: false, top: 15 },
  { left: true, top: 55 },
  { left: false, top: 55 },
];

function MensajesVita({ now, start, end }: { now: number; start: number; end: number }) {
  const N = MENSAJES.length;
  if (!N || start <= 0) return null;
  const ciclos = Math.ceil(N / SLOTS.length);
  const dur = Math.max(3.5, (end - start) / (ciclos + 0.75));

  return (
    <>
      {MENSAJES.map((m, i) => {
        const slot = i % SLOTS.length;
        const ciclo = Math.floor(i / SLOTS.length);
        const t0 = start + ciclo * dur + (slot / SLOTS.length) * dur;
        const p = (now - t0) / dur;
        if (p <= 0 || p >= 1) return null;
        const entra = Math.min(1, p / 0.12);
        const sale = Math.min(1, (1 - p) / 0.14);
        const op = Math.max(0, Math.min(entra, sale));
        const pos = SLOTS[slot];
        const signo = pos.left ? -1 : 1;
        const desplaza = (1 - entra) * 60 * signo + (1 - sale) * 26 * signo;
        const color = ACENTOS[i % ACENTOS.length];

        return (
          <div
            key={i}
            className="pointer-events-none absolute z-[48] w-[26%] max-w-[330px]"
            style={{
              [pos.left ? "left" : "right"]: "3%",
              top: `${pos.top}%`,
              opacity: op,
              transform: `translateX(${desplaza}px) scale(${0.9 + 0.1 * op}) rotate(${desplaza * 0.04}deg)`,
            }}
          >
            <article
              className="msg-card rounded-2xl border bg-[#fdfbf3]/95 px-3 py-2 backdrop-blur-sm"
              style={{
                borderColor: color,
                boxShadow: `0 18px 44px rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.45), 0 0 30px ${color}55`,
                animation: "msgIn 0.55s cubic-bezier(.2,1.4,.4,1) both, msgFloat 4.6s ease-in-out infinite",
              }}
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span
                  className="font-display text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ color }}
                >
                  {m.nombre} {m.apellido}
                </span>
              </div>
              <p className="font-display text-[12px] leading-snug text-ink/90 sm:text-[13px]">
                {m.mensaje}
              </p>
            </article>
          </div>
        );
      })}
    </>
  );
}

export function ComicVita() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const abreRef = useRef<HTMLVideoElement>(null);
  const cierraRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(266.8);
  const [fs, setFs] = useState(false);
  const [muted, setMuted] = useState(false);
  const [renderMode, setRenderMode] = useState(false);

  // Modo render (?render=1): sin barra de controles ni overlay, auto-inicia
  // (muteado) cuando el grabador llama a window.__comicStart().
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("render")) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRenderMode(true);
    const w = window as unknown as Record<string, unknown>;
    w.__comicReady = true;
    w.__comicTime = () => audioRef.current?.currentTime ?? 0;
    w.__comicStart = () => {
      const a = audioRef.current;
      if (!a) return;
      a.muted = true;
      a.currentTime = 0;
      setTime(0);
      void a.play().catch(() => {});
    };
    return () => {
      delete w.__comicReady;
      delete w.__comicTime;
      delete w.__comicStart;
    };
  }, []);

  useEffect(() => {
    const onFs = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const activo = computeActivo(time);

  // "¿Quién viene?" (los 4 juntos): papelitos de colores caendo.
  const bloqueActivo = activo.b >= 0 && BLOQUES[activo.b] ? BLOQUES[activo.b] : null;
  // Papelitos: acompañan todos los estribillos (escena del estribillo) y la
  // revelación (esa escena comparte la misma imagen).
  const enQuienViene =
    !!bloqueActivo &&
    bloqueActivo.tipo === "escena" &&
    bloqueActivo.src.includes("10-estribillo-luces");

  // Flash breve al entrar la escena "se dan vuelta" (18-gatos-investigan).
  const giroIdx = BLOQUES.findIndex(
    (b) => b.tipo === "escena" && b.src.includes("18-gatos-investigan"),
  );
  const giroT = giroIdx >= 0 ? (itemsDe(BLOQUES[giroIdx])[0]?.panel.t ?? 0) : 0;
  // El flash acompaña la entrada del giro: arranca cuando el bloque ya cambió
  // (giroT - 0.22) y pica cuando la imagen ya está visible.
  const flashGiro =
    giroIdx >= 0 && time >= giroT - 0.22 && time < giroT + 0.55
      ? Math.max(0, 1 - Math.abs(time - (giroT + 0.12)) / 0.4)
      : 0;

  const fadePanels = PANELES.map((p, i) => ({ p, i })).filter(
    ({ p }) => p.tipo === "linea" && p.fade,
  );
  let negro = 0;
  for (const { p, i } of fadePanels) {
    const mismaEscena = i > 0 && ESCENA_POR_PANEL[i - 1] === ESCENA_POR_PANEL[i];
    // Si el fundido arranca una escena nueva, le damos un momento para verse
    // limpia antes de oscurecer (evita el cruce turbio con la escena previa).
    const delay = mismaEscena ? 0 : 1;
    const start = p.t + delay;
    const end = PANELES[i + 1] ? PANELES[i + 1].t : start + 4;
    if (time >= start && time < end) {
      negro = (time - start) / Math.max(0.1, end - start);
      break;
    }
    if (time >= end && time < end + 1.3) {
      negro = 1 - (time - end) / 1.3;
      break;
    }
    // Escena nueva: entra desde negro (corte a negro + reveal).
    if (!mismaEscena && time >= p.t && time < p.t + 0.5) {
      negro = Math.max(negro, 1 - (time - p.t) / 0.5);
      break;
    }
  }

  // Corte directo al terminar la "nube" (globo de los cuatro gatos): el globo
  // ya cubrió la pantalla, así que el cambio de escena se hace seco.
  const nubeIdx = PANELES.findIndex((p) => /para cuidar/i.test(p.texto));
  const nubeNextIdx = nubeIdx >= 0 ? nubeIdx + 1 : -1;
  const nubeNextT =
    nubeNextIdx >= 0 && PANELES[nubeNextIdx] ? PANELES[nubeNextIdx].t : Number.POSITIVE_INFINITY;

  // Sección final "Vita, Vita, ya te estamos esperando": muestra los mensajes.
  // Arrancan un poco después del reveal de "VITA" para no pisarlo.
  const vitaPanel = PANELES.find((p) => /vita,?\s*vita,?\s*ya te estamos esperando/i.test(p.texto));
  const vitaStart = vitaPanel ? vitaPanel.t + 1.1 : 0;
  // Telón: abre al inicio, queda abierto durante la historia y cierra al final.
  // Los videos tienen fondo negro; con mix-blend "screen" el negro se vuelve
  // transparente y se ve la escena de fondo.
  const OPEN_END = 4.2;
  const abriendo = playing && time < OPEN_END;
  const curtainStart = Math.max(0, duration - 6.5);
  const curtainDur = 6;
  const curtainP = Math.max(0, Math.min(1, (time - curtainStart) / curtainDur));
  const cerrando = curtainP > 0;
  const vitaEnd =
    vitaStart > 0 ? Math.min(Math.max(vitaStart + 8, duration - 1.5), curtainStart - 0.6) : 0;

  // Secuencia de suspenso: "Hay una sola respuesta" (letra por letra) y
  // luego "¿NIÑO...?" / "¿NIÑA...?" — todo sobre pantalla negra, sin escena.
  const inicioSuspensoIdx = PANELES.findIndex((p) => /hay una sola respuesta/i.test(p.texto));
  const inicioSuspenso =
    inicioSuspensoIdx >= 0
      ? PANELES[inicioSuspensoIdx].t
      : Number.POSITIVE_INFINITY;
  const preguntas = PANELES.filter(
    (p) => p.tipo === "grupo" && /^¿NIÑ[OA]/i.test(p.texto.trim()),
  );
  const preguntaFin = preguntas.length
    ? preguntas[preguntas.length - 1].t
    : Number.POSITIVE_INFINITY;
  const suspenseEnd = PANELES.findIndex(
    (p) => p.tipo === "linea" && /no griten/i.test(p.texto),
  );
  const suspenseStop = suspenseEnd >= 0 ? PANELES[suspenseEnd].t : preguntaFin + 1.2;
  const enSuspenso =
    Number.isFinite(inicioSuspenso) && time >= inicioSuspenso - 0.5 && time < suspenseStop;
  const lineaSuspenso =
    inicioSuspensoIdx >= 0 && time >= inicioSuspenso - 0.5 && time < preguntas[0].t - 0.1
      ? PANELES[inicioSuspensoIdx]
      : null;
  const pregunta =
    preguntas.length > 0 && time >= preguntas[0].t - 0.12 && time < suspenseStop
      ? preguntas.reduce<Panel | null>((acc, p) => (p.t <= time + 0.12 ? p : acc), null) ??
        preguntas[0]
      : null;

  // Secuencia "Y su nombre es... VITA": pantalla negra, texto letra por letra
  // y el nombre aparece recién cuando la canción lo dice.
  const nombreIdx = PANELES.findIndex((p) => p.tipo === "sfx" && /y su nombre/i.test(p.texto));
  const revealIdx = PANELES.findIndex((p) => p.tipo === "reveal");
  const nombreT0 = nombreIdx >= 0 ? PANELES[nombreIdx].t : Number.POSITIVE_INFINITY;
  const revealT = revealIdx >= 0 ? PANELES[revealIdx].t : Number.POSITIVE_INFINITY;
  const nombreFin =
    revealIdx >= 0 && PANELES[revealIdx + 1]
      ? PANELES[revealIdx + 1].t
      : revealT + 4;
  const enNombre =
    Number.isFinite(nombreT0) && time >= nombreT0 - 0.4 && time < nombreFin;
  const mostrarVita = time >= revealT - 0.12 && time < nombreFin;

  const reveladoRef = useRef(false);
  useEffect(() => {
    const items = itemsDe(BLOQUES[activo.b]);
    const it = items[Math.min(activo.k, items.length - 1)];
    const esRevelacion = Boolean(it && it.panel.texto.toUpperCase().includes("NENA"));
    if (esRevelacion && !reveladoRef.current) {
      void confetti({
        particleCount: 170,
        spread: 95,
        origin: { y: 0.5 },
        colors: ["#c2a054", "#e4cb92", "#6e9bd1", "#dd7a3a", "#c85c78", "#ffffff"],
      });
    }
    reveladoRef.current = esRevelacion;
  }, [activo.b, activo.k]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const a = audioRef.current;
      if (a) setTime(a.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Controla los videos del telón: el de apertura al inicio y el de cierre al final.
  useEffect(() => {
    const v = abreRef.current;
    if (!v) return;
    v.playbackRate = 2.6;
    if (abriendo) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [abriendo]);

  useEffect(() => {
    const v = cierraRef.current;
    if (!v) return;
    v.playbackRate = 1.8;
    if (cerrando) {
      void v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [cerrando]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  const seek = (v: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = v;
    setTime(v);
  };

  const irA = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    seek(PANELES[i].t);
    void a.play();
  };

  const toggleFs = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) void el.requestFullscreen?.();
    else void document.exitFullscreen();
  };

  const reiniciar = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    setTime(0);
    void a.play();
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  // Atajos de teclado: Espacio (play/pausa), ← → (±5s), Home (inicio), F (pantalla completa).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      const a = audioRef.current;
      if (!a) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (a.paused) void a.play();
        else a.pause();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        a.currentTime = Math.min(a.duration || Infinity, a.currentTime + 5);
        setTime(a.currentTime);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        a.currentTime = Math.max(0, a.currentTime - 5);
        setTime(a.currentTime);
      } else if (e.code === "Home") {
        e.preventDefault();
        a.currentTime = 0;
        setTime(0);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        a.muted = !a.muted;
        setMuted(a.muted);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (!document.fullscreenElement) void wrapRef.current?.requestFullscreen?.();
        else void document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const inicio = !playing && time < 0.25;
  const capActivo = [...CAPITULOS].reverse().find((c) => time >= c.t) ?? CAPITULOS[0];
  const capituloActual = capActivo.nombre;
  const esVitaTitulo = capActivo.nombre === "¡Bienvenida VITA!";
  const mostrarTitulo =
    !capActivo.sinTitulo &&
    time - capActivo.t > 0.15 &&
    (esVitaTitulo || time - capActivo.t < 5);
  const itemsActivos = itemsDe(BLOQUES[activo.b]);
  const itActivo = itemsActivos[Math.min(activo.k, itemsActivos.length - 1)];
  const esNena = Boolean(itActivo && /NENA/i.test(itActivo.panel.texto));
  const temblor = esNena || mostrarVita ? "nenaShake 0.55s ease-out both" : undefined;

  return (
    <div
      ref={wrapRef}
      className="relative w-full bg-black"
      style={{ "--beat": "0.65s" } as CSSProperties}
    >
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 266.8)}
      />

      <div
        className="sticky top-0 z-40 border-b border-white/10 bg-black/70 px-3 py-2 backdrop-blur"
        style={{ display: renderMode || fs ? "none" : undefined }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M7 5.5v13l11-6.5-11-6.5z" />
              </svg>
            )}
          </button>

          <span className="w-10 shrink-0 text-right font-display text-[11px] tabular-nums text-white/75">
            {fmt(time)}
          </span>
          <div className="relative flex w-full items-center">
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Progreso de la canción"
              className="range-comic h-1.5 w-full cursor-pointer rounded-full outline-none"
              style={{
                background: `linear-gradient(to right, #c2a054 ${(time / duration) * 100}%, rgba(255,255,255,0.25) ${(time / duration) * 100}%)`,
              }}
            />
            {CAPITULOS.map((c) => (
              <span
                key={c.nombre}
                title={c.nombre}
                className="pointer-events-none absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-white/35"
                style={{ left: `${(c.t / duration) * 100}%` }}
              />
            ))}
          </div>
          <span className="w-10 shrink-0 font-display text-[11px] tabular-nums text-white/55">
            {fmt(duration)}
          </span>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
                <path d="M22 9l-6 6M16 9l6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
                <path d="M16 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={reiniciar}
            aria-label="Volver a empezar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 4v4h4" />
            </svg>
          </button>

          <button
            type="button"
            onClick={toggleFs}
            aria-label="Pantalla completa"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            {fs ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 4v3a1 1 0 01-1 1H5M15 4v3a1 1 0 001 1h3M9 20v-3a1 1 0 00-1-1H5M15 20v-3a1 1 0 011-1h3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 9V5a1 1 0 011-1h4M20 9V5a1 1 0 00-1-1h-4M4 15v4a1 1 0 001 1h4M20 15v4a1 1 0 01-1 1h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`relative flex w-full items-center justify-center overflow-hidden bg-black ${
          renderMode || fs ? "h-[100svh]" : "h-[calc(100svh-3.5rem)]"
        }`}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width:
              renderMode || fs
                ? "min(100%, calc(100svh * 1672 / 941))"
                : "min(100%, calc((100svh - 3.5rem) * 1672 / 941))",
            aspectRatio: "1672 / 941",
            animation: temblor,
          }}
        >
          {renderMode && !playing && (
            <div className="pointer-events-none absolute inset-0 z-[70] bg-[#ff00ff]" />
          )}
          {BLOQUES.map((b, bi) => {
            const on = bi === activo.b && !enSuspenso && !enNombre;
            const esGiro = b.tipo === "escena" && b.src.includes("18-gatos-investigan");
            const esHambre = b.tipo === "escena" && b.src.includes("17-gordo-hambre");
            const esNubeBloque =
              b.tipo === "escena" && b.items.some((x) => x.idx === nubeIdx);
            const esPostNube =
              nubeNextIdx >= 0 &&
              b.tipo === "escena" &&
              b.items.some((x) => x.idx === nubeNextIdx);
            const enNube =
              Number.isFinite(nubeNextT) &&
              time >= nubeNextT - 0.45 &&
              time < nubeNextT + 0.7;
            const nubeTrans = enNube && (esNubeBloque || esPostNube);
            const esNubeOn =
              on &&
              b.tipo === "escena" &&
              /para cuidar/i.test(b.items[activo.k]?.panel.texto ?? "");
            const corteSeco = negro > 0.55 || enSuspenso || enNombre;
            return (
              <div
                key={bi}
                aria-hidden={!on}
                className={`absolute inset-0 ${
                  corteSeco
                    ? "duration-[0ms] ease-out"
                    : nubeTrans
                      ? "transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(.4,.05,.3,1)]"
                      : esGiro
                        ? "transition-opacity duration-[380ms] ease-out"
                        : esHambre
                          ? "transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(.4,.05,.3,1)]"
                          : "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.45,.05,.35,1)]"
                } ${
                  on
                    ? esGiro
                      ? "z-10 opacity-100"
                      : esNubeOn
                        ? "z-[44] scale-100 opacity-100"
                        : "z-10 scale-100 opacity-100"
                    : esNubeBloque && enNube
                      ? "pointer-events-none z-[44] scale-100 opacity-0"
                      : esGiro
                        ? "pointer-events-none z-0 opacity-0"
                        : "pointer-events-none z-0 scale-[1.06] opacity-0"
                }`}
                style={
                  on && !corteSeco && (esGiro || (esPostNube && enNube))
                    ? { animation: "giroIn 0.55s cubic-bezier(.2,.9,.25,1) both" }
                    : undefined
                }
              >
                {b.tipo === "escena" ? (
                  <BloqueEscena
                    bloque={b}
                    activoIdx={on ? activo.k : -1}
                    onIr={irA}
                    now={time}
                  />
                ) : (
                  <PanelView
                    panel={b.item.panel}
                    i={b.item.idx}
                    activo={on}
                    playing={playing}
                    onClick={() => irA(b.item.idx)}
                  />
                )}
              </div>
            );
          })}
          <div
            className="pointer-events-none absolute inset-0 z-30 bg-black transition-opacity duration-200 ease-linear"
            style={{ opacity: negro }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              opacity: flashGiro * 0.55,
              background: "radial-gradient(circle at 50% 55%, rgba(255,245,220,0.9) 0%, rgba(255,235,190,0.4) 40%, transparent 70%)",
            }}
          />

          {/* Efectos de video: viñeta y grano de película. */}
          <div className="pointer-events-none absolute inset-0 z-[21]">
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)" }}
            />
            <div className="film-grain absolute inset-0" style={{ opacity: 0.07 }} />
          </div>

          <Confeti on={enQuienViene} />

          {mostrarTitulo && !inicio && !enNombre && (
            <div
              key={capActivo.nombre}
              className={`pointer-events-none absolute inset-x-0 flex justify-center ${
                esVitaTitulo ? "z-[47]" : "z-[43]"
              }`}
              style={{
                bottom: "7%",
                transition: "bottom 1.3s cubic-bezier(.4,.05,.3,1)",
                ...(esVitaTitulo && curtainP > 0 ? { bottom: "46%" } : null),
              }}
            >
              <span
                className="flex items-center gap-3 rounded-full border border-gold/70 bg-black/60 px-7 py-2.5 font-display text-[clamp(14px,1.55vw,26px)] font-semibold uppercase tracking-[0.34em] text-gold shadow-[0_12px_34px_rgba(0,0,0,0.65)] backdrop-blur-sm"
                style={{
                  textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 0 26px rgba(228,203,146,0.45)",
                  animation: esVitaTitulo
                    ? "tituloInFijo 1.1s ease-out both"
                    : "tituloIn 4.6s ease-out both",
                }}
              >
                <span className="h-px w-6 bg-gold/60" />
                {capituloActual}
                <span className="h-px w-6 bg-gold/60" />
              </span>
            </div>
          )}

          {vitaStart > 0 && (
            <MensajesVita now={time} start={vitaStart} end={vitaEnd} />
          )}

          <video
            ref={abreRef}
            src="/videos/telon-abre.webm"
            muted
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 z-[45] h-full w-full object-cover transition-opacity duration-500"
            style={{
              opacity: cerrando ? 0 : 1,
              scale: "1.18",
              filter: "drop-shadow(0 0 16px rgba(0,0,0,0.85)) drop-shadow(0 0 42px rgba(0,0,0,0.5))",
              ...(cerrando ? {} : { animation: "telonSway 9s ease-in-out infinite" }),
            }}
          />
          <video
            ref={cierraRef}
            src="/videos/telon-cierra.webm"
            muted
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 z-[46] h-full w-full object-cover transition-opacity duration-500"
            style={{
              opacity: cerrando ? 1 : 0,
              scale: "1.18",
              filter: "drop-shadow(0 0 16px rgba(0,0,0,0.85)) drop-shadow(0 0 42px rgba(0,0,0,0.5))",
            }}
          />

          {enSuspenso && (
            <div className="pointer-events-none absolute inset-0 z-40">
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, #1c130b 0%, #0d0906 70%, #000 100%)" }}
              />
              {lineaSuspenso &&
                (() => {
                  const chars = Array.from(lineaSuspenso.texto);
                  const n = Math.max(1, chars.length);
                  const sStart = Math.max(0, inicioSuspenso - 0.5);
                  const sEnd = preguntas.length ? preguntas[0].t - 0.55 : sStart + 1.8;
                  const sHide = preguntas.length ? preguntas[0].t - 0.3 : Number.POSITIVE_INFINITY;
                  const fade =
                    time < sHide ? 1 : Math.max(0, 1 - (time - sHide) / 0.3);
                  return (
                    <p
                      key={lineaSuspenso.texto}
                      className="absolute inset-0 flex items-center justify-center px-[6%] text-center font-display text-[2.4rem] font-semibold uppercase leading-tight tracking-[0.06em] text-gold sm:text-[4rem]"
                      style={{
                        textShadow:
                          "0 0 34px rgba(228,203,146,0.5), 0 6px 18px rgba(0,0,0,0.8)",
                        opacity: fade,
                      }}
                    >
                      <span>
                        {chars.map((ch, ci) => {
                          const wt =
                            sStart + (ci / n) * Math.max(0.6, sEnd - sStart);
                          const visible = time + 0.1 >= wt;
                          if (ch === " ")
                            return <span key={ci}>{"\u00A0"}</span>;
                          return (
                            <span
                              key={ci}
                              className="inline-block"
                              style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "none" : "translateY(6px)",
                                animation: visible
                                  ? "letraIn 0.4s cubic-bezier(.2,1.3,.4,1) both"
                                  : undefined,
                              }}
                            >
                              {ch}
                            </span>
                          );
                        })}
                      </span>
                    </p>
                  );
                })()}
              {pregunta && (
                <p
                  key={pregunta.texto}
                  className="absolute inset-0 flex items-center justify-center px-[4%] text-center font-display font-black uppercase leading-none text-gold"
                  style={{
                    fontSize: "clamp(3.5rem, 13vw, 10rem)",
                    letterSpacing: "0.02em",
                    textShadow: "0 0 40px rgba(228,203,146,0.55), 0 8px 24px rgba(0,0,0,0.7)",
                    animation: "preguntaIn 0.6s cubic-bezier(.2,1.4,.4,1) both",
                  }}
                >
                  {pregunta.texto}
                </p>
              )}
            </div>
          )}

          {enNombre && (
            <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center text-center">
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, #3a2a18 0%, #1c130b 68%, #0d0906 100%)" }}
              />
              <p className="relative font-display text-[1.6rem] font-semibold uppercase tracking-[0.35em] text-goldsoft sm:text-[2.8rem]">
                {(() => {
                  const frase = "Y su nombre es";
                  const chars = Array.from(frase);
                  const n = Math.max(1, chars.length);
                  const tipT = nombreT0 + (revealT - nombreT0) * 0.72;
                  return chars.map((ch, ci) => {
                    const wt = nombreT0 + (ci / n) * Math.max(0.6, tipT - nombreT0);
                    const visible = time + 0.1 >= wt;
                    if (ch === " ") return <span key={ci}>{"\u00A0"}</span>;
                    return (
                      <span
                        key={ci}
                        className="inline-block"
                        style={{
                          opacity: visible ? 1 : 0,
                          animation: visible
                            ? "letraIn 0.4s cubic-bezier(.2,1.3,.4,1) both"
                            : undefined,
                        }}
                      >
                        {ch}
                      </span>
                    );
                  });
                })()}
                {!mostrarVita && (
                  <span
                    className="ml-1 inline-block text-gold"
                    style={{ animation: "puntosPulse 1.1s ease-in-out infinite", opacity: time >= nombreT0 + 0.4 ? 1 : 0 }}
                  >
                    ...
                  </span>
                )}
              </p>
              {mostrarVita && (
                <p
                  className="relative mt-4 font-display text-[8rem] font-black leading-none text-gold sm:text-[13rem]"
                  style={{
                    letterSpacing: "0.04em",
                    textShadow:
                      "0 0 60px rgba(228,203,146,0.85), 0 0 120px rgba(228,203,146,0.5), 0 10px 30px rgba(0,0,0,0.75)",
                    animation: "vitaIn 0.45s cubic-bezier(.2,1.7,.35,1) both, vitaGlow 1.6s ease-in-out 0.45s infinite",
                  }}
                >
                  {PANELES[revealIdx]?.texto ?? "VITA"}
                </p>
              )}
              {mostrarVita && PANELES[revealIdx]?.tipo === "reveal" && PANELES[revealIdx].sub && (
                <p
                  className="relative mt-5 font-display text-xl italic text-cream/85 sm:text-2xl"
                  style={{ animation: "preguntaIn 0.7s ease-out 0.5s both" }}
                >
                  {PANELES[revealIdx].sub}
                </p>
              )}
            </div>
          )}

          {inicio && !renderMode && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Empezar"
              className="absolute inset-0 z-[50] flex flex-col items-center justify-center gap-4 bg-black/35 text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform hover:scale-105">
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden>
                  <path d="M7 5.5v13l11-6.5-11-6.5z" />
                </svg>
              </span>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-cream/90">
                Tocá para empezar
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type Ancla = { x: number; y: number };
type Modo = "lado" | "arriba" | "abajo";

// Posición de la boca de cada gato en cada escena (fracciones 0..1).
// "lado" = globo al costado de la cara; "arriba" = globo sobre la cabeza (grupales).
const ANCLAS: Record<string, { modo: Modo; default: Ancla; sinPuntos?: boolean; modoQuien?: Partial<Record<PersonajeKey, Modo>> } & Partial<Record<PersonajeKey, Ancla>>> = {
  "/escenas/01-mesa-investigacion/1.webp": {
    modo: "arriba",
    default: { x: 0.61, y: 0.55 },
    doris: { x: 0.22, y: 0.57 },
    naruto: { x: 0.47, y: 0.63 },
    gordo: { x: 0.61, y: 0.53 },
    junior: { x: 0.78, y: 0.6 },
  },
  "/escenas/16-dudando/1.webp": {
    modo: "arriba",
    default: { x: 0.5, y: 0.5 },
    gordo: { x: 0.11, y: 0.48 },
    naruto: { x: 0.29, y: 0.5 },
    junior: { x: 0.74, y: 0.5 },
    doris: { x: 0.9, y: 0.49 },
  },
  "/escenas/17-gordo-hambre/3.webp": {
    modo: "arriba",
    default: { x: 0.55, y: 0.36 },
    gordo: { x: 0.57, y: 0.42 },
    doris: { x: 0.11, y: 0.62 },
    naruto: { x: 0.28, y: 0.6 },
    junior: { x: 0.87, y: 0.62 },
  },
  "/escenas/02-gordo-jefe/1.webp": { modo: "lado", default: { x: 0.53, y: 0.55 } },
  "/escenas/03-gordo-pistas/2.webp": {
    modo: "abajo",
    modoQuien: { gordo: "arriba" },
    sinPuntos: true,
    default: { x: 0.5, y: 0.3 },
    gordo: { x: 0.5, y: 0.32 },
    doris: { x: 0.5, y: 0.32 },
  },
  "/escenas/04-doris-cerebro/1.webp": { modo: "abajo", default: { x: 0.33, y: 0.52 } },
  "/escenas/05-naruto-hype/1.webp": { modo: "lado", default: { x: 0.6, y: 0.56 } },
  "/escenas/06-junior-nervioso/1.webp": { modo: "lado", default: { x: 0.62, y: 0.56 } },
  "/escenas/09-ian-holix/1.webp": { modo: "lado", default: { x: 0.28, y: 0.6 } },
  "/escenas/07-tablero-pistas/1.webp": {
    modo: "arriba",
    default: { x: 0.5, y: 0.6 },
    gordo: { x: 0.17, y: 0.62 },
    naruto: { x: 0.37, y: 0.64 },
    doris: { x: 0.63, y: 0.64 },
    junior: { x: 0.83, y: 0.62 },
  },
  "/escenas/08-leyendo-cartas/1-v2.webp": {
    modo: "arriba",
    default: { x: 0.5, y: 0.58 },
    gordo: { x: 0.13, y: 0.56 },
    naruto: { x: 0.38, y: 0.58 },
    junior: { x: 0.62, y: 0.6 },
    doris: { x: 0.85, y: 0.56 },
  },
  "/escenas/11-cuenta-regresiva/1.webp": {
    modo: "arriba",
    default: { x: 0.5, y: 0.56 },
    doris: { x: 0.1, y: 0.56 },
    naruto: { x: 0.35, y: 0.53 },
    junior: { x: 0.67, y: 0.6 },
    gordo: { x: 0.9, y: 0.56 },
  },
  "/escenas/10-estribillo-luces/1.webp": {
    modo: "arriba",
    default: { x: 0.5, y: 0.55 },
    doris: { x: 0.18, y: 0.55 },
    naruto: { x: 0.42, y: 0.5 },
    junior: { x: 0.63, y: 0.62 },
    gordo: { x: 0.85, y: 0.55 },
  },
  "/escenas/18-gatos-investigan/1.webp": {
    modo: "arriba",
    default: { x: 0.5, y: 0.55 },
    gordo: { x: 0.13, y: 0.5 },
    naruto: { x: 0.35, y: 0.62 },
    doris: { x: 0.6, y: 0.55 },
    junior: { x: 0.82, y: 0.58 },
  },
  "/escenas/19-gordo-club/1.webp": {
    modo: "lado",
    default: { x: 0.52, y: 0.45 },
    gordo: { x: 0.52, y: 0.45 },
  },
};

// Escena "leyendo cartas": una imagen por gato, casi idénticas salvo quién lee.
// Doris usa la imagen original (es la del inicio y la que ya teníamos).
const LECTORES_IMG: Record<string, string> = {
  gordo: "/escenas/08-leyendo-cartas/gordo-v2.webp",
  doris: "/escenas/08-leyendo-cartas/1-v2.webp",
  naruto: "/escenas/08-leyendo-cartas/naruto-v2.webp",
  junior: "/escenas/08-leyendo-cartas/junior-v2.webp",
};

// Foco de iluminación: se enciende/apaga en el propio gato (crossfade), en vez
// de desplazarse de uno a otro, para que el efecto no se "arrastre".
function Foco({ x, y, saliendo }: { x: number; y: number; saliendo: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        animation: `${saliendo ? "focoOut" : "focoIn"} 0.6s ease forwards`,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          left: `${x * 100}%`,
          top: `${(y - 0.02) * 100}%`,
          width: "30%",
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255,236,190,0.30) 0%, transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: "240vmax",
          height: "240vmax",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 13%, rgba(0,0,0,0.24) 33%, rgba(0,0,0,0.46) 68%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}

// Papelitos de colores (cálidos, sin azul ni rosa) que caen para acompañar
// las partes grupales de "¿Quién viene?".
const CONFETI_COLORES = ["#e4cb92", "#f7f2e7", "#d9a441", "#8fae7a", "#c66b52", "#c2a054"];
const CONFETI_PAPERS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 4.37 + (i % 5) * 2.9) % 100,
  delay: -(((i * 0.83) % 8) + 0.2),
  dur: 6.5 + (i % 5) * 1.4,
  w: 7 + (i % 4) * 3,
  color: CONFETI_COLORES[i % CONFETI_COLORES.length],
}));

function Confeti({ on }: { on: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[12] overflow-hidden"
      style={{ opacity: on ? 1 : 0, transition: "opacity 0.7s ease" }}
    >
      {CONFETI_PAPERS.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-[2px]"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.w,
            height: p.w * 1.6,
            background: p.color,
            opacity: 0.92,
            animation: `confetiCaida ${p.dur}s linear ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

function BloqueEscena({
  bloque,
  activoIdx,
  onIr,
  now,
}: {
  bloque: Extract<Bloque, { tipo: "escena" }>;
  activoIdx: number;
  onIr: (i: number) => void;
  now: number;
}) {
  const idx = activoIdx >= 0 ? activoIdx : 0;
  const it = bloque.items[idx];
  const info = nombreDe(it.panel);
  const base = ANCLAS[bloque.src] ?? { modo: "arriba" as Modo, default: { x: 0.5, y: 0.5 } };
  const ancla = (it.panel.tipo === "linea" ? base[it.panel.quien] : undefined) ?? base.default;
  const personaje =
    it.panel.tipo === "linea" ? it.panel.quien : it.panel.tipo === "grupo" ? "grupo" : "sfx";
  const modoPanel = base.modoQuien?.[personaje as PersonajeKey] ?? base.modo;
  const on = activoIdx >= 0;
  const t0 = PANELES[it.idx]?.t ?? 0;
  const t1 = PANELES[it.idx + 1]?.t ?? t0 + 3;
  const dur = Math.max(0.7, t1 - t0);

  // Cámara: panea/acerca suavemente hacia el hablante.
  // PAN y ZOOM están ligados (PAN = 100*(ZOOM-1)) para que el paneo nunca
  // exponga los bordes y el ancla quede exactamente donde apunta el globo.
  // "calma" mantiene el encuadre quieto (listas rápidas de varios oradores)
  // para que la cámara no salte de un gato a otro.
  const calma = bloque.items.some((x) => x.panel.tipo === "linea" && x.panel.calma);
  const ZOOM = calma ? 1.07 : 1.26;
  const PAN = (ZOOM - 1) * 100;
  const anclaCam = calma ? base.default : ancla;
  const anclaVis: Ancla = {
    x: 0.5 + (ancla.x - 0.5) * ZOOM + (0.5 - anclaCam.x) * (PAN / 100),
    y: 0.5 + (ancla.y - 0.5) * ZOOM + (0.5 - anclaCam.y) * (PAN / 100),
  };

  // El foco se enciende en el gato nuevo mientras se apaga en el anterior
  // (crossfade en el lugar), tomando la posición del panel previo del bloque.
  const prevPanel = idx > 0 ? bloque.items[idx - 1].panel : it.panel;
  const prevAncla =
    (prevPanel.tipo === "linea" ? base[prevPanel.quien] : undefined) ?? base.default;
  const prevAnclaVis: Ancla = {
    x: 0.5 + (prevAncla.x - 0.5) * ZOOM + (0.5 - anclaCam.x) * (PAN / 100),
    y: 0.5 + (prevAncla.y - 0.5) * ZOOM + (0.5 - anclaCam.y) * (PAN / 100),
  };

  // Escena especial: entra enfocando a Gordo y se va alejando lentamente
  // mientras la imagen se oscurece (hasta que se ve la escena completa).
  const esPistas = bloque.src.includes("03-gordo-pistas");
  const esLeyendo = bloque.src.includes("08-leyendo-cartas");
  const quienActivo = it.panel.tipo === "linea" ? it.panel.quien : undefined;
  const lectorActivo =
    quienActivo && LECTORES_IMG[quienActivo] ? quienActivo : "doris";
  const pullZoom = 2.35;
  const pullDur =
    (bloque.items[bloque.items.length - 1].idx < PANELES.length - 1
      ? PANELES[bloque.items[bloque.items.length - 1].idx + 1].t
      : t1 + 6) - PANELES[bloque.items[0].idx].t + 3.2;

  return (
    <button
      type="button"
      onClick={() => onIr(bloque.items[0].idx)}
      className="relative block h-full w-full"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transformOrigin: `${ancla.x * 100}% ${ancla.y * 100}%`,
          ...(esPistas
            ? on
              ? {
                  animation: `pullback ${Math.max(6, pullDur)}s cubic-bezier(.25,.1,.35,1) forwards`,
                }
              : { transform: `scale(${pullZoom})` }
            : {
                transformOrigin: "center center",
                transform: on
                  ? `translate(${(0.5 - anclaCam.x) * PAN}%, ${(0.5 - anclaCam.y) * PAN}%) scale(${ZOOM})`
                  : `translate(0%, 0%) scale(1.03)`,
                transition: "transform 1.15s cubic-bezier(.5,.02,.35,1)",
              }),
        }}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={
            on && !esPistas
              ? {
                  transformOrigin: `${ancla.x * 100}% ${ancla.y * 100}%`,
                  animation: "respiro 26s ease-in-out infinite",
                }
              : undefined
          }
        >
          {esLeyendo ? (
            Object.entries(LECTORES_IMG).map(([key, src]) => {
              const activo = lectorActivo === key;
              return (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  quality={90}
                  className="object-cover"
                  style={{
                    opacity: activo ? 1 : 0,
                    filter: activo ? "blur(0px)" : "blur(8px)",
                    transform: activo ? "scale(1)" : "scale(1.03)",
                    transition:
                      "opacity 620ms cubic-bezier(.4,0,.2,1), filter 620ms cubic-bezier(.4,0,.2,1), transform 620ms cubic-bezier(.4,0,.2,1)",
                    willChange: "opacity, filter, transform",
                  }}
                />
              );
            })
          ) : (
            <Image
              src={bloque.src}
              alt=""
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,242,214,0.10) 0%, transparent 28%, rgba(0,0,0,0.22) 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: on ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        <Foco key={`p-${it.idx}`} x={prevAnclaVis.x} y={prevAnclaVis.y} saliendo />
        <Foco key={`c-${it.idx}`} x={anclaVis.x} y={anclaVis.y} saliendo={false} />
      </div>


      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/20 to-transparent" />

      {on && (
        <Globo
          texto={it.panel.texto}
          nombre={info.tag ? info.nombre : undefined}
          color={info.color}
          ancla={anclaVis}
          modo={modoPanel}
          lineaKey={it.idx}
          now={now}
          t0={t0}
          dur={dur}
          personaje={personaje}
          resaltar={it.panel.resaltar}
          exagerado={it.panel.tipo === "grupo" && /NENA/i.test(it.panel.texto)}
          letra={/hay una sola respuesta/i.test(it.panel.texto)}
          sinPuntos={base.sinPuntos}
        />
      )}
    </button>
  );
}

function Globo({
  texto,
  nombre,
  color,
  ancla,
  modo,
  lineaKey,
  now,
  t0,
  dur,
  personaje,
  resaltar,
  exagerado,
  letra,
  sinPuntos,
}: {
  texto: string;
  nombre?: string;
  color: string;
  ancla: Ancla;
  modo: Modo;
  lineaKey: number;
  now: number;
  t0: number;
  dur: number;
  personaje: string;
  resaltar?: string[];
  exagerado?: boolean;
  letra?: boolean;
  sinPuntos?: boolean;
}) {
  const { x, y } = ancla;
  const cfg = ESTILO_GLOBO[personaje] ?? ESTILO_GLOBO.grupo;
  const exag = Boolean(exagerado);
  // Transición "nube": este globo se acerca a la cámara (se recentra y crece)
  // hasta cubrir todo y cae en la escena siguiente.
  const esNube = /para cuidar/i.test(texto);
  // La nube revela el texto un poco más rápido y el zoom arranca recién al
  // terminar de narrar, para que se llegue a leer.
  const spanNube = Math.max(0.35, dur - 1.5);
  const nWords = Math.max(1, texto.split(" ").length);
  const spanUsado = esNube ? spanNube : Math.max(0.35, dur - 0.55);
  const zoomDelay = esNube ? Math.max(0.6, ((nWords - 1) / nWords) * spanUsado + 0.25) : 0;
  // El globo se monta 0.22s antes (lead de computeActivo), así que el zoom dura
  // (dur - zoomDelay): arranca al terminar el texto y termina justo en el corte.
  const zoomDur = Math.max(0.4, dur - zoomDelay);
  // El texto del globo se desvanece cuando arranca el zoom del ícono.
  const fadeTexto = esNube
    ? Math.max(0, Math.min(1, 1 - (now - (t0 + zoomDelay - 0.22)) / 0.35))
    : 1;
  const cuerpo = (
    <div
      key={lineaKey}
      className={`globo-shape ${cfg.clase}`}
      style={{
        background: `color-mix(in srgb, ${color} 68%, transparent)`,
        padding: "3px",
        animation: exag
          ? "nenaIn 0.8s cubic-bezier(.2,1.5,.4,1) both, nenaRock calc(var(--beat, 0.65s) * 1.4) ease-in-out 0.8s infinite"
          : `${cfg.anim} calc(var(--beat, 0.65s) * ${cfg.beat}) ease-in-out infinite`,
        ...(exag ? { filter: "drop-shadow(0 0 26px rgba(228,203,146,0.7))" } : null),
      }}
    >
      <div
        className={`globo-in ${cfg.pad} shadow-[0_10px_26px_rgba(0,0,0,0.35)] ${exag ? "px-9 py-4 sm:px-12 sm:py-5" : ""}`}
        style={{
          animation: exag
            ? "globoIn 0.45s ease-out"
            : "globoIn 0.45s ease-out, beatPulse calc(var(--beat, 0.65s) * 2) ease-in-out 0.45s infinite",
          ...(esNube ? { overflow: "visible" } : null),
        }}
      >
        {nombre && !exag && (
          <span
            className="relative z-10 mb-1 block font-display text-[clamp(11px,1.05vw,16px)] font-semibold uppercase tracking-[0.14em]"
            style={{ color, opacity: fadeTexto }}
          >
            {nombre}
          </span>
        )}
        <span
          className={`relative z-10 block font-display text-ink ${
            exag
              ? "text-[clamp(34px,5.2vw,80px)] font-black uppercase leading-[0.98] tracking-tight"
              : "text-[clamp(17px,2.15vw,30px)] leading-[1.14]"
          }`}
          style={{ "--spk": color } as CSSProperties}
        >
          {(() => {
            if (letra) {
              const chars = Array.from(texto);
              const n = Math.max(1, chars.length);
              const span = Math.max(0.35, dur - 0.4);
              return (
                <span className="inline">
                  {chars.map((ch, i) => {
                    const wt = t0 + (i / n) * span;
                    const visible = now + 0.1 >= wt;
                    if (ch === " ") return <span key={i}>{"\u00A0"}</span>;
                    return (
                      <span
                        key={i}
                        className="inline-block"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? "none" : "translateY(4px)",
                          animation: visible
                            ? "letraIn 0.32s cubic-bezier(.2,1.3,.4,1) both"
                            : undefined,
                        }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              );
            }
            const palabras = texto.split(" ");
            const n = Math.max(1, palabras.length);
            return palabras.map((w, i) => {
              const limpio = w.toLowerCase().replace(/[^a-záéíóúñü]/gi, "");
              const clave = esClave(w) || (resaltar?.includes(limpio) ?? false);
              const mayus = MAYUS.has(limpio);
              const span = spanUsado;
              const wt = t0 + (i / n) * span;
              const visible = now + 0.1 >= wt;
              if (exag) {
                return (
                  <span
                    key={i}
                    className="mr-[0.22em] inline-block"
                    style={{
                      color,
                      textShadow: "0 3px 0 rgba(0,0,0,0.18), 0 0 18px rgba(228,203,146,0.6)",
                      opacity: visible ? fadeTexto : 0,
                      animation: visible ? "palabraInSpin 0.6s cubic-bezier(.2,1.4,.4,1) both" : undefined,
                    }}
                  >
                    {w}
                  </span>
                );
              }
              if (esNube && w.includes("🐱")) {
                return (
                  <span
                    key={i}
                    className="relative mr-[0.22em] inline-block"
                    style={{
                      zIndex: 60,
                      opacity: visible ? 1 : 0,
                      animation: visible
                        ? "palabraPop 0.5s cubic-bezier(.2,1.7,.4,1) both"
                        : undefined,
                    }}
                  >
                    <span
                      className="inline-block"
                      style={{
                        transformOrigin: "center center",
                        animation: `iconoZoom ${zoomDur}s ease-in ${zoomDelay}s both`,
                      }}
                    >
                      {w}
                    </span>
                  </span>
                );
              }
              if (clave) {
                return (
                  <span
                    key={i}
                    className={`mr-[0.22em] inline-block font-bold ${mayus ? "uppercase" : ""}`}
                    style={{
                      color,
                      opacity: visible ? fadeTexto : 0,
                      animation: visible
                        ? "palabraPopKey 0.55s cubic-bezier(.2,1.7,.4,1) both"
                        : undefined,
                    }}
                  >
                    <span
                      className="inline-block"
                      style={{
                        animation: "clavePulse 1.5s ease-in-out infinite",
                        animationDelay: `${-((i % 4) * 0.35)}s`,
                      }}
                    >
                      {w}
                    </span>
                  </span>
                );
              }
              return (
                <span
                  key={i}
                  className="mr-[0.22em] inline-block"
                  style={{
                    opacity: visible ? fadeTexto : 0,
                    animation: visible
                      ? "palabraPop 0.5s cubic-bezier(.2,1.7,.4,1) both"
                      : undefined,
                  }}
                >
                  {w}
                </span>
              );
            });
          })()}
        </span>

        <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <span
            className="absolute top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animation: "brillo 1.1s ease-out 0.1s" }}
          />
        </span>
      </div>
    </div>
  );

  // La nube queda quieta: lo que sale al frente es el ícono 🐱.
  const cuerpoNode = cuerpo;

  if (modo === "arriba") {
    const targetX = 50;
    const targetY = 11;
    const fracs = [0.14, 0.3, 0.46];
    const mx = x * 100;
    const my = y * 100;
    return (
      <>
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2"
          style={{ top: "2%", maxWidth: "min(76%, 920px)" }}
        >
          {cuerpoNode}
        </div>
        {!sinPuntos &&
          fracs.map((f, i) => {
            const dx = mx + f * (targetX - mx);
            const dy = my + f * (targetY - my);
            const d = 5 + i * 2;
            return (
              <span
                key={i}
                className="pointer-events-none absolute z-10 rounded-full border border-gold/60 bg-[#fffdf8]"
                style={{
                  left: `${dx}%`,
                  top: `${dy}%`,
                  width: d,
                  height: d,
                  transform: "translate(-50%, -50%)",
                  transition: "left 0.55s ease, top 0.55s ease",
                }}
              />
            );
          })}
      </>
    );
  }

  if (modo === "abajo") {
    const targetX = 50;
    const targetY = 92;
    const fracs = [0.14, 0.3, 0.46];
    const mx = x * 100;
    const my = y * 100;
    return (
      <>
        <div
          className="absolute bottom-[6%] left-1/2 z-10 -translate-x-1/2"
          style={{ maxWidth: "min(72%, 840px)" }}
        >
          {cuerpoNode}
        </div>
        {!sinPuntos &&
          fracs.map((f, i) => {
            const dx = mx + f * (targetX - mx);
            const dy = my + f * (targetY - my);
            const d = 5 + i * 2;
            return (
              <span
                key={i}
                className="pointer-events-none absolute z-10 rounded-full border border-gold/60 bg-[#fffdf8]"
                style={{
                  left: `${dx}%`,
                  top: `${dy}%`,
                  width: d,
                  height: d,
                  transform: "translate(-50%, -50%)",
                  transition: "left 0.55s ease, top 0.55s ease",
                }}
              />
            );
          })}
      </>
    );
  }

  // modo "lado": globo pegado al costado de la cara, del lado con más espacio.
  // Se ancla por su borde cercano y se limita el ancho para no salir de pantalla.
  const haciaDerecha = x < 0.5;
  const gap = 0.12;
  const avail = haciaDerecha ? 1 - (x + gap) : x - gap;
  const maxAncho = Math.max(0.24, Math.min(0.38, avail));
  const offs = haciaDerecha ? [0.03, 0.065, 0.1] : [-0.03, -0.065, -0.1];
  return (
    <>
      <div
        className="absolute z-10"
        style={{
          top: `${(y - 0.03) * 100}%`,
          transform: "translateY(-50%)",
          maxWidth: `min(${(maxAncho * 100).toFixed(1)}%, 520px)`,
          transition: "left 0.55s ease, right 0.55s ease, top 0.55s ease",
          ...(haciaDerecha
            ? { left: `${(x + gap) * 100}%` }
            : { right: `${((1 - x) + gap) * 100}%` }),
        }}
      >
        {cuerpo}
      </div>
      {!sinPuntos &&
        offs.map((dx, i) => {
          const d = 4 + i * 2;
          return (
            <span
              key={i}
              className="pointer-events-none absolute z-10 rounded-full border border-gold/60 bg-[#fffdf8]"
              style={{
                left: `${(x + dx) * 100}%`,
                top: `${y * 100}%`,
                width: d,
                height: d,
                transform: "translate(-50%, -50%)",
                transition: "left 0.55s ease, top 0.55s ease",
              }}
            />
          );
        })}
    </>
  );
}

function PanelView({
  panel,
  i,
  activo,
  playing,
  onClick,
}: {
  panel: Panel;
  i: number;
  activo: boolean;
  playing: boolean;
  onClick: () => void;
}) {
  const base =
    "relative h-full w-full cursor-pointer transition-all duration-300 " +
    (activo
      ? "scale-[1.02] opacity-100"
      : playing
        ? "opacity-50 hover:opacity-80"
        : "opacity-100 hover:opacity-90");

  if (panel.tipo === "reveal") {
    return (
      <button type="button" onClick={onClick} className={`${base} block`}>
        <div
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
          style={{
            background: "radial-gradient(ellipse at center, #3a2a18 0%, #1c130b 68%, #0d0906 100%)",
          }}
        >
          <p className="relative font-display text-[13px] uppercase tracking-[0.4em] text-goldsoft">
            Y su nombre es
          </p>
          <p
            className="relative mt-3 font-display text-[5.5rem] font-bold leading-none text-gold sm:text-[8rem]"
            style={{
              textShadow: "0 0 34px rgba(228,203,146,0.55), 0 6px 20px rgba(0,0,0,0.65)",
            }}
          >
            {panel.texto}
          </p>
          {panel.sub && (
            <p className="relative mt-4 font-display text-lg italic text-cream/85">{panel.sub}</p>
          )}
        </div>
      </button>
    );
  }

  if (panel.tipo === "sfx") {
    return (
      <button type="button" onClick={onClick} className={`${base} block`}>
        <div className="mx-auto w-fit rounded-full border border-gold/40 bg-[#fdfbf3] px-6 py-2 font-display text-[13px] italic tracking-wide text-ink/70">
          {panel.texto}
        </div>
      </button>
    );
  }

  if (panel.tipo === "grupo") {
    return (
      <button type="button" onClick={onClick} className={`${base} block`}>
        <article className="overflow-hidden rounded-2xl border border-gold/40 bg-[#fdfbf3] p-4 shadow-md">
          <div className="mb-3 flex items-end justify-center gap-1">
            {ORDEN.map((k) => (
              <Image
                key={k}
                src={GATOS[PERSONAJES[k].img!]!.src}
                alt={PERSONAJES[k].nombre}
                width={80}
                height={120}
                className="cat-warm cat-shadow h-16 w-auto object-contain sm:h-20"
              />
            ))}
          </div>
          <p className="mx-auto max-w-xl text-center font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
            {panel.texto}
          </p>
        </article>
      </button>
    );
  }

  const g = PERSONAJES[panel.quien];
  const abajo = i % 2 === 1;
  const tieneImg = g.img !== null;

  return (
    <button type="button" onClick={onClick} className={`${base} block text-left`}>
      <article
        className={`flex items-center gap-3 overflow-hidden rounded-2xl border bg-[#fdfbf3] p-3 shadow-md ${
          abajo ? "flex-row-reverse" : ""
        }`}
        style={{ borderColor: activo ? g.color : "rgb(194 160 84 / 0.4)" }}
      >
        <div className="relative w-24 shrink-0 sm:w-32">
          {tieneImg ? (
            <Image
              src={GATOS[g.img!]!.src}
              alt={g.nombre}
              width={GATOS[g.img!]!.width}
              height={GATOS[g.img!]!.height}
              className="cat-warm cat-shadow h-32 w-full object-contain sm:h-40"
            />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl bg-gold/10 font-display text-3xl text-ink/30 sm:h-40">
              ?
            </div>
          )}
          <span
            className={`absolute top-1 rounded-full px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wide text-white ${
              abajo ? "left-1" : "right-1"
            }`}
            style={{ backgroundColor: g.color }}
          >
            {g.nombre}
          </span>
        </div>
        <div className="flex flex-1 justify-center">
          <div
            className={`rounded-2xl border-2 px-4 py-3 font-display text-[15px] leading-snug shadow-sm sm:text-base ${
              abajo ? "rounded-tr-sm" : "rounded-tl-sm"
            }`}
            style={{ borderColor: g.color, backgroundColor: "#fffdf8" }}
          >
            {panel.texto}
          </div>
        </div>
      </article>
    </button>
  );
}
