import Image from "next/image";
import Link from "next/link";

const templates = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "A calm, editorial layout that keeps the focus on outcomes and clarity.",
    image: "/temp1.webp",
    features: ["Best for full-stack", "Clean hierarchy", "Fast to scan"],
  },
  {
    id: "creative-grid",
    name: "Creative Grid",
    description: "Project-forward composition with a little more visual rhythm for frontend and design-heavy work.",
    image: "/temp2.webp",
    features: ["Project showcase", "Visual balance", "Great for product builders"],
  },
  {
    id: "classic-profile",
    name: "Classic Profile",
    description: "A structured, recruiter-friendly format that reads well on first pass.",
    image: "/temp3.webp",
    features: ["Recruiter friendly", "Conservative layout", "Strong for job search"],
  },
  {
    id: "story-column",
    name: "Story Column",
    description: "A portfolio page with more room for narrative, context, and featured work.",
    image: "/temp4.webp",
    features: ["Narrative friendly", "Public portfolio feel", "Featured project focus"],
  },
];

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 space-y-4">
        <span className="eyebrow">Pick a starting point</span>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Templates that give your work room to breathe
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-700">
          Each template uses the same editing flow underneath, so you can start fast and switch direction without rewriting your content.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="shell-card overflow-hidden rounded-[2rem]">
            <div className="grid gap-6 p-6 md:grid-cols-[0.95fr_1.05fr] md:p-8">
              <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-white">
                <Image
                  src={template.image}
                  alt={`${template.name} preview`}
                  width={900}
                  height={700}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                      Template
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">{template.name}</h2>
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-strong)]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/editor?template=${template.id}`}
                    className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
                  >
                    Use this template
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Go to dashboard
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
