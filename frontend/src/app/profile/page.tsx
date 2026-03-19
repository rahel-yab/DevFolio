"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    avatar: "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      website: user.website || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const initials = `${formData.first_name?.[0] || ""}${formData.last_name?.[0] || ""}` || "DF";

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateProfile(formData);
      setEditing(false);
      setMessage("Profile updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update profile.");
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
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="shell-card rounded-[2.25rem] p-8 sm:p-10">
          <span className="eyebrow">Profile</span>
          <div className="mt-6 flex items-start gap-5">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={`${formData.first_name} ${formData.last_name}`}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--accent)] text-2xl font-semibold text-white">
                {initials}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-semibold text-slate-950">
                {formData.first_name} {formData.last_name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">{user.email}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                {formData.location && <span>{formData.location}</span>}
                {formData.website && <span>{formData.website}</span>}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-slate-900">Profile summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {formData.bio || "Add a short bio so your editor and public portfolio have a stronger starting point."}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setError(null);
                  setMessage(null);
                }}
                className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                Edit profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError(null);
                    setMessage(null);
                    if (user) {
                      setFormData({
                        first_name: user.first_name || "",
                        last_name: user.last_name || "",
                        bio: user.bio || "",
                        phone: user.phone || "",
                        location: user.location || "",
                        website: user.website || "",
                        linkedin: user.linkedin || "",
                        github: user.github || "",
                        avatar: user.avatar || "",
                      });
                    }
                  }}
                  className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </section>

        <section className="shell-card rounded-[2.25rem] p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-950">Profile details</h2>
          <div className="mt-6 grid gap-5">
            <TwoColumn>
              <Field label="First name" value={formData.first_name} disabled={!editing} onChange={(value) => setFormData({ ...formData, first_name: value })} />
              <Field label="Last name" value={formData.last_name} disabled={!editing} onChange={(value) => setFormData({ ...formData, last_name: value })} />
            </TwoColumn>

            <Field label="Avatar URL" value={formData.avatar} disabled={!editing} onChange={(value) => setFormData({ ...formData, avatar: value })} />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Bio</span>
              <textarea
                value={formData.bio}
                disabled={!editing}
                onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                rows={5}
                className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)] disabled:bg-slate-50"
              />
            </label>

            <TwoColumn>
              <Field label="Phone" value={formData.phone} disabled={!editing} onChange={(value) => setFormData({ ...formData, phone: value })} />
              <Field label="Location" value={formData.location} disabled={!editing} onChange={(value) => setFormData({ ...formData, location: value })} />
            </TwoColumn>

            <Field label="Website" value={formData.website} disabled={!editing} onChange={(value) => setFormData({ ...formData, website: value })} />
            <TwoColumn>
              <Field label="LinkedIn" value={formData.linkedin} disabled={!editing} onChange={(value) => setFormData({ ...formData, linkedin: value })} />
              <Field label="GitHub" value={formData.github} disabled={!editing} onChange={(value) => setFormData({ ...formData, github: value })} />
            </TwoColumn>
          </div>

          {error && <p className="mt-5 rounded-[1.5rem] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p className="mt-5 rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        </section>
      </div>
    </main>
  );
}

function TwoColumn({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)] disabled:bg-slate-50"
      />
    </label>
  );
}
