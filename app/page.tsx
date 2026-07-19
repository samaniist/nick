import ContactCta from "@/components/contact-cta";
import Footer from "@/components/footer";
import GlobeBackground from "@/components/globe-background";
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
      {/* one dark stage for the contact section + footer, with the dotted
          globe rising behind both */}
      <div className="relative z-30 overflow-hidden bg-black">
        <GlobeBackground />
        <ContactCta />
        <Footer />
      </div>
    </>
  );
}
