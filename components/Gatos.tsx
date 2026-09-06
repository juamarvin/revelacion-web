import Image from "next/image";
import { GATOS, type GatoKey } from "@/app/content";

export function CatImage({ gato, className = "", priority = false }: { gato: GatoKey; className?: string; priority?: boolean }) {
  const g = GATOS[gato];
  return (
    <Image
      src={g.src}
      alt="Presentador felino de La Gran Revelación"
      width={g.width}
      height={g.height}
      priority={priority}
      sizes="220px"
      className={`cat-warm cat-shadow h-auto select-none ${className}`}
    />
  );
}

export function Moño({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={`h-auto ${className}`} fill="currentColor" aria-hidden>
      <path d="M10.7 6L2.5 0.8C1.8 0.4 1 0.9 1 1.7v8.6c0 .8.8 1.3 1.5.9L10.7 6z" />
      <path d="M13.3 6l8.2-5.2c.7-.4 1.5.1 1.5.9v8.6c0 .8-.8 1.3-1.5.9L13.3 6z" />
      <ellipse cx="12" cy="6" rx="2.4" ry="2" />
    </svg>
  );
}

export function Corona({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={`h-auto ${className}`} fill="currentColor" aria-hidden>
      <path d="M2 13l-.8-9.4L6 7.6 12 1l6 6.6 4.2-4-.8 9.4H2zM3.6 14.6h16.8V17H3.6z" />
    </svg>
  );
}

export function MegaphoneOverlay({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute ${className}`}>
      <svg viewBox="0 0 24 24" className="h-auto" width="34" fill="currentColor" aria-hidden>
        <path d="M3 10.2v3.6c0 .7.5 1.2 1.2 1.2h2L16 19.4c.8.4 1.7-.2 1.7-1.1V5.7c0-.9-.9-1.5-1.7-1.1l-9.8 4.4h-2c-.7 0-1.2.5-1.2 1.2z" />
        <path d="M5.5 15.5h3L7.3 20c-.2.6-.8 1-1.4.8-.6-.2-.9-.8-.8-1.4l.4-3.9z" />
        <path d="M20 9.5a3.5 3.5 0 010 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}
