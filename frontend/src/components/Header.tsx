"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

const links = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}` || "DF";

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (!confirmed) {
      return;
    }

    await logout();
    setIsMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[rgba(252,247,239,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="DevFolio logo" width={42} height={42} className="rounded-2xl" />
          <div>
            <p className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">DevFolio</p>
            <p className="text-xs text-slate-600">Portfolio builder for developers</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                    : "text-slate-700 hover:bg-white/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-full border border-[color:var(--line)] bg-white/75 px-3 py-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/70">
                Sign in
              </Link>
              <Link
                href="/templates"
                className="rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
              >
                Start building
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="rounded-full border border-[color:var(--line)] bg-white/80 p-2 md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[color:var(--line)] bg-[rgba(255,250,242,0.96)] px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Start building
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
