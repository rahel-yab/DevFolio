"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { portfolios, isLoading, error, fetchUserPortfolios, deletePortfolio } = usePortfolio();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserPortfolios();
    }
  }, [authLoading, fetchUserPortfolios, isAuthenticated]);

  const stats = useMemo(() => {
    const published = portfolios.filter((portfolio) => portfolio.is_public).length;
    return {
      total: portfolios.length,
      published,
      drafts: portfolios.length - published,
    };
  }, [portfolios]);

  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
          <p className="mt-4 text-sm text-slate-600">Loading your workspace...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="shell-card rounded-[2rem] p-10">
          <h1 className="text-3xl font-semibold text-slate-950">Sign in to manage your portfolios</h1>
          <p className="mt-3 text-slate-700">Your dashboard is ready once you log in.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="shell-card rounded-[2rem] p-8">
          <span className="eyebrow">Workspace overview</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            Welcome back, {user?.first_name}.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            Keep drafts private while you iterate, then publish the version you are comfortable sharing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/templates"
              className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
            >
              Create a new portfolio
            </Link>
            <Link
              href="/profile"
              className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Update profile
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { label: "Total portfolios", value: stats.total },
            { label: "Published", value: stats.published },
            { label: "Drafts", value: stats.drafts },
          ].map((item) => (
            <div key={item.label} className="shell-card rounded-[1.5rem] p-6">
              <p className="text-sm text-slate-600">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 shell-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Your portfolios</h2>
            <p className="mt-1 text-sm text-slate-600">Open a draft, continue editing, or share a public link.</p>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>

        <div className="mt-6 space-y-4">
          {portfolios.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-slate-950">No portfolios yet</h3>
              <p className="mt-2 text-sm text-slate-600">Start from a template and your first draft will show up here.</p>
              <Link
                href="/templates"
                className="mt-5 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                Browse templates
              </Link>
            </div>
          ) : (
            portfolios.map((portfolio) => {
              const previewHref = portfolio.is_public
                ? `/portfolio/${portfolio.id}`
                : `/editor?portfolio=${portfolio.id}`;

              return (
                <article key={portfolio.id} className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-950">{portfolio.name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            portfolio.is_public
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {portfolio.is_public ? "Public" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{portfolio.title || "Untitled role"}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Template: {portfolio.template || "modern-minimal"} · Updated{" "}
                        {new Date(portfolio.updated_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/editor?portfolio=${portfolio.id}`}
                        className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <Link
                        href={previewHref}
                        className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                      >
                        {portfolio.is_public ? "Open public page" : "Preview draft"}
                      </Link>
                      <button
                        onClick={() => deletePortfolio(portfolio.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
