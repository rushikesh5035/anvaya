import { Features } from "@/components/landing/features";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ReviewContext } from "@/components/landing/review-context";

export default function Home() {
  return (
    <main className="bg-background min-h-screen overflow-x-clip">
      <Header />
      <Hero />
      <ReviewContext />
      <HowItWorks />
      <Features />
    </main>
  );
}
