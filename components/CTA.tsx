import Link from "next/link";

export function CTA() {
  return (
    <section className="container my-16">
      <div className="relative overflow-hidden border border-[#cfc6b8] bg-[#713b2b] px-6 py-12 text-[#fbf9f4] md:px-10 md:py-16">
        <div className="absolute -right-10 top-8 h-28 w-28 rounded-full border border-[#e7c8b1]/40" />
        <div className="absolute right-20 bottom-10 h-20 w-20 rounded-full border border-[#e7c8b1]/25" />

        <div className="relative max-w-3xl">
          <p className="mono text-[#f0d4bf]">Start a conversation</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
            Move from strategy to measurable outcomes.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#eadbd2]">
            Talk with Tropical Digital about digital transformation, secure infrastructure,
            intelligent platforms, integration, or managed operations.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-[#f3efe7] px-6 py-3 text-sm font-semibold text-[#25231f] transition hover:bg-[#fbf9f4]"
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </section>
  );
}
