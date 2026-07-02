import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import GoldenCircle from "@/components/GoldenCircle";
import Collections from "@/components/Collections";
import BoutiqueExperience from "@/components/BoutiqueExperience";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Purpose />
        <GoldenCircle />
        <BoutiqueExperience />
        <Collections />
      </main>
      <Footer />
    </>
  );
}
