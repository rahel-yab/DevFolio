"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { apiService, Portfolio } from "../../services/api";

type ExperienceItem = {
  company: string;
  role: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
};

type EducationItem = {
  school: string;
  degree: string;
  field: string;
  description: string;
  gpa?: string;
  start_date: string;
  end_date?: string;
};

type ProjectItem = {
  name: string;
  description: string;
  technologies: string;
  link: string;
  github_link: string;
  image_url: string;
  start_date: string;
  end_date?: string;
  featured: boolean;
};

const blankExperience = (): ExperienceItem => ({
  company: "",
  role: "",
  description: "",
  location: "",
  start_date: new Date().toISOString(),
  end_date: "",
  is_current: false,
});

const blankEducation = (): EducationItem => ({
  school: "",
  degree: "",
  field: "",
  description: "",
  gpa: "",
  start_date: new Date().toISOString(),
  end_date: "",
});

const blankProject = (): ProjectItem => ({
  name: "",
  description: "",
  technologies: "",
  link: "",
  github_link: "",
  image_url: "",
  start_date: new Date().toISOString(),
  end_date: "",
  featured: false,
});

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "modern-minimal";
  const portfolioId = searchParams.get("portfolio");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [experience, setExperience] = useState<ExperienceItem[]>([blankExperience()]);
  const [education, setEducation] = useState<EducationItem[]>([blankEducation()]);
  const [projects, setProjects] = useState<ProjectItem[]>([blankProject()]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user || portfolioId) {
      return;
    }

    setName(`${user.first_name} ${user.last_name}`.trim());
    setEmail(user.email || "");
    setBio(user.bio || "");
    setPhone(user.phone || "");
    setLocation(user.location || "");
    setWebsite(user.website || "");
    setLinkedin(user.linkedin || "");
    setGithub(user.github || "");
  }, [portfolioId, user]);

  useEffect(() => {
    if (!portfolioId) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    apiService
      .getPortfolio(portfolioId)
      .then((portfolio) => {
        if (!active) {
          return;
        }

        hydrateFromPortfolio(portfolio);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load portfolio.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [portfolioId]);

  const hydrateFromPortfolio = (portfolio: Portfolio) => {
    setName(portfolio.name);
    setTitle(portfolio.title);
    setBio(portfolio.bio);
    setEmail(portfolio.email);
    setPhone(portfolio.phone);
    setLocation(portfolio.location);
    setWebsite(portfolio.website);
    setLinkedin(portfolio.linkedin);
    setGithub(portfolio.github);
    setSkillsInput(portfolio.skills.join(", "));
    setIsPublic(portfolio.is_public);
    setExperience(
      portfolio.experience.length > 0
        ? portfolio.experience.map((item) => ({
            company: item.company,
            role: item.role,
            description: item.description,
            location: item.location,
            start_date: item.start_date,
            end_date: item.end_date || "",
            is_current: item.is_current,
          }))
        : [blankExperience()]
    );
    setEducation(
      portfolio.education.length > 0
        ? portfolio.education.map((item) => ({
            school: item.school,
            degree: item.degree,
            field: item.field,
            description: item.description,
            gpa: item.gpa || "",
            start_date: item.start_date,
            end_date: item.end_date || "",
          }))
        : [blankEducation()]
    );
    setProjects(
      portfolio.projects.length > 0
        ? portfolio.projects.map((item) => ({
            name: item.name,
            description: item.description,
            technologies: item.tech_stack.join(", "),
            link: item.link,
            github_link: item.github_link,
            image_url: item.image_url,
            start_date: item.start_date,
            end_date: item.end_date || "",
            featured: item.featured,
          }))
        : [blankProject()]
    );
  };

  const normalizedSkills = skillsInput
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const payload = {
    name,
    title,
    bio,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
    skills: normalizedSkills,
    template,
    is_public: isPublic,
    experience: experience
      .filter((item) => item.company || item.role || item.description)
      .map((item) => ({
        company: item.company,
        role: item.role,
        description: item.description,
        location: item.location,
        start_date: item.start_date || new Date().toISOString(),
        end_date: item.end_date || undefined,
        is_current: item.is_current,
      })),
    education: education
      .filter((item) => item.school || item.degree || item.description)
      .map((item) => ({
        school: item.school,
        degree: item.degree,
        field: item.field,
        description: item.description,
        gpa: item.gpa || undefined,
        start_date: item.start_date || new Date().toISOString(),
        end_date: item.end_date || undefined,
      })),
    projects: projects
      .filter((item) => item.name || item.description)
      .map((item) => ({
        name: item.name,
        description: item.description,
        tech_stack: item.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        link: item.link,
        github_link: item.github_link,
        image_url: item.image_url,
        start_date: item.start_date || new Date().toISOString(),
        end_date: item.end_date || undefined,
        featured: item.featured,
      })),
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const savedPortfolio = portfolioId
        ? await apiService.updatePortfolio(portfolioId, payload)
        : await apiService.createPortfolio(payload);

      setIsPublic(savedPortfolio.is_public);
      setMessage(portfolioId ? "Portfolio updated." : "Portfolio created.");

      if (!portfolioId) {
        router.replace(`/editor?portfolio=${savedPortfolio.id}`);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save portfolio.");
    } finally {
      setSaving(false);
    }
  };

  const handleEnhanceBio = async () => {
    setEnhancing(true);
    setError(null);
    setMessage(null);

    try {
      let workingPortfolioId = portfolioId;

      if (!workingPortfolioId) {
        const savedPortfolio = await apiService.createPortfolio(payload);
        workingPortfolioId = savedPortfolio.id;
        router.replace(`/editor?portfolio=${savedPortfolio.id}`);
      } else {
        await apiService.updatePortfolio(workingPortfolioId, payload);
      }

      const enhanced = await apiService.enhanceWithAI(workingPortfolioId, ["bio"], {
        title,
        skills: normalizedSkills,
      });
      hydrateFromPortfolio(enhanced);
      setMessage("Bio enhanced with AI.");
    } catch (enhanceError) {
      setError(enhanceError instanceof Error ? enhanceError.message : "Unable to enhance the bio.");
    } finally {
      setEnhancing(false);
    }
  };

  if (authLoading || loading || !isAuthenticated) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">{portfolioId ? "Continue editing" : "New portfolio draft"}</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {portfolioId ? "Refine your portfolio" : "Build your portfolio"}
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Template: <span className="font-semibold text-slate-900">{template}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/templates"
            className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800"
          >
            Change template
          </Link>
          {portfolioId && isPublic && (
            <Link
              href={`/portfolio/${portfolioId}`}
              className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800"
            >
              Open public page
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="shell-card rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-8">
            <Section title="Identity">
              <TwoColumn>
                <Field label="Full name" value={name} onChange={setName} />
                <Field label="Professional title" value={title} onChange={setTitle} />
              </TwoColumn>
              <TwoColumn>
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Phone" value={phone} onChange={setPhone} />
              </TwoColumn>
              <TwoColumn>
                <Field label="Location" value={location} onChange={setLocation} />
                <Field label="Website" value={website} onChange={setWebsite} type="url" />
              </TwoColumn>
              <TwoColumn>
                <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} type="url" />
                <Field label="GitHub" value={github} onChange={setGithub} type="url" />
              </TwoColumn>
            </Section>

            <Section title="Summary">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Professional summary</span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows={6}
                  className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                />
              </label>
              <button
                type="button"
                onClick={handleEnhanceBio}
                disabled={enhancing}
                className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-slate-800"
              >
                {enhancing ? "Enhancing..." : "Enhance summary with AI"}
              </button>
            </Section>

            <Section title="Skills">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Comma-separated skills</span>
                <input
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                  className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                  placeholder="TypeScript, Go, Next.js, MongoDB"
                />
              </label>
            </Section>

            <Section title="Experience">
              <Collection
                items={experience}
                addLabel="Add experience"
                onAdd={() => setExperience((items) => [...items, blankExperience()])}
                onRemove={(index) => setExperience((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                renderItem={(item, index) => (
                  <>
                    <TwoColumn>
                      <Field
                        label="Company"
                        value={item.company}
                        onChange={(value) =>
                          setExperience((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, company: value } : entry)))
                        }
                      />
                      <Field
                        label="Role"
                        value={item.role}
                        onChange={(value) =>
                          setExperience((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, role: value } : entry)))
                        }
                      />
                    </TwoColumn>
                    <Field
                      label="Location"
                      value={item.location}
                      onChange={(value) =>
                        setExperience((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, location: value } : entry)))
                      }
                    />
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-800">What did you work on?</span>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          setExperience((items) =>
                            items.map((entry, itemIndex) =>
                              itemIndex === index ? { ...entry, description: event.target.value } : entry
                            )
                          )
                        }
                        rows={4}
                        className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                      />
                    </label>
                  </>
                )}
              />
            </Section>

            <Section title="Projects">
              <Collection
                items={projects}
                addLabel="Add project"
                onAdd={() => setProjects((items) => [...items, blankProject()])}
                onRemove={(index) => setProjects((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                renderItem={(item, index) => (
                  <>
                    <TwoColumn>
                      <Field
                        label="Project name"
                        value={item.name}
                        onChange={(value) =>
                          setProjects((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, name: value } : entry)))
                        }
                      />
                      <Field
                        label="Tech stack"
                        value={item.technologies}
                        onChange={(value) =>
                          setProjects((items) =>
                            items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, technologies: value } : entry))
                          )
                        }
                      />
                    </TwoColumn>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Description</span>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          setProjects((items) =>
                            items.map((entry, itemIndex) =>
                              itemIndex === index ? { ...entry, description: event.target.value } : entry
                            )
                          )
                        }
                        rows={4}
                        className="w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[color:var(--accent)]"
                      />
                    </label>
                    <TwoColumn>
                      <Field
                        label="Live link"
                        value={item.link}
                        onChange={(value) =>
                          setProjects((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, link: value } : entry)))
                        }
                        type="url"
                      />
                      <Field
                        label="GitHub link"
                        value={item.github_link}
                        onChange={(value) =>
                          setProjects((items) =>
                            items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, github_link: value } : entry))
                          )
                        }
                        type="url"
                      />
                    </TwoColumn>
                  </>
                )}
              />
            </Section>

            <Section title="Education">
              <Collection
                items={education}
                addLabel="Add education"
                onAdd={() => setEducation((items) => [...items, blankEducation()])}
                onRemove={(index) => setEducation((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                renderItem={(item, index) => (
                  <>
                    <TwoColumn>
                      <Field
                        label="School"
                        value={item.school}
                        onChange={(value) =>
                          setEducation((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, school: value } : entry)))
                        }
                      />
                      <Field
                        label="Degree"
                        value={item.degree}
                        onChange={(value) =>
                          setEducation((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, degree: value } : entry)))
                        }
                      />
                    </TwoColumn>
                    <TwoColumn>
                      <Field
                        label="Field"
                        value={item.field}
                        onChange={(value) =>
                          setEducation((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, field: value } : entry)))
                        }
                      />
                      <Field
                        label="GPA"
                        value={item.gpa || ""}
                        onChange={(value) =>
                          setEducation((items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, gpa: value } : entry)))
                        }
                      />
                    </TwoColumn>
                  </>
                )}
              />
            </Section>

            <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 p-5">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Public portfolio</p>
                  <p className="text-sm text-slate-600">Turn this on when the draft is ready to share.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) => setIsPublic(event.target.checked)}
                  className="h-5 w-5 rounded border-[color:var(--line)] text-[color:var(--accent)]"
                />
              </label>
            </div>

            {error && <p className="rounded-[1.5rem] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p className="rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:opacity-60"
              >
                {saving ? "Saving..." : portfolioId ? "Save changes" : "Create portfolio"}
              </button>
              <Link
                href="/dashboard"
                className="rounded-full border border-[color:var(--line)] bg-white px-6 py-3 text-center text-sm font-semibold text-slate-800"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>

        <aside className="shell-card rounded-[2rem] p-6 sm:p-8 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
            Live preview
          </p>
          <div className="mt-6 rounded-[1.75rem] border border-[color:var(--line)] bg-white p-6">
            <h2 className="text-3xl font-semibold text-slate-950">{name || "Your name"}</h2>
            <p className="mt-2 text-lg text-slate-700">{title || "Your professional title"}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              {email && <span>{email}</span>}
              {location && <span>{location}</span>}
              {website && <span>{website}</span>}
            </div>

            {bio && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Summary</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{bio}</p>
              </div>
            )}

            {normalizedSkills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {normalizedSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-strong)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <PreviewList
              title="Experience"
              items={experience
                .filter((item) => item.company || item.role || item.description)
                .map((item) => ({
                  heading: item.role || "Role",
                  subheading: item.company || "Company",
                  body: item.description,
                }))}
            />
            <PreviewList
              title="Projects"
              items={projects
                .filter((item) => item.name || item.description)
                .map((item) => ({
                  heading: item.name || "Project",
                  subheading: item.technologies,
                  body: item.description,
                }))}
            />
            <PreviewList
              title="Education"
              items={education
                .filter((item) => item.school || item.degree || item.field)
                .map((item) => ({
                  heading: item.degree || "Degree",
                  subheading: [item.school, item.field].filter(Boolean).join(" · "),
                  body: item.description,
                }))}
            />
            {(linkedin || github) && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Links</h3>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  {website && <a href={website} className="text-[color:var(--accent-strong)]">{website}</a>}
                  {linkedin && <a href={linkedin} className="text-[color:var(--accent-strong)]">{linkedin}</a>}
                  {github && <a href={github} className="text-[color:var(--accent-strong)]">{github}</a>}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function TwoColumn({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
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
      />
    </label>
  );
}

function Collection<T>({
  items,
  addLabel,
  onAdd,
  onRemove,
  renderItem,
}: {
  items: T[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Entry {index + 1}</p>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-sm font-semibold text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <div className="space-y-4">{renderItem(item, index)}</div>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-slate-800">
        {addLabel}
      </button>
    </div>
  );
}

function PreviewList({
  title,
  items,
}: {
  title: string;
  items: { heading: string; subheading?: string; body?: string }[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={`${item.heading}-${index}`} className="border-l border-[color:var(--line)] pl-4">
            <p className="font-semibold text-slate-950">{item.heading}</p>
            {item.subheading && <p className="text-sm text-[color:var(--accent-strong)]">{item.subheading}</p>}
            {item.body && <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
        </main>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
