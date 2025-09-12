"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EditorPage() {
  // Get the selected template from the URL
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  // State for the form fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState([
    { company: "", role: "", years: "" },
  ]);
  const [education, setEducation] = useState([
    { school: "", degree: "", years: "" },
  ]);
  const [projects, setProjects] = useState([
    { name: "", description: "", link: "" },
  ]);

  // Handlers for dynamic fields (experience, education, projects)
  const handleExpChange = (idx: number, field: string, value: string) => {
    setExperience((exp) =>
      exp.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
    );
  };
  const addExp = () =>
    setExperience((exp) => [...exp, { company: "", role: "", years: "" }]);

  const handleEduChange = (idx: number, field: string, value: string) => {
    setEducation((edu) =>
      edu.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
    );
  };
  const addEdu = () =>
    setEducation((edu) => [...edu, { school: "", degree: "", years: "" }]);

  const handleProjChange = (idx: number, field: string, value: string) => {
    setProjects((proj) =>
      proj.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };
  const addProj = () =>
    setProjects((proj) => [...proj, { name: "", description: "", link: "" }]);

  // For now, just log the data on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is where you'd send data to the backend
    console.log({
      name,
      title,
      bio,
      experience,
      education,
      projects,
      template,
    });
    alert(
      "Portfolio data logged to console! (Backend integration coming soon)"
    );
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-indigo-50 overflow-hidden">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow p-12 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Portfolio Editor
        </h1>
        {template && (
          <p className="text-lg text-indigo-700 mb-4 text-center">
            <span className="font-semibold">Selected Template:</span> {template}
          </p>
        )}
        {/* Portfolio Form */}
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              className="w-full border rounded p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Bio</label>
            <textarea
              className="w-full border rounded p-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              required
            />
          </div>
          {/* Experience Section */}
          <div>
            <label className="block font-semibold mb-1">Experience</label>
            {experience.map((exp, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="border rounded p-2 flex-1"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleExpChange(idx, "company", e.target.value)
                  }
                />
                <input
                  className="border rounded p-2 flex-1"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                />
                <input
                  className="border rounded p-2 w-20"
                  placeholder="Years"
                  value={exp.years}
                  onChange={(e) =>
                    handleExpChange(idx, "years", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="text-indigo-500 hover:underline text-sm"
              onClick={addExp}
            >
              + Add Experience
            </button>
          </div>
          {/* Education Section */}
          <div>
            <label className="block font-semibold mb-1">Education</label>
            {education.map((edu, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="border rounded p-2 flex-1"
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) =>
                    handleEduChange(idx, "school", e.target.value)
                  }
                />
                <input
                  className="border rounded p-2 flex-1"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEduChange(idx, "degree", e.target.value)
                  }
                />
                <input
                  className="border rounded p-2 w-20"
                  placeholder="Years"
                  value={edu.years}
                  onChange={(e) =>
                    handleEduChange(idx, "years", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="text-indigo-500 hover:underline text-sm"
              onClick={addEdu}
            >
              + Add Education
            </button>
          </div>
          {/* Projects Section */}
          <div>
            <label className="block font-semibold mb-1">Projects</label>
            {projects.map((proj, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="border rounded p-2 flex-1"
                  placeholder="Project Name"
                  value={proj.name}
                  onChange={(e) =>
                    handleProjChange(idx, "name", e.target.value)
                  }
                />
                <input
                  className="border rounded p-2 flex-1"
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) =>
                    handleProjChange(idx, "description", e.target.value)
                  }
                />
                <input
                  className="border rounded p-2 w-32"
                  placeholder="Link"
                  value={proj.link}
                  onChange={(e) =>
                    handleProjChange(idx, "link", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="text-indigo-500 hover:underline text-sm"
              onClick={addProj}
            >
              + Add Project
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-400 to-blue-400 text-white rounded-lg font-semibold shadow hover:from-indigo-500 hover:to-blue-500 transition"
          >
            Save Portfolio
          </button>
        </form>
      </div>
      {/* Live Preview below the form */}
      <PortfolioPreview
        name={name}
        title={title}
        bio={bio}
        experience={experience}
        education={education}
        projects={projects}
        template={template}
      />
    </main>
  );
}

// PortfolioPreview: presentational component for live preview
function PortfolioPreview({
  name,
  title,
  bio,
  experience,
  education,
  projects,
  template,
}: {
  name: string;
  title: string;
  bio: string;
  experience: { company: string; role: string; years: string }[];
  education: { school: string; degree: string; years: string }[];
  projects: { name: string; description: string; link: string }[];
  template?: string | null;
}) {
  return (
    <div className="w-full max-w-2xl bg-indigo-50 rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
        Live Preview
      </h2>
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-gray-900">
          {name || "Your Name"}
        </span>
        <div className="text-indigo-600">{title || "Your Title"}</div>
      </div>
      <div className="mb-4 text-gray-700 text-center italic">
        {bio || "Your bio will appear here."}
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 mb-1">Experience</h3>
        <ul className="list-disc list-inside text-gray-700">
          {experience.filter((e) => e.company || e.role || e.years).length ===
          0 ? (
            <li className="italic text-gray-400">No experience added yet.</li>
          ) : (
            experience.map((exp, idx) => (
              <li key={idx}>
                <span className="font-semibold">{exp.role || "Role"}</span> at{" "}
                {exp.company || "Company"} ({exp.years || "Years"})
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 mb-1">Education</h3>
        <ul className="list-disc list-inside text-gray-700">
          {education.filter((e) => e.school || e.degree || e.years).length ===
          0 ? (
            <li className="italic text-gray-400">No education added yet.</li>
          ) : (
            education.map((edu, idx) => (
              <li key={idx}>
                <span className="font-semibold">{edu.degree || "Degree"}</span>{" "}
                at {edu.school || "School"} ({edu.years || "Years"})
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 mb-1">Projects</h3>
        <ul className="list-disc list-inside text-gray-700">
          {projects.filter((p) => p.name || p.description || p.link).length ===
          0 ? (
            <li className="italic text-gray-400">No projects added yet.</li>
          ) : (
            projects.map((proj, idx) => (
              <li key={idx}>
                <span className="font-semibold">
                  {proj.name || "Project Name"}
                </span>
                : {proj.description || "Description"}
                {proj.link && (
                  <span>
                    {" "}
                    [
                    <a
                      href={proj.link}
                      className="text-indigo-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                    ]
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
      {template && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Template: <span className="font-semibold">{template}</span>
        </div>
      )}
    </div>
  );
}
