import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility statement for the Tropical Digital website.",
};

export default function Accessibility() {
  return (
    <div className="container py-16">
      <SectionLabel>Accessibility</SectionLabel>
      <h1 className="reveal max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
        Built to WCAG 2.2 AA practices.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[#635d54]">
        This statement describes the accessibility approach taken in building the site. It has not undergone a
        formal third-party accessibility audit.
      </p>

      <div className="mt-12 grid border-t border-[#cfc6b8]">
        {[
          {
            heading: "Standard targeted",
            body: "The site is built to align with WCAG 2.2 AA practices: semantic HTML, keyboard navigation, visible focus states, sufficient color contrast, and reduced-motion support.",
          },
          {
            heading: "Keyboard and focus",
            body: "All interactive elements — navigation, forms, buttons — are reachable and operable by keyboard, with a visible focus outline and a skip-to-content link on every page.",
          },
          {
            heading: "Motion",
            body: "Entrance animation respects the operating system's reduced-motion preference and is used sparingly, without auto-playing video or parallax effects.",
          },
          {
            heading: "Images",
            body: "Photography includes descriptive alt text. Purely decorative graphics are marked so assistive technology skips them.",
          },
          {
            heading: "Known limitations",
            body: "This statement has not been independently audited. If you encounter an accessibility barrier, please describe it using the contact form so it can be reviewed.",
          },
          {
            heading: "Contact",
            body: "Accessibility feedback can be sent via the contact form, or to [accessibility contact email] once confirmed.",
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
