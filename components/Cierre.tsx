import { contenido } from "@/app/content";
import { CatImage } from "./Gatos";
import { Heart, Paw } from "./icons";

export function Cierre() {
  const c = contenido.cierre;
  return (
    <section className="px-4 pb-10 pt-4">
      <div className="relative mx-auto max-w-3xl">
        <div className="pointer-events-none absolute left-0 top-1/2 z-0 -ml-2 w-44 -translate-y-1/2 sm:w-72" aria-hidden>
          <CatImage gato="heraldo" className="w-full" />
        </div>

        <div className="relative z-10 pl-48 pr-4 text-center sm:min-h-[320px] sm:pl-72">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">{c.kicker}</p>
          <h2 className="mx-auto mt-2 max-w-[280px] font-display text-[1.9rem] font-semibold leading-snug text-ink">
            {c.titulo}
          </h2>
          <div className="mx-auto mt-3 flex max-w-[180px] items-center gap-2 text-gold">
            <span className="h-px flex-1 bg-gold/50" />
            <Heart className="h-3 w-3" />
            <span className="h-px flex-1 bg-gold/50" />
          </div>
          <p className="mt-3 text-[12px] text-ink/70">{c.texto}</p>
        </div>
      </div>

      <footer className="mt-10 border-t border-gold/20 pt-5 text-center">
        <Paw className="mx-auto h-4 w-4 text-gold" />
        <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-ink/45">
          {contenido.marca} · 2026
        </p>
      </footer>
    </section>
  );
}
