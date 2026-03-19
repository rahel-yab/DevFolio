import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-[rgba(20,35,30,0.95)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-lg font-semibold">DevFolio</p>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            Build a strong first impression with cleaner writing, sharper project storytelling, and a portfolio workflow that stays focused on what matters.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Product</p>
          <Link href="/templates" className="block text-sm text-slate-200 transition hover:text-white">
            Templates
          </Link>
          <Link href="/dashboard" className="block text-sm text-slate-200 transition hover:text-white">
            Dashboard
          </Link>
          <Link href="/editor" className="block text-sm text-slate-200 transition hover:text-white">
            Editor
          </Link>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Support</p>
          <Link href="/help_center" className="block text-sm text-slate-200 transition hover:text-white">
            Help Center
          </Link>
          <Link href="/contact" className="block text-sm text-slate-200 transition hover:text-white">
            Contact
          </Link>
          <Link href="/privacy_policy" className="block text-sm text-slate-200 transition hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} DevFolio. Built for polished developer portfolios.
      </div>
    </footer>
  );
}
