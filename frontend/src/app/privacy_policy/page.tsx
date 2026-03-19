"use client";

import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    body: "DevFolio stores the account and portfolio details you provide, including profile text, links, project entries, work history, and education details.",
  },
  {
    title: "How We Use Information",
    body: "Your information is used to authenticate your account, save drafts, render public portfolios when you choose to publish them, and support editing features like AI enhancement.",
  },
  {
    title: "Information Sharing",
    body: "We do not sell your data. Portfolio information is visible to others only when you explicitly make a portfolio public.",
  },
  {
    title: "Security and Control",
    body: "You can update your profile, change your password, and switch a portfolio between draft and public states directly from the product.",
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="shell-card rounded-[2.25rem] p-8 sm:p-10">
        <span className="eyebrow">Privacy policy</span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">How DevFolio handles your data</h1>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Last updated: February 6, 2026.
        </p>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-6">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-[color:var(--accent-soft)] p-6">
          <h3 className="text-lg font-semibold text-slate-950">Questions?</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            If you want clarification about anything here, the contact page is the quickest place to ask.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
