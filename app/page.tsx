import ContactCta from "@/components/contact-cta";
import Footer from "@/components/footer";
import GrowthPartner from "@/components/growth-partner";
import Hero from "@/components/hero";
import Process from "@/components/process";
import ServiceCatalog from "@/components/service-catalog";
import Services from "@/components/services";
import SoundFamiliar from "@/components/sound-familiar";
import WhoWeAre from "@/components/who-we-are";
import WhyNexlytic from "@/components/why-nexlytic";

export default function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <SoundFamiliar />
      <Services />
      <WhyNexlytic />
      <Process />
      <GrowthPartner />
      <ServiceCatalog />
      <ContactCta />
      <Footer />
    </>
  );
}
