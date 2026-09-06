export type GatoKey =
  | "doris"
  | "gordo"
  | "junior"
  | "naruto"
  | "dorisFormal"
  | "gordoFormal"
  | "juniorFormal"
  | "narutoFormal"
  | "heroDoris"
  | "heroGordo"
  | "heroJunior"
  | "heroNaruto"
  | "heraldo";

export const GATOS: Record<
  GatoKey,
  { src: string; width: number; height: number }
> = {
  doris: { src: "/gatos/doris.webp", width: 527, height: 720 },
  gordo: { src: "/gatos/gordo.webp", width: 1087, height: 900 },
  junior: { src: "/gatos/junior.webp", width: 512, height: 588 },
  naruto: { src: "/gatos/naruto.webp", width: 591, height: 728 },
  dorisFormal: { src: "/gatos/editorial/doris.png", width: 920, height: 1536 },
  gordoFormal: { src: "/gatos/editorial/gordo.png", width: 807, height: 1536 },
  juniorFormal: { src: "/gatos/editorial/junior.png", width: 687, height: 999 },
  narutoFormal: { src: "/gatos/editorial/naruto.png", width: 755, height: 939 },
  heroDoris: { src: "/gatos/editorial/hero-doris.png", width: 914, height: 1536 },
  heroGordo: { src: "/gatos/editorial/hero-gordo.png", width: 619, height: 1536 },
  heroJunior: { src: "/gatos/editorial/hero-junior.png", width: 677, height: 989 },
  heroNaruto: { src: "/gatos/editorial/hero-naruto.png", width: 749, height: 939 },
  heraldo: { src: "/gatos/editorial/heraldo.png", width: 379, height: 402 },
};

export const contenido = {
  marca: "La Gran Revelación",
  diaISO: "2026-09-12T18:00:00-03:00",
  diaLabel: "12 de septiembre, 2026",
  hero: {
    eyebrow: "Estás invitado a",
    titulo: ["La Gran", "Revelación"],
    pregunta: "Una celebración felina",
    intro: "Nuestros presentadores felinos tienen una noticia increíble para compartir…",
  },
  historiaTitulo: "Así comenzó todo…",
  historia: [
    { texto: "Un día, nuestros humanos nos dijeron algo muy raro…", gato: "narutoFormal" as GatoKey, extra: "signo" },
    { texto: "Hmm… ¿otro humano chiquito corriendo por aquí?", gato: "gordoFormal" as GatoKey, extra: "none" },
    { texto: "¡Más juegos! ¡Más mimos! ¡Estoy listo!", gato: "juniorFormal" as GatoKey, extra: "chispas" },
    { texto: "Pero antes… hay una gran pregunta…", gato: "dorisFormal" as GatoKey, extra: "signo" },
  ],
  apuestas: {
    titulo: "Hagan sus apuestas",
    pregunta: "¿Qué creés que será?",
    sub: "Dejanos tu predicción y tu mensaje para el bebé",
    labelNombre: "Tu nombre",
    labelApellido: "Tu apellido",
    placeholderNombre: "Nombre",
    placeholderApellido: "Apellido",
    labelApuesta: "Tu apuesta",
    placeholderApuesta: "¿Niña, niño…? Arriesgá tu predicción…",
    mensajeLabel: "Tu mensaje para el bebé",
    mensajePlaceholder: "Escribí algo lindo para el bebé…",
    enviar: "Enviar mi predicción",
    error: "Completá tu nombre, tu apellido y tu apuesta 🐾",
    enviando: "Consultando a los gatos…",
    exitoTitulo: "¡Anotado!",
    exitoTexto: (nombre: string, voto: string) =>
      `${nombre}, tu apuesta "${voto}" quedó registrada. Los gatos te lo agradecen 🐾`,
    exitoBoton: "Hacer otra apuesta",
  },
  fecha: {
    kicker: "La verdad será revelada el",
    cta: "18:00 hrs · Nuestra casa",
    hoy: "¡Es el gran día!",
    unidades: ["Días", "Horas", "Min", "Seg"],
  },
  cierre: {
    kicker: "¡Se viene el gran momento!",
    titulo: "Prepárate para descubrirlo con nosotros.",
    texto: "Diversión, sorpresas y muchos maullidos asegurados.",
  },
};
