import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Historia } from "@/components/Historia";
import { Apuestas } from "@/components/Apuestas";
import { Fecha } from "@/components/Fecha";
import { Cierre } from "@/components/Cierre";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Historia />
        <Apuestas />
        <Fecha />
        <Cierre />
      </main>
    </>
  );
}
