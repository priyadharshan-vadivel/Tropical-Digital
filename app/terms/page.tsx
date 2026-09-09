import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Draft terms of use template for the Tropical Digital website, pending legal and company review.",
  robots: { index: false, follow: true },
};

export default function Terms() {
  return (
    <div className="container py-16">
      <SectionLabel>Terms of Use</SectionLabel>
      <h1 className="reveal max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
        Draft template — not yet legally approved.
      </h1>

      <div className="mt-8 max-w-2xl border border-[#cfc6b8] bg-[#fbf9f4] p-6">
        <p className="mono text-[#713b2b]">Status — draft</p>
        <p className="mt-3 text-sm leading-6 text-[#635d54]">
          This page is a structural placeholder pending legal review. It does not constitute an approved or binding
          set of terms until completed and confirmed by Tropical Digital.
        </p>
      </div>

      <div className="mt-12 grid border-t border-[#cfc6b8]">
        {[
          {
            heading: "About this site",
            body: "This website is operated by [legal company name], registered at [registered address].",
          },
          {
            heading: "Use of content",
            body: "Content on this website is provided for general information about Tropical Digital's services and capabilities. It should not be relied upon as a substitute for a signed commercial agreement or statement of work.",
          },
          {
            heading: "No guaranteed availability",
            body: "Services described on this website (including capabilities, solutions and technology areas) reflect the company's offering but do not constitute a guarantee of availability in every market or engagement.",
          },
          {
            heading: "Intellectual property",
            body: "The Tropical Digital name and website content are the property of [legal company name] except where a third-party source (such as image credits) is separately attributed.",
          },
          {
            heading: "Liability",
            body: "[Liability and disclaimer wording to be confirmed by legal counsel].",
          },
          {
            heading: "Governing law",
            body: "[Governing law and jurisdiction to be confirmed].",
          },
          {
            heading: "Contact",
            body: "Questions about these terms can be directed to [legal contact email], once confirmed.",
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
