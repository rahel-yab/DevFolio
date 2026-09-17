"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

const features = [
  ["01", "Start with your work", "Add the projects, roles, and skills you are proud of. Everything stays editable."],
  ["02", "Shape the story", "Use the focused editor and AI assist to make the important details clear and credible."],
  ["03", "Share when ready", "Keep a draft private while you work, then publish a link you can send anywhere."],
];

export default function HomePage() {
  const { user } = useAuth();
  const previewName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Your Name";
  const previewTitle = user?.bio || "Your professional title";

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:gap-16">
          <div>
            <span className="eyebrow"><span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />Built for developer portfolios</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Your work deserves a <span className="text-[color:var(--accent-strong)]">better home.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              DevFolio is the calm, practical workspace for turning your experience into a portfolio that is clear, personal, and ready to share.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/templates" className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)]">
                Build your portfolio <span aria-hidden="true">→</span>
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-white">
                Open dashboard
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-600">Private by default. Publish only when you are ready.</p>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 -z-10 rounded-[2.75rem] bg-white/45 blur-2xl" />
            <div className="shell-card rounded-[2rem] p-4 sm:p-6">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#163b36] p-6 text-white sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-teal-100"><span className="h-2 w-2 rounded-full bg-emerald-300" />Portfolio preview</div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">Published</span>
                </div>
                <div className="mt-12">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-200 to-amber-100" />
                  <p className="mt-5 text-3xl font-semibold tracking-tight">{previewName}</p>
                  <p className="mt-2 text-teal-100">{previewTitle}</p>
                </div>
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-teal-100">Featured work</p><p className="mt-2 font-semibold">04 projects</p></div>
                  <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-teal-100">Core stack</p><p className="mt-2 font-semibold">React · Go · AI</p></div>
                </div>
              </div>
              <div className="grid gap-3 pt-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-4"><p className="text-xs font-medium text-slate-500">Draft status</p><p className="mt-1 text-sm font-semibold text-slate-900">Everything saved</p></div>
                <div className="rounded-2xl bg-[color:var(--accent-soft)] p-4"><p className="text-xs font-medium text-teal-800">Next step</p><p className="mt-1 text-sm font-semibold text-teal-950">Share your link</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] bg-white/45">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl"><span className="eyebrow">One focused workflow</span><h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Less time formatting. More time showing what you can do.</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map(([number, title, copy]) => (
              <article key={number} className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-950/5">
                <p className="text-sm font-semibold text-[color:var(--accent-strong)]">{number}</p>
                <h3 className="mt-8 text-xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[color:var(--foreground)] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-200">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Make the work you have done easy to see.</h2>
          <Link href="/templates" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-teal-50">Choose a template →</Link>
        </div>
      </section>
    </main>
  );
}
