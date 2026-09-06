import Image from "next/image";
import { contenido } from "@/app/content";
import { Heart, Paw, Sparkle, Flourish } from "./icons";

export function Hero() {
  const { hero } = contenido;

  return (
    <section className="overflow-hidden rounded-b-[2rem] text-center">
      <div className="relative h-[min(148vw,560px)] w-full sm:h-[700px]">
        <Image
          src="/gatos/composicion.png"
          alt="Los cuatro presentadores felinos de La Gran Revelación"
          width={1122}
          height={1402}
          priority
          sizes="100vw"
          className="absolute inset-x-0 bottom-0 z-0 h-full w-full object-contain object-bottom"
        />

        <div className="absolute inset-x-0 top-[4%] z-10 flex flex-col items-center px-8">
          <Flourish className="h-5 w-24 text-gold/75 sm:h-6 sm:w-28" />
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.34em] text-ink/75 sm:text-[11px]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.15rem,10.5vw,4.3rem)] font-semibold uppercase leading-[0.98] tracking-[-0.045em] text-ink">
            {hero.titulo[0]}
            <br />
            {hero.titulo[1]}
          </h1>
          <p className="mt-2 font-display text-[15px] uppercase tracking-[0.25em] text-gold sm:text-lg">
            {hero.pregunta}
          </p>
          <div className="mt-2 flex w-[170px] items-center gap-2 text-gold sm:w-[220px]">
            <span className="h-px flex-1 bg-gold/50" />
            <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="h-px flex-1 bg-gold/50" />
          </div>
          <p className="mt-5 max-w-[245px] text-[10px] leading-relaxed text-ink/75 sm:max-w-[290px] sm:text-[13px]">
            {hero.intro}
          </p>
        </div>

        <Sparkle className="absolute left-[7%] top-[29%] z-20 h-2 w-2 text-goldsoft" />
        <Sparkle className="absolute right-[7%] top-[17%] z-20 h-2 w-2 text-goldsoft" />
        <Paw className="absolute bottom-[13%] right-[2%] z-20 h-3 w-3 rotate-12 text-gold/60" />
      </div>
    </section>
  );
}
