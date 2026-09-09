import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Draft privacy policy template for the Tropical Digital website, pending legal and company review.",
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return (
    <div className="container py-16">
      <SectionLabel>Privacy Policy</SectionLabel>
      <h1 className="reveal max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
        Draft template — not yet legally approved.
      </h1>

      <div className="mt-8 max-w-2xl border border-[#cfc6b8] bg-[#fbf9f4] p-6">
        <p className="mono text-[#713b2b]">Status — draft</p>
        <p className="mt-3 text-sm leading-6 text-[#635d54]">
          This page is a structural placeholder. It has not been reviewed by Tropical Digital&apos;s legal team and
          must not be treated as an approved or binding privacy notice until the bracketed fields below are completed
          and the page is formally approved.
        </p>
      </div>

      <div className="mt-12 grid border-t border-[#cfc6b8]">
        {[
          {
            heading: "Data controller",
            body: "[Legal company name], registered at [registered address], is the data controller for information collected through this website.",
          },
          {
            heading: "What we collect",
            body: "Information submitted through the contact form (name, work email, organisation, area of interest, message) and standard technical data collected by the hosting and analytics infrastructure in use, if any.",
          },
          {
            heading: "Lawful basis",
            body: "[Lawful basis for processing enquiry data — e.g. legitimate interest in responding to business enquiries — to be confirmed].",
          },
          {
            heading: "Retention",
            body: "[Retention period for enquiry records to be confirmed].",
          },
          {
            heading: "Your rights",
            body: "Depending on your jurisdiction, you may have rights to access, correct, or request deletion of your personal data. Contact details for exercising these rights: [data protection contact email/address].",
          },
          {
            heading: "Third parties",
            body: "Contact form submissions are transmitted through a transactional email provider (Resend) for delivery to Tropical Digital's inbox. No data is sold to third parties.",
          },
          {
            heading: "Contact",
            body: "Questions about this policy can be directed to [privacy contact email], once confirmed.",
          },
        ].map((section) => (
          <div key={section.heading} className="grid gap-2 border-b border-[#cfc6b8] py-6 md:grid-cols-[0.3fr_0.7fr] md:gap-8">
            <h2 className="text-lg font-semibold text-[#25231f]">{section.heading}</h2>
            <p className="max-w-2xl text-sm leading-7 text-[#635d54]">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
