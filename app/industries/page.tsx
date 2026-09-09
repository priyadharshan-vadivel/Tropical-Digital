import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Twelve sectors served by Tropical Digital, from government and healthcare to smart cities, manufacturing, transportation and energy.",
};

export default function Industries() {
  return (
    <>
      <div className="container pt-16">
        <SectionLabel>Industries</SectionLabel>
        <h1 className="reveal max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
          Digital capability shaped around the sectors we serve.
        </h1>

        <div className="mt-14 grid gap-px border border-[#cfc6b8] bg-[#cfc6b8] sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <article key={industry.title} className="bg-[#f3efe7] p-7">
              <span className="mono text-[#713b2b]">/{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{industry.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#635d54]">{industry.description}</p>
            </article>
          ))}
        </div>
      </div>

      <section className="relative mt-16 h-[50vh] min-h-[340px] max-h-[560px] overflow-hidden">
        <Image
          src="/images/industries-airport.jpg"
          alt="Interior of a modern airport terminal"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#25231f]/70 via-transparent to-transparent" />
        <div className="container relative flex h-full flex-col justify-end pb-8">
          <p className="mono text-[#f3efe7]/90">Airport & Aviation · Transportation</p>
          <p className="mt-2 max-w-lg text-lg leading-7 text-[#f3efe7]">
            The same discipline that keeps critical infrastructure running underpins every sector above.
          </p>
        </div>
      </section>

      <div className="container pb-16 pt-10">
        <p className="text-sm">
          <Link href="/contact" className="border-b border-[#a45135] pb-1 font-semibold text-[#25231f]">
            Discuss your sector →
          </Link>
        </p>
      </div>
    </>
  );
}
