import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { serviceFamilies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "17 capabilities grouped into six service families: digital government, AI and data, cybersecurity, enterprise technology, smart infrastructure and sector platforms.",
};

export default function Services() {
  return (
    <div className="container py-16">
      <SectionLabel>Services</SectionLabel>
      <h1 className="reveal max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
        17 capabilities. One accountable transformation model.
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden border border-[#cfc6b8]">
          <Image
            src="/images/services-underground.jpg"
            alt="Platform at Monument Underground station, London"
            fill
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="object-cover"
          />
        </div>
        <p className="max-w-2xl text-lg leading-8 text-[#635d54]">
          The website groups the company&apos;s 17 underlying capabilities into six navigable service families.
          The grouping is for clarity and does not replace the source capability catalogue — delivery spans
          strategy, platforms, integration and the systems that keep public and enterprise services running.
        </p>
      </div>

      <div className="mt-14 space-y-px border-y border-[#cfc6b8] bg-[#cfc6b8]">
        {serviceFamilies.map((family, index) => (
          <section key={family.title} className="grid gap-6 bg-[#f3efe7] p-8 md:grid-cols-[0.25fr_0.75fr] md:p-10">
            <div>
              <p className="mono text-[#713b2b]">0{index + 1}</p>
              <p className="mono mt-3 text-[#8f8676]">{family.items.length} capabilities</p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.035em]">{family.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#635d54]">{family.description}</p>
              <ul className="mt-6 grid gap-2 text-sm text-[#4e4a43] md:grid-cols-2">
                {family.items.map((item) => (
                  <li key={item} className="border-l-2 border-[#c9a58f] pl-3 leading-6">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm">
        <Link href="/contact" className="border-b border-[#a45135] pb-1 font-semibold text-[#25231f]">
          Discuss a specific capability with us →
        </Link>
      </p>
    </div>
  );
}
