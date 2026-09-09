import Link from "next/link";
import { legalNavigation } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[#25231f] text-[#f3efe7]">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.04em]">Tropical Digital</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#d4c8bb]">
              Transforming Governments | Empowering Enterprises | Building Digital Nations
            </p>
          </div>

          <div>
            <p className="mono text-[#d1a58d]">Explore</p>
            <div className="mt-4 grid gap-3 text-sm text-[#d4c8bb]">
              <Link href="/about" className="transition hover:text-white">About</Link>
              <Link href="/services" className="transition hover:text-white">Services</Link>
              <Link href="/solutions" className="transition hover:text-white">Solutions</Link>
              <Link href="/industries" className="transition hover:text-white">Industries</Link>
              <Link href="/insights" className="transition hover:text-white">Insights</Link>
            </div>
          </div>

          <div>
            <p className="mono text-[#d1a58d]">Company</p>
            <div className="mt-4 grid gap-3 text-sm text-[#d4c8bb]">
              <Link href="/international" className="transition hover:text-white">International</Link>
              <Link href="/technology" className="transition hover:text-white">Technology</Link>
              <Link href="/careers" className="transition hover:text-white">Careers</Link>
              <Link href="/contact" className="transition hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <p className="mono text-[#d1a58d]">Legal</p>
            <div className="mt-4 grid gap-3 text-sm text-[#d4c8bb]">
              {legalNavigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#514b43] pt-6 text-xs text-[#a89a8b]">
          <p>© {year} Tropical Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
