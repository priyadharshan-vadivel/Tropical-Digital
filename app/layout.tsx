import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Tropical Digital | Strategic Technology Consulting",
    template: "%s | Tropical Digital",
  },
  description:
    "Strategic technology consulting, digital transformation and systems integration for government, public-sector and enterprise clients.",
  metadataBase: new URL("https://www.tropicaldigital.example"),
  openGraph: {
    title: "Tropical Digital",
    description:
      "Transforming Governments | Empowering Enterprises | Building Digital Nations",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[60] -translate-y-24 bg-[#25231f] px-5 py-3 text-sm font-medium text-[#f3efe7] transition focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
