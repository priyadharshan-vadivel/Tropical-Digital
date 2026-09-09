import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-32">
      <p className="mono text-[#a45135]">404</p>
      <h1 className="mt-5 text-6xl font-semibold tracking-[-0.05em]">Page not found.</h1>
      <Link href="/" className="mt-8 inline-block border-b border-[#25231f] pb-1">Return home →</Link>
    </div>
  );
}
