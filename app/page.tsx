import { existsSync } from "node:fs";
import path from "node:path";
import Portfolio from "@/components/Portfolio";

export default function Page() {
  const portrait = ["portrait.webp", "portrait.jpg", "portrait.jpeg", "portrait.png"]
    .find((file) => existsSync(path.join(process.cwd(), "public", file)));
  return <Portfolio portrait={portrait ? "/" + portrait : undefined} />;
}
