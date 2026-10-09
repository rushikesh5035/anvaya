import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <main className="bg-background min-h-screen overflow-x-clip">
      <Header />
      <Hero />
    </main>
  );
}
