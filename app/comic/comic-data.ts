import type { GatoKey } from "@/app/content";

export type PersonajeKey = "gordo" | "junior" | "naruto" | "doris" | "ian";

export const PERSONAJES: Record<
  PersonajeKey,
  { nombre: string; img: GatoKey | null; color: string; voz: string }
> = {
  gordo: { nombre: "Gordo", img: "gordoFormal", color: "#b0863d", voz: "voz grave y ruda" },
  junior: { nombre: "Junior", img: "juniorFormal", color: "#6e9bd1", voz: "voz suave y joven" },
  naruto: { nombre: "Naruto", img: "narutoFormal", color: "#dd7a3a", voz: "voz aguda y gritona" },
  doris: { nombre: "Doris", img: "dorisFormal", color: "#c85c78", voz: "voz femenina y elegante" },
  ian: { nombre: "Ian", img: null, color: "#8a8578", voz: "voz neutra" },
};

type PanelBase = { t: number; texto: string; resaltar?: string[]; calma?: boolean };

export type Panel =
  | (PanelBase & { tipo: "linea"; quien: PersonajeKey; fade?: boolean })
  | (PanelBase & { tipo: "grupo" })
  | (PanelBase & { tipo: "sfx" })
  | (PanelBase & { tipo: "reveal"; sub?: string });

export const AUDIO_SRC = "/audio/quien-viene.mp3";

export const PANELES: Panel[] = [
  { t: 0.2, tipo: "linea", quien: "gordo", texto: "Atención, atención..." },
  { t: 4.1, tipo: "linea", quien: "gordo", texto: "¡Se abre oficialmente la 🔎!" },
  { t: 7.4, tipo: "linea", quien: "junior", texto: "Tenemos una misión." },
  { t: 10.1, tipo: "linea", quien: "naruto", texto: "¡Descubrir quién viene a esta familia!", resaltar: ["quién", "viene"] },
  { t: 12.8, tipo: "linea", quien: "doris", texto: "Tenemos testimonios, apuestas..." },
  { t: 15.6, tipo: "linea", quien: "doris", texto: "...y demasiados gatos metidos donde nadie los llamó." },
  { t: 19.4, tipo: "linea", quien: "gordo", texto: "¡Eso último es completamente falso!" },
  { t: 23.0, tipo: "linea", quien: "doris", texto: "Gordo, estás sentado arriba de las pistas." },
  { t: 26.2, tipo: "linea", quien: "gordo", texto: "Ah...", fade: true },

  { t: 32.7, tipo: "linea", quien: "naruto", texto: "Hay alguien que ya llegó sin siquiera aparecer," },
  { t: 38.0, tipo: "linea", quien: "naruto", texto: "y tiene a toda esta familia contando los días para conocer." },
  { t: 43.0, tipo: "linea", quien: "doris", texto: "Hay 🤗 esperando, hay amor para regalar," },
  { t: 48.0, tipo: "linea", quien: "doris", texto: "y unos cuantos están seguros de lo que va a pasar." },
  { t: 52.7, tipo: "linea", quien: "gordo", texto: "Romina apuesta por un bebito súper afortunado," },
  { t: 56.5, tipo: "linea", quien: "naruto", texto: 'Paula dice "pequeño 🐦",' },
  { t: 58.6, tipo: "linea", quien: "junior", texto: "Claudia manda cariño a montones," },
  { t: 61.0, tipo: "linea", quien: "naruto", texto: "y Ángeles espera con ansias." },
  { t: 63.5, tipo: "linea", quien: "junior", texto: "Pero tranquilos..." },
  { t: 64.7, tipo: "linea", quien: "doris", texto: "Porque todavía nadie sabe..." },
  { t: 66.3, tipo: "linea", quien: "gordo", texto: "¡O eso creemos!" },

  { t: 69.5, tipo: "grupo", texto: "Unos dicen una cosa, otros dicen lo contrario," },
  { t: 74.8, tipo: "grupo", texto: "Cada uno tiene su teoría, cada uno tiene su escenario.", resaltar: ["teoría", "escenario"] },
  { t: 80.0, tipo: "grupo", texto: "Anabel promete cuidarte, Andrés espera con ilusión,", resaltar: ["anabel", "andrés"] },
  { t: 84.6, tipo: "grupo", texto: "y mientras tanto cuatro gatos ¡🔎 la situación!" },

  { t: 90.4, tipo: "grupo", texto: "¿Quién viene? ¿Quién viene?" },
  { t: 92.9, tipo: "linea", quien: "naruto", texto: "¿Quién se esconde por acá?" },
  { t: 95.3, tipo: "linea", quien: "doris", texto: "¿Será niño?" },
  { t: 96.6, tipo: "linea", quien: "junior", texto: "¿Será niña?" },
  { t: 97.8, tipo: "linea", quien: "doris", texto: "¡Ya lo vamos a revelar!" },
  { t: 100.6, tipo: "grupo", texto: "¿Quién viene? ¿Quién viene?" },
  { t: 102.0, tipo: "linea", quien: "naruto", texto: "La pregunta está instalada." },
  { t: 105.6, tipo: "grupo", texto: "Pero nadie va a saberlo..." },
  { t: 108.1, tipo: "linea", quien: "gordo", texto: "¡hasta la última jugada!", fade: true },

  { t: 111.2, tipo: "linea", quien: "naruto", texto: 'Pablo dice: "¡Neeeño!" con absoluta seguridad,' },
  { t: 116.4, tipo: "linea", quien: "naruto", texto: 'y Renzo dice "¡💯!",' },
  { t: 119.5, tipo: "linea", quien: "naruto", texto: "que le gusten los 🎮, nada más." },
  { t: 122.2, tipo: "linea", quien: "doris", texto: 'Meli 🗣️ "¡niñoooo!" con muchísima emoción,' },
  { t: 127.2, tipo: "linea", quien: "doris", texto: "mientras Marcela recuerda que fue una sorpresa de ❤️." },
  { t: 132.6, tipo: "linea", quien: "junior", texto: "Gabriela quiere mimarla, Aldana no quiere esperar," },
  { t: 136.6, tipo: "linea", quien: "junior", texto: "y Giuliana cuida a mamá mientras te espera llegar." },
  { t: 143.1, tipo: "linea", quien: "gordo", texto: "¿Y qué dice Ian?" },
  { t: 144.7, tipo: "linea", quien: "doris", texto: '"Ian solamente dijo..."' },
  { t: 146.8, tipo: "linea", quien: "ian", texto: "Holix." },
  { t: 148.2, tipo: "linea", quien: "naruto", texto: "¡Excelente aporte, Ian!" },

  { t: 150.6, tipo: "grupo", texto: "Hay apuestas por todos lados, nadie quiere dar el brazo a torcer," },
  { t: 155.7, tipo: "grupo", texto: "pero una cosa está segura:" },
  { t: 158.8, tipo: "linea", quien: "gordo", texto: "¡Este bebé va a tener mucho amor para crecer!" },
  { t: 162.1, tipo: "linea", quien: "doris", texto: "Tíos..." },
  { t: 163.3, tipo: "linea", quien: "naruto", texto: "Tías..." },
  { t: 164.4, tipo: "linea", quien: "doris", texto: "Travesuras..." },
  { t: 165.6, tipo: "linea", quien: "gordo", texto: "¡Y cuatro 🐱 para cuidar!" },

  { t: 168.9, tipo: "grupo", texto: "¿Quién viene? ¿Quién viene?" },
  { t: 171.8, tipo: "linea", quien: "naruto", texto: "¿Quién nos va a sorprender?" },
  { t: 174.4, tipo: "linea", quien: "doris", texto: "¿Será niño?" },
  { t: 175.6, tipo: "linea", quien: "junior", texto: "¿Será niña?" },
  { t: 176.5, tipo: "linea", quien: "junior", texto: "¡Ya falta poco para saber!" },
  { t: 179.4, tipo: "grupo", texto: "¿Quién viene? ¿Quién viene?" },
  { t: 181.9, tipo: "linea", quien: "naruto", texto: "Ya se siente la emoción..." },
  { t: 184.6, tipo: "linea", quien: "doris", texto: "¡Pero falta una última pista!" },
  { t: 187.5, tipo: "linea", quien: "gordo", texto: "¡Y esa la tenemos nosotros!" },

  { t: 189.5, tipo: "linea", quien: "junior", texto: "Tenemos los 🗳️...", calma: true },
  { t: 191.5, tipo: "linea", quien: "doris", texto: "Tenemos los 💬...", calma: true },
  { t: 193.0, tipo: "linea", quien: "naruto", texto: "Tenemos las 🧠...", calma: true },
  { t: 194.2, tipo: "linea", quien: "doris", texto: "Y tenemos...", calma: true },
  { t: 195.0, tipo: "linea", quien: "gordo", texto: "...🍽️." },
  { t: 196.2, tipo: "linea", quien: "doris", texto: "¡Gordo!" },
  { t: 197.2, tipo: "linea", quien: "gordo", texto: "Perdón." },
  { t: 197.8, tipo: "linea", quien: "doris", texto: "Ahora sí." },
  { t: 198.6, tipo: "linea", quien: "junior", texto: "Llegó el momento." },
  { t: 199.9, tipo: "linea", quien: "doris", texto: "Después de tantos días..." },
  { t: 201.4, tipo: "linea", quien: "gordo", texto: "Después de tantas 🎲..." },
  { t: 203.3, tipo: "linea", quien: "doris", texto: 'Después de tantos "yo sé que es"...' },
  { t: 206.1, tipo: "linea", quien: "gordo", texto: "Hay una sola respuesta." },

  { t: 208.0, tipo: "grupo", texto: "¿NIÑO...?" },
  { t: 208.9, tipo: "grupo", texto: "¿NIÑA...?" },
  { t: 209.8, tipo: "linea", quien: "gordo", texto: "¡No griten todavía!" },
  { t: 211.9, tipo: "linea", quien: "naruto", texto: "¡YO QUIERO 📣!" },
  { t: 213.6, tipo: "linea", quien: "junior", texto: "¡Esperá!" },
  { t: 214.2, tipo: "linea", quien: "junior", texto: "Tres..." },
  { t: 215.1, tipo: "linea", quien: "gordo", texto: "Dos..." },
  { t: 216.0, tipo: "linea", quien: "naruto", texto: "¡UNOOOOOO!" },

  { t: 218.4, tipo: "grupo", texto: "¡¡¡ES NENAAAAA!!!" },
  { t: 221.8, tipo: "grupo", texto: "¡¡¡ES NENA!!!" },
  { t: 224.0, tipo: "grupo", texto: "¡¡¡ES NENA!!!" },
  { t: 228.4, tipo: "sfx", texto: "Y su nombre es..." },
  { t: 233.28, tipo: "reveal", texto: "VITA", sub: "¡Bienvenida, pequeña!" },

  { t: 234.4, tipo: "grupo", texto: "Vita, Vita, ya te estamos esperando," },
  { t: 236.7, tipo: "grupo", texto: "con un mundo de cariño que te está preparando." },
  { t: 239.8, tipo: "grupo", texto: "Vita, Vita, todavía no llegaste," },
  { t: 241.9, tipo: "grupo", texto: "pero ya llenaste de amor todo lo que encontraste." },
  { t: 244.9, tipo: "grupo", texto: "Vita, Vita, vení tranquila, mi amor," },
  { t: 247.1, tipo: "grupo", texto: "que hay una familia entera esperándote con el corazón." },
  { t: 253.9, tipo: "linea", quien: "doris", texto: 'Y Laura ya lo presentía: "una princesa para la familia".' },
];
