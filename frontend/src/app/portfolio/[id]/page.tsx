"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiService, Portfolio } from "../../../services/api";

export default function PublicPortfolioPage() {
  const params = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve(params.id)
      .then(async (id) => apiService.getPortfolio(id))
      .then((data) => {
        if (isMounted) {
          setPortfolio(data);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load portfolio.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="shell-card rounded-[2rem] p-10">
          <h1 className="text-3xl font-semibold text-slate-950">This portfolio is not available</h1>
          <p className="mt-3 text-slate-700">{error}</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="shell-card rounded-[2.5rem] p-8 sm:p-10">
        <header className="border-b border-[color:var(--line)] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
            Public portfolio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{portfolio.name}</h1>
          <p className="mt-2 text-xl text-slate-700">{portfolio.title}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            {portfolio.email && <span>{portfolio.email}</span>}
            {portfolio.location && <span>{portfolio.location}</span>}
            {portfolio.website && (
              <a href={portfolio.website} target="_blank" rel="noreferrer" className="text-[color:var(--accent-strong)] underline-offset-4 hover:underline">
                Website
              </a>
            )}
            {portfolio.github && (
              <a href={portfolio.github} target="_blank" rel="noreferrer" className="text-[color:var(--accent-strong)] underline-offset-4 hover:underline">
                GitHub
              </a>
            )}
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8">
            {portfolio.bio && (
              <div>
                <h2 className="text-lg font-semibold text-slate-950">About</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{portfolio.bio}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-slate-950">Projects</h2>
              <div className="mt-4 space-y-4">
                {portfolio.projects.length === 0 ? (
                  <p className="text-sm text-slate-600">No public projects added yet.</p>
                ) : (
                  portfolio.projects.map((project) => (
                    <article key={`${project.name}-${project.link}`} className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-slate-950">{project.name}</h3>
                        <div className="flex gap-3 text-sm">
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="text-[color:var(--accent-strong)]">
                              Demo
                            </a>
                          )}
                          {project.github_link && (
                            <a href={project.github_link} target="_blank" rel="noreferrer" className="text-[color:var(--accent-strong)]">
                              Source
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{project.description}</p>
                      {project.tech_stack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tech_stack.map((tech) => (
                            <span key={tech} className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-strong)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolio.skills.length === 0 ? (
                  <p className="text-sm text-slate-600">No skills listed.</p>
                ) : (
                  portfolio.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold text-slate-800">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">Experience</h2>
              <div className="mt-4 space-y-4">
                {portfolio.experience.length === 0 ? (
                  <p className="text-sm text-slate-600">No experience added yet.</p>
                ) : (
                  portfolio.experience.map((item) => (
                    <article key={`${item.company}-${item.role}`} className="rounded-[1.25rem] border border-[color:var(--line)] bg-white/80 p-4">
                      <p className="font-semibold text-slate-950">{item.role}</p>
                      <p className="text-sm text-[color:var(--accent-strong)]">{item.company}</p>
                      {item.description && <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>}
                    </article>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
