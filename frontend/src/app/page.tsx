import Link from "next/link";

const highlights = [
  {
    title: "Write sharper project stories",
    copy: "Turn rough notes into concise, credible portfolio copy that sounds like you, not a template.",
  },
  {
    title: "Edit in one clear workspace",
    copy: "Profile data, projects, skills, and publish settings live in one flow so you are not hopping across disconnected screens.",
  },
  {
    title: "Publish when you are ready",
    copy: "Keep work private while drafting, then share a public portfolio link as soon as the story is ready.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="eyebrow">AI-assisted editing for developer portfolios</span>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Build a portfolio that feels polished, personal, and ready to ship.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-700">
                DevFolio helps you shape your profile, organize your projects, and refine your writing without losing your own voice.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/templates"
                className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
              >
                Start with a template
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-[color:var(--line)] bg-white/80 px-6 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-white"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="shell-card rounded-[2rem] p-6 sm:p-8">
            <div className="rounded-[1.5rem] bg-[color:var(--surface-strong)] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--accent-strong)]">Live editing workflow</p>
                  <p className="text-sm text-slate-600">From draft to public portfolio</p>
                </div>
                <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-strong)]">
                  Preview ready
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-[color:var(--line)] bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">Professional summary</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    AI enhancement can tighten language, sharpen outcomes, and remove filler before you publish.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[color:var(--line)] bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">Projects</p>
                    <p className="mt-2 text-sm text-slate-600">Highlight what you built, the stack, and why it mattered.</p>
                  </div>
                  <div className="rounded-3xl border border-[color:var(--line)] bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">Publishing</p>
                    <p className="mt-2 text-sm text-slate-600">Keep drafts private until the public link is ready to share.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="shell-card rounded-[1.75rem] p-6">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
