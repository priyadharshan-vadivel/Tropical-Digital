import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { technologyCapabilities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Tropical Digital's technology capability areas: AI, software engineering, cloud, cybersecurity, data, enterprise applications, infrastructure, IoT, GIS and building automation.",
};

export default function Technology() {
  return (
    <div className="container py-16">
      <SectionLabel>Technology</SectionLabel>
      <h1 className="reveal max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
        Technology as an enabler of secure digital transformation.
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <p className="max-w-xl text-lg leading-8 text-[#635d54]">
          Technology is presented here as capability rather than a vendor logo wall. Each area draws directly on the
          company&apos;s service catalogue — from cloud and data infrastructure to the security operations that keep
          it running.
        </p>
        <div className="relative aspect-[16/10] overflow-hidden border border-[#cfc6b8]">
          <Image
            src="/images/technology-datacenter.jpg"
            alt="Rows of server racks in a data centre"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden border border-[#cfc6b8] bg-[#cfc6b8] sm:grid-cols-2">
        {technologyCapabilities.map((tech, index) => (
          <article key={tech.title} className="bg-[#f3efe7] p-7">
            <span className="mono text-[#713b2b]">0{index + 1}</span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{tech.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#635d54]">{tech.description}</p>
          </article>
        ))}
      </div>

      <p className="mt-10 text-sm">
        <Link href="/contact" className="border-b border-[#a45135] pb-1 font-semibold text-[#25231f]">
          Discuss a technology area →
        </Link>
      </p>
    </div>
  );
}
