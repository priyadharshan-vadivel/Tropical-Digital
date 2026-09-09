"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#f3efe7]">
      <div className="hidden border-b border-[#cfc6b8] bg-[#e8e0d3] sm:block">
        <div className="container flex h-9 items-center justify-between">
          <span className="mono text-[#635d54]">Strategic Technology Consulting</span>
          <span className="mono text-[#635d54]">United Kingdom · India · United Arab Emirates</span>
        </div>
      </div>

      <div className="border-b border-[#cfc6b8] bg-[#f3efe7]/95 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold tracking-[-0.04em] text-[#25231f]">
            Tropical Digital
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
            {navigation.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm transition duration-200 ${
                    active ? "text-[#25231f] font-medium" : "text-[#635d54] hover:text-[#25231f]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded-full border border-[#25231f] px-5 py-2.5 text-sm font-medium transition hover:bg-[#25231f] hover:text-[#f3efe7] sm:inline-flex"
            >
              Talk to Us
            </Link>

            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#25231f] text-lg lg:hidden"
            >
              <span aria-hidden="true">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-b border-[#cfc6b8] bg-[#f3efe7] lg:hidden">
          <nav className="container flex flex-col py-5" aria-label="Mobile navigation">
            {navigation.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`border-b border-[#e3d8c9] py-3 text-base last:border-b-0 ${
                    active ? "font-semibold text-[#a45135]" : "text-[#25231f]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex w-fit rounded-full border border-[#25231f] px-5 py-2.5 text-sm font-medium"
            >
              Talk to Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
