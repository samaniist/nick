import type { Metadata } from "next";

import ContactExperience from "@/components/contact/contact-experience";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start your project with Nexlytic. Tell us about your goals and we'll reply within one business day — web design, SEO and performance marketing from Munich.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactExperience />
      <Footer />
    </>
  );
}
