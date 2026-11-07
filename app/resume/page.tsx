import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Portfolio from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Résumé | Sirapop Khaikol",
  description: "Sirapop Khaikol’s software development experience, projects, education, skills, and downloadable résumé.",
};

export default function ResumePage() {
  const portrait = ["portrait.webp", "portrait.jpg", "portrait.jpeg", "portrait.png"].find(file => existsSync(path.join(process.cwd(), "public", file)));
  return <Portfolio portrait={portrait ? "/" + portrait : undefined} initialTab="resume"/>;
}
