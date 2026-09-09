import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";
import { imageCredits } from "@/lib/content";

export const metadata: Metadata = {
  title: "Image Credits",
  description: "Sources, photographers and licenses for photography used across the Tropical Digital website.",
};

export default function ImageCredits() {
  return (
    <div className="container py-16">
      <SectionLabel>Image credits</SectionLabel>
      <h1 className="reveal max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-[5rem]">
        Photography sources and licenses.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[#635d54]">
        Every photograph on this site is real documentary or editorial photography, sourced from Wikimedia Commons
        under a public domain or Creative Commons license. No AI-generated imagery is used.
      </p>

      <div className="mt-14 grid border-t border-[#cfc6b8] sm:grid-cols-2">
        {imageCredits.map((credit) => (
          <div key={credit.src} className="border-b border-[#cfc6b8] py-6 pr-6">
            <p className="mono text-[#a45135]">{credit.page}</p>
            <p className="mt-3 text-lg font-medium text-[#25231f]">{credit.caption}</p>
            <p className="mt-2 text-sm leading-6 text-[#635d54]">
              &ldquo;{credit.title}&rdquo; by {credit.author} — {credit.license}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={credit.source} className="underline underline-offset-2 hover:text-[#a45135]" target="_blank" rel="noopener noreferrer">
                Source
              </a>
              <a href={credit.licenseUrl} className="underline underline-offset-2 hover:text-[#a45135]" target="_blank" rel="noopener noreferrer">
                License
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
