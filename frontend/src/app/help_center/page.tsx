"use client";

import { useState } from "react";
import Link from "next/link";

const faqData = {
  "Getting Started": [
    {
      q: "How do I create my first portfolio?",
      a: "Choose a template, open the editor, fill in your profile and projects, then save your first draft from the editor screen.",
    },
    {
      q: "Can I keep a portfolio private while editing?",
      a: "Yes. New portfolios start as drafts, and you can publish them only when you toggle the public setting on.",
    },
    {
      q: "Do I need AI to use DevFolio?",
      a: "No. AI enhancement is optional. You can write everything manually and still publish a full portfolio.",
    },
  ],
  "Account & Profile": [
    {
      q: "How do I change my password?",
      a: "Open Settings, enter your current password, choose a new one, and save it from the password form.",
    },
    {
      q: "Where do I update my profile links?",
      a: "Open the Profile page to update your bio, phone, location, website, GitHub, and LinkedIn links.",
    },
  ],
  "Portfolio Editor": [
    {
      q: "Can I edit an existing portfolio?",
      a: "Yes. Open the dashboard and choose Edit on any draft or published portfolio to continue working.",
    },
    {
      q: "What does the AI enhancement button do?",
      a: "Right now it focuses on improving your summary. Save the portfolio first, then use the AI enhancement action in the editor.",
    },
  ],
  Publishing: [
    {
      q: "How do I share my portfolio publicly?",
      a: "Save the portfolio with the public toggle enabled. Once published, the dashboard will show an Open public page action.",
    },
    {
      q: "Can I turn a public portfolio back into a draft?",
      a: "Yes. Reopen it in the editor, disable the public toggle, and save again.",
    },
  ],
} as const;

const categories = Object.keys(faqData) as Array<keyof typeof faqData>;

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof faqData>("Getting Started");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="shell-card rounded-[2.25rem] p-8 sm:p-10">
        <span className="eyebrow">Help center</span>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Find the quickest path through the product</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              These answers reflect the current version of DevFolio, including the updated dashboard, editor, public portfolio pages, and settings flow.
            </p>
          </div>
          <Link href="/contact" className="text-sm font-semibold text-[color:var(--accent-strong)]">
            Contact support
          </Link>
        </div>

        <div className="mt-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search sections..."
            className="w-full rounded-[1.75rem] border border-[color:var(--line)] bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
          />
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="grid gap-4">
          {visibleCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-[1.75rem] border p-6 text-left transition ${
                activeCategory === category
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                  : "shell-card"
              }`}
            >
              <p className="text-lg font-semibold text-slate-950">{category}</p>
              <p className="mt-2 text-sm text-slate-700">{faqData[category].length} quick answers</p>
            </button>
          ))}
        </section>

        <section className="shell-card rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
            {activeCategory}
          </p>
          <div className="mt-6 space-y-5">
            {faqData[activeCategory].map((faq) => (
              <article key={faq.q} className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
                <h2 className="text-lg font-semibold text-slate-950">{faq.q}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{faq.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
