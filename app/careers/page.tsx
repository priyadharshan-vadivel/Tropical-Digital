import type { Metadata } from "next";
import Image from "next/image";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Careers",
  description: "Building technical capability through digital innovation at Tropical Digital.",
};

export default function Careers() {
  return (
    <div className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionLabel>Careers</SectionLabel>
          <h1 className="reveal max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-6xl">
            Build technical capability through digital innovation.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#635d54]">
            The company profile identifies employment and technical capability creation through digital innovation
            as part of its mission.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden border border-[#cfc6b8]">
          <Image
            src="/images/careers-team.jpg"
            alt="Team at work in a mission operations control room"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-10 max-w-2xl border border-[#cfc6b8] bg-[#fbf9f4]">
        <div className="border-b border-[#cfc6b8] px-7 py-4">
          <p className="mono text-[#713b2b]">No published vacancies at present</p>
        </div>
        <div className="p-7">
          <p className="leading-7 text-[#635d54]">
            Current vacancies, benefits, hiring process and recruitment contact require company-provided information
            before they can be published. This page is prepared to carry that content once it is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
