import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SectionLabel } from "@/components/SectionLabel";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Tropical Digital about digital transformation and technology consulting.",
};

export default function Contact() {
  return (
    <div className="container py-16">
      <SectionLabel>Contact</SectionLabel>
      <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div>
          <h1 className="reveal max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
            Start a conversation.
          </h1>
          <p className="mt-8 max-w-xl leading-8 text-[#635d54]">
            Use the form to send an enquiry directly to Tropical Digital, or write to us at{" "}
            <a href={`mailto:${company.contactEmail}`} className="border-b border-[#a45135] font-medium text-[#25231f]">
              {company.contactEmail}
            </a>
            .
          </p>

          <div className="mt-10 border-t border-[#cfc6b8] pt-6">
            <p className="mono text-[#713b2b]">Corporate presence</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#635d54]">
              Corporate office: {company.corporateOffice}. International presence: {company.internationalPresence.join(" and ")}.
            </p>
          </div>

          <div className="mt-8 border-t border-[#cfc6b8] pt-6">
            <p className="mono text-[#713b2b]">Before you write</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#635d54]">
              Share what you are working on, which capability area is relevant, and where your organisation is
              based — it helps route the right response.
            </p>
          </div>

          <div className="mt-8 border-t border-[#cfc6b8] pt-6">
            <p className="mono text-[#713b2b]">Privacy</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#635d54]">
              Details submitted through this form are used only to respond to your enquiry. See the{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#25231f]">
                privacy notice
              </Link>{" "}
              for more.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
