import type { Metadata } from "next";
import Image from "next/image";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Insights",
  description: "Approved company updates, publications and case studies from Tropical Digital.",
};

export default function Insights() {
  return (
    <div className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionLabel>Insights</SectionLabel>
          <h1 className="reveal max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
            Ideas, research and technical perspectives.
          </h1>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden border border-[#cfc6b8]">
          <Image
            src="/images/insights-library.jpg"
            alt="Reading room, Boston Public Library"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-10 max-w-2xl border border-[#cfc6b8] bg-[#fbf9f4]">
        <div className="border-b border-[#cfc6b8] px-7 py-4">
          <p className="mono text-[#713b2b]">Coming soon</p>
        </div>
        <div className="p-7">
          <p className="leading-7 text-[#635d54]">
            This section is intentionally structured for approved future content. No fictional articles or thought
            leadership have been added.
          </p>
          <p className="mt-4 text-sm leading-6 text-[#8f8676]">
            Approved company updates, publications and case studies should be added here only after internal review.
          </p>
        </div>
      </div>
    </div>
  );
}
