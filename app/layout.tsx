import type { Metadata } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "La Gran Revelación · ¿Niño o niña?",
  description:
    "Estás invitado a La Gran Revelación. Nuestros presentadores felinos tienen una noticia increíble para compartir: hacé tu apuesta y dejá tu mensaje para el bebé.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${karla.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
