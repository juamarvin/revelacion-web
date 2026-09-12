import type { Metadata } from "next";
import { ComicVita } from "@/components/ComicVita";

export const metadata: Metadata = {
  title: "¿Quién viene? · La canción",
  description:
    "La historieta de la canción: los cuatro gatos investigan quién viene a la familia. Dale play y seguí la conversación.",
};

export default function ComicPage() {
  return <ComicVita />;
}
