import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Draft cookie policy template for the Tropical Digital website, pending legal and company review.",
  robots: { index: false, follow: true },
};

export default function CookiePolicy() {
  return (
    <div className="container py-16">
      <SectionLabel>Cookie Policy</SectionLabel>
      <h1 className="reveal max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
        Draft template — not yet legally approved.
      </h1>

      <div className="mt-8 max-w-2xl border border-[#cfc6b8] bg-[#fbf9f4] p-6">
        <p className="mono text-[#713b2b]">Status — draft</p>
        <p className="mt-3 text-sm leading-6 text-[#635d54]">
          This page is a structural placeholder pending legal review and a technical audit of any cookies or similar
          storage technologies actually in use.
        </p>
      </div>

      <div className="mt-12 grid border-t border-[#cfc6b8]">
        {[
          {
            heading: "Current state",
            body: "As implemented, this website does not set analytics, advertising or tracking cookies. No cookie-consent banner is currently required.",
          },
          {
            heading: "If this changes",
            body: "Should analytics, session storage, or any tracking technology be added in future, this page must be updated first, along with an appropriate consent mechanism where required by law.",
          },
          {
            heading: "Essential technical storage",
            body: "[To confirm: whether any strictly necessary technical storage — e.g. for hosting or security — is in use, and disclose it here].",
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
