"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { apiService } from "../../services/api";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get("message"));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isSignUp && (!firstName.trim() || !lastName.trim())) {
      setError("First name and last name are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        await register({
          email,
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        });
      } else {
        await login({ email, password });
      }

      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Authentication failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="shell-card w-full rounded-[2.25rem] p-8 sm:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
              DevFolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {isSignUp ? "Sign up" : "Log in"}
            </h1>
          </div>
          <Link href="/" className="text-sm font-semibold text-[color:var(--accent-strong)]">
            Home
          </Link>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              window.location.href = apiService.getGoogleLoginUrl();
            }}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.8-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.7 2.3 12 2.3 6.9 2.3 2.8 6.5 2.8 11.8S6.9 21.3 12 21.3c6.9 0 9.1-4.9 9.1-7.4 0-.5 0-.9-.1-1.2H12Z" />
              <path fill="#34A853" d="M2.8 7.1l3.2 2.4c.9-2 3-3.4 6-3.4 1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.7 2.3 12 2.3c-3.8 0-7 2.2-8.6 4.8Z" />
              <path fill="#4A90E2" d="M12 21.3c2.6 0 4.8-.8 6.4-2.3l-3-2.5c-.8.6-1.9 1-3.4 1-3.7 0-5.2-2.5-5.4-3.7l-3.3 2.6c1.6 3.1 4.8 4.9 8.7 4.9Z" />
              <path fill="#FBBC05" d="M6.6 13.8c-.1-.4-.2-.8-.2-1.3 0-.4.1-.9.2-1.3L3.3 8.6c-.4.9-.5 1.9-.5 2.9s.2 2 .5 2.9l3.3-2.6Z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[color:var(--line)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">or</span>
          <div className="h-px flex-1 bg-[color:var(--line)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" value={firstName} onChange={setFirstName} />
              <Field label="Last name" value={lastName} onChange={setLastName} />
            </div>
          )}

          <Field label="Email" value={email} onChange={setEmail} type="email" />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Password</span>
            <div className="flex items-center rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-slate-900 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="ml-3 text-slate-500 transition hover:text-slate-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m3 3 18 18M10.584 10.587A2 2 0 0 0 12 14a2 2 0 0 0 1.414-.586M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7.5a11.77 11.77 0 0 1-4.04 5.19M6.61 6.61C4.62 7.93 3.15 9.58 2 11.5A11.83 11.83 0 0 0 7.5 16.9" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {error && <p className="rounded-[1.5rem] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:opacity-60"
          >
            {submitting ? (isSignUp ? "Creating account..." : "Logging in...") : isSignUp ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp((value) => !value);
              setError(null);
            }}
            className="font-semibold text-[color:var(--accent-strong)]"
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
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
