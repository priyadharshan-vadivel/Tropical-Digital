import type { Metadata } from "next";
import Image from "next/image";
import { CTA } from "@/components/CTA";
import { SectionLabel } from "@/components/SectionLabel";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tropical Digital's company, vision, mission, corporate presence and approach to strategic technology consulting and digital transformation.",
};

export default function About() {
  return (
    <div className="container py-16">
      <SectionLabel>About Tropical Digital</SectionLabel>
      <h1 className="reveal max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5.5rem]">
        Strategic technology. Disciplined delivery. Measurable outcomes.
      </h1>

      <div className="mt-14 grid gap-14 md:grid-cols-[0.7fr_1.3fr] md:items-start">
        <div className="mono text-[#a45135]">Our approach</div>
        <div>
          <p className="text-2xl leading-10 text-[#25231f]">{company.overview}</p>
          <p className="mt-8 max-w-2xl text-base leading-8 text-[#635d54]">
            {company.approach} The intended outcomes include {company.outcomes.slice(0, -1).join(", ").toLowerCase()} and{" "}
            {company.outcomes[company.outcomes.length - 1].toLowerCase()}.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="relative aspect-[16/10] overflow-hidden border border-[#cfc6b8]">
          <Image
            src="/images/about-control-room.jpg"
            alt="Mission control room with rows of operators at monitoring consoles"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="border-l border-[#cfc6b8] pl-6">
          <p className="mono text-[#713b2b]">Operational discipline</p>
          <p className="mt-4 text-lg leading-8 text-[#25231f]">
            Engineering excellence and disciplined delivery, applied continuously — not just at go-live.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-px border border-[#cfc6b8] bg-[#cfc6b8] md:grid-cols-2">
        <div className="bg-[#e8e0d3] p-9">
          <SectionLabel>Vision</SectionLabel>
          <p className="text-2xl leading-9 text-[#25231f]">{company.vision}</p>
        </div>

        <div className="bg-[#f3efe7] p-9">
          <SectionLabel>Presence</SectionLabel>
          <p className="text-2xl leading-9 text-[#25231f]">
            Corporate office: {company.corporateOffice}. International presence: {company.internationalPresence.join(" and ")}.
          </p>
        </div>
      </div>

      <section className="mt-12 border-t border-[#cfc6b8] pt-10">
        <SectionLabel>Mission</SectionLabel>
        <div className="grid border-t border-[#cfc6b8]">
          {company.mission.map((item, index) => (
            <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#cfc6b8] py-5 md:grid-cols-[4rem_1fr]">
              <span className="mono text-[#a45135]">0{index + 1}</span>
              <p className="max-w-2xl text-lg leading-7 text-[#25231f]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <CTA />
    </div>
  );
}
