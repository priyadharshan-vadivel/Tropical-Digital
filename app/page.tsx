import Image from "next/image";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { SectionLabel } from "@/components/SectionLabel";
import {
  company,
  industries,
  internationalPresence,
  serviceFamilies,
  solutions,
  strategicInitiatives,
  technologyCapabilities,
} from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="container relative overflow-hidden pt-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="reveal">
            <SectionLabel>Strategic Technology Consulting</SectionLabel>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[5.5rem]">
              Transforming Governments.
              <br />
              Empowering Enterprises.
              <br />
              <span className="text-[#a45135]">Building Digital Nations.</span>
            </h1>
          </div>

          <div className="reveal relative min-h-[280px] overflow-hidden border border-[#cfc6b8] [animation-delay:120ms] lg:min-h-0">
            <Image
              src="/images/home-hero.jpg"
              alt="Marina Bay skyline at night, Singapore"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#25231f]/80 to-transparent p-5">
              <p className="mono text-[#f3efe7]/85">Marina Bay, Singapore</p>
            </div>
          </div>
        </div>

        <div className="reveal mt-8 max-w-2xl border-t border-[#cfc6b8] pt-6 [animation-delay:180ms]">
          <p className="text-lg leading-8 text-[#635d54]">{company.descriptor}.</p>
          <p className="mt-4 text-sm leading-7 text-[#635d54]">
            Tropical Digital works with government, public-sector and enterprise clients across India and international markets.
          </p>
          <Link href="/services" className="mt-6 inline-block border-b border-[#a45135] pb-1 text-sm font-semibold">
            Explore capabilities →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 border-t border-[#cfc6b8] pt-6 sm:grid-cols-3 sm:gap-8">
          {[
            ["01", "Digital Government"],
            ["02", "AI & Intelligent Automation"],
            ["03", "Cybersecurity & Managed Operations"],
          ].map(([n, item]) => (
            <div
              key={item}
              className="flex items-baseline gap-3 pt-6 first:pt-0 sm:border-l sm:border-[#cfc6b8] sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
            >
              <span className="mono text-[#a45135]">{n}</span>
              <span className="mono text-[#635d54]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <SectionLabel>01 / The company</SectionLabel>
          </div>
          <div>
            <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
              From strategy to production, and from production to measurable operational outcomes.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#635d54]">{company.approach}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#e8e0d3] py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-8">
            <div>
              <SectionLabel>02 / Capabilities</SectionLabel>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">What we do</h2>
            </div>
            <Link href="/services" className="hidden border-b border-[#25231f] pb-1 text-sm md:block">
              View all services →
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden border border-[#cfc6b8] bg-[#cfc6b8] md:grid-cols-2 lg:grid-cols-3">
            {serviceFamilies.map((family, index) => (
              <article key={family.title} className="min-h-60 bg-[#e8e0d3] p-7 transition hover:bg-[#f3efe7]">
                <p className="mono text-[#713b2b]">0{index + 1}</p>
                <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">{family.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#635d54]">{family.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[46vh] min-h-[320px] max-h-[520px] overflow-hidden">
        <Image
          src="/images/home-infrastructure.jpg"
          alt="Aerial view of an illuminated urban highway interchange at night"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#25231f]/35" />
        <div className="container relative flex h-full items-end pb-8">
          <p className="mono text-[#f3efe7]/90">Connected infrastructure, at national scale</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <SectionLabel>03 / Solutions</SectionLabel>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Built around outcomes.</h2>
          </div>

          <div className="grid border-t border-[#cfc6b8]">
            {solutions.map((solution, index) => (
              <Link
                key={solution.title}
                href="/solutions"
                className="group flex items-center justify-between gap-6 border-b border-[#cfc6b8] py-5 text-xl"
              >
                <span>
                  <span className="mono mr-4 text-[#a45135]">0{index + 1}</span>
                  {solution.title}
                </span>
                <span className="text-2xl transition-transform group-hover:translate-x-1">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#25231f] py-20 text-[#f3efe7]">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <SectionLabel>04 / Industries</SectionLabel>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Technology where the stakes are real.
              </h2>
            </div>

            <div className="grid gap-x-10 border-t border-[#514b43] sm:grid-cols-2">
              {industries.map((industry, index) => (
                <Link
                  key={industry.title}
                  href="/industries"
                  className="border-b border-[#514b43] py-4 text-[#d7cec2] transition hover:text-white"
                >
                  <span className="mono mr-4 text-[#c9a58f]">/{String(index + 1).padStart(2, "0")}</span>
                  {industry.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-end justify-between gap-8">
          <div>
            <SectionLabel>05 / Technology</SectionLabel>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Capability, not a vendor logo wall.
            </h2>
          </div>
          <Link href="/technology" className="hidden border-b border-[#25231f] pb-1 text-sm md:block">
            View technology →
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#cfc6b8] pt-6">
          {technologyCapabilities.map((tech) => (
            <span key={tech.title} className="mono border-b border-transparent pb-1 text-[#4e4a43] hover:border-[#a45135]">
              {tech.title}
            </span>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="grid overflow-hidden border border-[#cfc6b8] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-[#fbf9f4] p-8 md:p-10 lg:p-12">
            <SectionLabel>06 / International</SectionLabel>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              A UK corporate base with presence across India and the United Arab Emirates.
            </h2>
            <p className="mt-6 max-w-2xl leading-7 text-[#635d54]">
              The company profile also identifies strategic expansion across {internationalPresence.strategicRegions.join(", ")}.
            </p>
            <Link href="/international" className="mt-8 inline-block border-b border-[#a45135] pb-1 text-sm font-semibold">
              Explore international operations →
            </Link>
          </div>

          <div className="relative min-h-[220px] lg:min-h-0">
            <Image
              src="/images/home-london.jpg"
              alt="City of London skyline"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#25231f]/75 to-transparent p-5">
              <p className="mono text-[#f3efe7]/85">UK · IN · AE</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <SectionLabel>07 / Strategic initiatives</SectionLabel>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Focus areas and growth direction.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#635d54]">
              Strategic initiatives represent focus areas the company profile identifies for future growth. They are not
              guaranteed current commercial products.
            </p>
          </div>

          <div className="grid border-t border-[#cfc6b8]">
            {strategicInitiatives.map((initiative) => (
              <div
                key={initiative.name}
                className="grid gap-2 border-b border-[#cfc6b8] py-6 md:grid-cols-[1fr_1fr] md:gap-8"
              >
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{initiative.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#635d54]">{initiative.focus}</p>
                </div>
                <p className="mono self-start text-[#a45135] md:text-right">{initiative.regions.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
