import Image from "next/image";
import { contenido, GATOS, type GatoKey } from "@/app/content";
import { Paw, Sparkle } from "./icons";
import { SpeechBubble } from "./SpeechBubble";

type Paso = (typeof contenido.historia)[number];

export function Historia() {
  return (
    <section id="historia" className="px-4 py-6">
      <div className="mx-auto max-w-3xl rounded-[1.8rem] border border-gold/25 bg-panel p-4 shadow-sm">
        <div className="flex items-center justify-center gap-2 pt-1">
          <Paw className="h-3.5 w-3.5 text-gold" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-ink/80">
            {contenido.historiaTitulo}
          </h2>
          <Paw className="h-3.5 w-3.5 text-gold" />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {contenido.historia.map((paso, i) => (
            <Paso key={i} paso={paso} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Paso({ paso, i }: { paso: Paso; i: number }) {
  const imagenDerecha = i % 2 === 1;
  const g: (typeof GATOS)[GatoKey] = GATOS[paso.gato];
  return (
    <article className="relative flex items-center overflow-hidden rounded-2xl border border-gold/40 bg-[#fdfbf3] shadow-md">
      <span className={`absolute top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-gold/90 font-display text-[11px] font-semibold text-cream ${i % 2 === 0 ? "right-2.5" : "left-2.5"}`}>
        {i + 1}
      </span>
      <div className={`relative w-[38%] shrink-0 sm:w-[40%] ${imagenDerecha ? "order-2" : ""}`}>
        <Image
          src={g.src}
          alt={paso.texto}
          width={g.width}
          height={g.height}
          quality={90}
          sizes="(max-width: 640px) 40vw, 300px"
          className="cat-warm cat-shadow h-auto w-full"
        />
        {paso.extra === "signo" && i === 0 && <Signo texto="¡Se viene bebé!" />}
        {paso.extra === "chispas" && (
          <>
            <Sparkle className="absolute right-1 top-1 h-3 w-3 text-goldsoft" />
            <Sparkle className="absolute left-2 top-4 h-2 w-2 text-goldsoft" />
          </>
        )}
        {paso.extra === "signo" && i === 3 && (
          <span className="pointer-events-none absolute -top-1 right-0 font-display text-4xl italic text-gold/80">
            ?
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center p-3 sm:p-4">
        <SpeechBubble tail={imagenDerecha ? "r" : "l"} className="text-[13px] sm:text-[14px]">
          {paso.texto}
        </SpeechBubble>
      </div>
    </article>
  );
}

function Signo({ texto }: { texto: string }) {
  return (
    <div className="absolute left-1 bottom-2 max-w-[92px] -rotate-[8deg] rounded-md border border-gold/60 bg-[#fffdf5] px-2 py-1 font-display text-[10px] italic leading-tight text-ink shadow-sm">
      {texto}
    </div>
  );
}
