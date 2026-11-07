import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Portfolio from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Contact | Sirapop Khaikol",
  description: "Connect with Sirapop Khaikol about software projects, collaboration, and opportunities.",
};

export default function ContactPage() {
  const portrait = ["portrait.webp", "portrait.jpg", "portrait.jpeg", "portrait.png"].find(file => existsSync(path.join(process.cwd(), "public", file)));
  return <Portfolio portrait={portrait ? "/" + portrait : undefined} initialTab="contact"/>;
}
