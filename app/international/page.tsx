import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { internationalPresence } from "@/lib/content";

export const metadata: Metadata = {
  title: "International",
  description:
    "Tropical Digital's UK corporate office, current presence in India and the United Arab Emirates, and strategic international expansion plan.",
};

// Projects real-world latitude/longitude onto an equirectangular (plate carrée) map as a
// percentage position. Correct only for true equirectangular base maps spanning the full
// globe (lon -180..180, lat -90..90) — see /images/international-worldmap.svg.
function project(lat: number, lon: number) {
  return { x: ((lon + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
}

const markers = [
  { label: "United Kingdom", ...project(55.3781, -3.436) },
  { label: "India", ...project(20.5937, 78.9629) },
  { label: "United Arab Emirates", ...project(23.4241, 53.8478) },
];

export default function International() {
  return (
    <div className="container py-16">
      <SectionLabel>International</SectionLabel>
      <h1 className="reveal max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
        A UK corporate base. India and UAE presence. A wider expansion strategy.
      </h1>

      <div className="mt-14 grid gap-px border border-[#cfc6b8] bg-[#cfc6b8] md:grid-cols-2">
        <div className="bg-[#e8e0d3] p-9">
          <SectionLabel>Current</SectionLabel>
          <p className="text-3xl leading-tight">{internationalPresence.corporateOffice}</p>
          <p className="mt-3 text-[#635d54]">Corporate office</p>
          <p className="mt-8 text-3xl leading-tight">{internationalPresence.currentPresence.join(" + ")}</p>
          <p className="mt-3 text-[#635d54]">International presence</p>
        </div>

        <div className="bg-[#f3efe7] p-9">
          <SectionLabel>Strategic regions</SectionLabel>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {internationalPresence.strategicRegions.map((region) => (
              <span key={region} className="mono text-[#4e4a43]">
                {region}
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-[#635d54]">
            These are strategic target regions from the company profile, not automatically current offices.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden border border-[#cfc6b8] bg-[#cfc6b8] lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative bg-[#e8e0d3] p-6 md:p-9">
          <p className="mono text-[#713b2b]">Current presence</p>
          <div className="relative mt-6 w-full" style={{ aspectRatio: "2520.631 / 1260.315" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/international-worldmap.svg"
              alt="World map with markers for the United Kingdom, India and the United Arab Emirates"
              className="absolute inset-0 h-full w-full opacity-80"
            />
            {markers.map((marker) => (
              <div
                key={marker.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <span className="block h-2.5 w-2.5 rounded-full bg-[#a45135] ring-4 ring-[#a45135]/25" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {markers.map((marker) => (
              <span key={marker.label} className="mono flex items-center gap-2 text-[#4e4a43]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a45135]" />
                {marker.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[240px] lg:min-h-0">
          <Image
            src="/images/international-dubai.jpg"
            alt="Dubai skyline from Business Bay, United Arab Emirates"
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#25231f]/75 to-transparent p-5">
            <p className="mono text-[#f3efe7]/85">Dubai, UAE</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border border-[#cfc6b8] bg-[#fbf9f4] p-9">
        <p className="mono text-[#713b2b]">Implementation strategy</p>
        <div className="mt-6 grid gap-10 border-t border-[#cfc6b8] pt-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Phase I · Years 1–2</h2>
            <p className="mt-3 leading-7 text-[#635d54]">{internationalPresence.phaseOne}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Phase II · Years 3–6</h2>
            <p className="mt-3 leading-7 text-[#635d54]">{internationalPresence.phaseTwo}</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/contact" className="border-b border-[#a45135] pb-1 font-semibold text-[#25231f]">
          Discuss international delivery →
        </Link>
      </p>
    </div>
  );
}
