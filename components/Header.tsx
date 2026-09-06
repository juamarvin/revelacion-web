import { Paw } from "./icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Paw className="h-5 w-5 text-gold" />
          <span className="font-display text-[10px] font-semibold uppercase leading-[1.35] tracking-[0.22em] text-ink">
            La Gran
            <br />
            Revelación
          </span>
        </div>
        <a
          href="#apuestas"
          className="rounded-full border border-gold/70 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold/10"
        >
          Apostar
        </a>
      </div>
    </header>
  );
}
