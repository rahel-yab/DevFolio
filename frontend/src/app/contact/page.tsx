"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Support",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="shell-card rounded-[2.25rem] p-8 sm:p-10">
          <span className="eyebrow">Contact DevFolio</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            Questions, feedback, or a rough edge you want fixed?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            Send a note and we’ll respond as quickly as we can. This page is still a lightweight demo form, but the flow is now aligned with the rest of the app.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoCard title="Email" copy="support@devfolio.io" />
            <InfoCard title="Location" copy="Addis Ababa, Ethiopia" />
            <InfoCard title="Support hours" copy="Monday to Friday, 9:00 AM to 6:00 PM EAT" />
            <InfoCard title="Best for" copy="Bug reports, product feedback, and account help" />
          </div>
        </section>

        <section className="shell-card rounded-[2.25rem] p-8 sm:p-10">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-slate-950">Message sent</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-700">
                Thanks for reaching out. We’ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                    Contact form
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">Tell us what’s on your mind</h2>
                </div>
                <Link href="/help_center" className="text-sm font-semibold text-[color:var(--accent-strong)]">
                  Help center
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                  />
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Subject</span>
                  <select
                    value={formData.subject}
                    onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                    className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                  >
                    <option>Support</option>
                    <option>Billing</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Message</span>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                    className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{copy}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
        required
      />
    </label>
  );
}
