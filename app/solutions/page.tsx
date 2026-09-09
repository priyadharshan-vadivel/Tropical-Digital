import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Outcome-oriented solutions from Tropical Digital: digital government, enterprise transformation, AI and automation, cyber resilience, citizen experience, smart cities, digital health and smart logistics.",
};

export default function Solutions() {
  return (
    <div className="container py-16">
      <SectionLabel>Solutions</SectionLabel>
      <h1 className="reveal max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
        Start with the outcome. Connect the capability.
      </h1>

      <div className="mt-14 grid gap-px overflow-hidden border border-[#cfc6b8] bg-[#cfc6b8] md:grid-cols-2">
        {solutions.map((solution, index) => (
          <article key={solution.title} className="bg-[#f3efe7] p-8">
            <span className="mono text-[#713b2b]">0{index + 1}</span>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{solution.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#635d54]">{solution.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-px overflow-hidden border border-[#cfc6b8] bg-[#cfc6b8] md:grid-cols-2">
        <div className="relative aspect-[4/3]">
          <Image
            src="/images/solutions-hospital.jpg"
            alt="Digital radiography system in a hospital radiology room"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#25231f]/75 to-transparent p-5">
            <p className="mono text-[#f3efe7]/85">Digital Health</p>
          </div>
        </div>
        <div className="relative aspect-[4/3]">
          <Image
            src="/images/solutions-port.jpg"
            alt="Container cranes at a port terminal, Hamburg"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#25231f]/75 to-transparent p-5">
            <p className="mono text-[#f3efe7]/85">Smart Logistics and Infrastructure</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/contact" className="border-b border-[#a45135] pb-1 font-semibold text-[#25231f]">
          Talk through a specific outcome →
        </Link>
      </p>
    </div>
  );
}
