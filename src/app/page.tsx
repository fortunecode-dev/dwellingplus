import ContactSection from "@/components/Contact";
import FAQSection from "@/components/FAQs";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <FAQSection/>
      <ContactSection/>
    </>

  );
}
