"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiService } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("The new password confirmation does not match.");
      return;
    }

    setSaving(true);
    try {
      await apiService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="shell-card rounded-[2rem] p-8">
          <span className="eyebrow">Account settings</span>
          <h1 className="mt-5 text-3xl font-semibold text-slate-950">Keep your account secure</h1>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            DevFolio currently supports core account management features: updating profile details, password changes, and logging out from the current session.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-slate-900">Signed in as</p>
            <p className="mt-2 text-lg text-slate-950">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/profile"
              className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Edit profile details
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
          </div>
        </section>

        <section className="shell-card rounded-[2rem] p-8">
          <h2 className="text-2xl font-semibold text-slate-950">Change password</h2>
          <p className="mt-2 text-sm text-slate-600">Passwords must be at least 8 characters long.</p>

          <form className="mt-8 space-y-5" onSubmit={handlePasswordSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Current password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                required
              />
            </label>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
