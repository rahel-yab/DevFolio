"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function EditorPage() {
  // Get the selected template from the URL
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  // State for the form fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([""]);
  const [experience, setExperience] = useState([
    { company: "", role: "", years: "", description: "" },
  ]);
  const [education, setEducation] = useState([
    { school: "", degree: "", years: "", gpa: "" },
  ]);
  const [projects, setProjects] = useState([
    { name: "", description: "", technologies: "", link: "", github: "" },
  ]);

  // Handlers for skills
  const handleSkillChange = (idx: number, value: string) => {
    setSkills((skills) =>
      skills.map((skill, i) => (i === idx ? value : skill))
    );
  };
  const addSkill = () => setSkills((skills) => [...skills, ""]);
  const removeSkill = (idx: number) => {
    if (skills.length > 1) {
      setSkills((skills) => skills.filter((_, i) => i !== idx));
    }
  };

  // Handlers for dynamic fields (experience, education, projects)
  const handleExpChange = (idx: number, field: string, value: string) => {
    setExperience((exp) =>
      exp.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
    );
  };
  const addExp = () =>
    setExperience((exp) => [...exp, { company: "", role: "", years: "", description: "" }]);
  const removeExp = (idx: number) => {
    if (experience.length > 1) {
      setExperience((exp) => exp.filter((_, i) => i !== idx));
    }
  };

  const handleEduChange = (idx: number, field: string, value: string) => {
    setEducation((edu) =>
      edu.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
    );
  };
  const addEdu = () =>
    setEducation((edu) => [...edu, { school: "", degree: "", years: "", gpa: "" }]);
  const removeEdu = (idx: number) => {
    if (education.length > 1) {
      setEducation((edu) => edu.filter((_, i) => i !== idx));
    }
  };

  const handleProjChange = (idx: number, field: string, value: string) => {
    setProjects((proj) =>
      proj.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };
  const addProj = () =>
    setProjects((proj) => [...proj, { name: "", description: "", technologies: "", link: "", github: "" }]);
  const removeProj = (idx: number) => {
    if (projects.length > 1) {
      setProjects((proj) => proj.filter((_, i) => i !== idx));
    }
  };

  // For now, just log the data on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is where you'd send data to the backend
    console.log({
      name,
      title,
      email,
      phone,
      location,
      website,
      bio,
      skills: skills.filter(skill => skill.trim() !== ""),
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Builder</h1>
              {template && (
                <p className="text-lg text-indigo-600">
                  <span className="font-semibold">Template:</span> {template}
                </p>
              )}
            </div>
            <Link href="/templates">
              <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                Change Template
              </button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Title *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Software Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website/Portfolio</label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="https://johndoe.dev"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Brief description of your professional background and key achievements..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                  <button
                    type="button"
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    ✨ Enhance with AI
                  </button>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Skills
                </h2>
                <div className="space-y-3">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="e.g., JavaScript, React, Node.js"
                        value={skill}
                        onChange={(e) => handleSkillChange(idx, e.target.value)}
                      />
                      {skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(idx)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              {/* Experience Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">Experience {idx + 1}</h3>
                        {experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExp(idx)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                        />
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Job Title"
                          value={exp.role}
                          onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Duration (e.g., 2020-2023)"
                        value={exp.years}
                        onChange={(e) => handleExpChange(idx, "years", e.target.value)}
                      />
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Job description and key achievements..."
                        value={exp.description}
                        onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExp}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    + Add Experience
                  </button>
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">Education {idx + 1}</h3>
                        {education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEdu(idx)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="School/University"
                          value={edu.school}
                          onChange={(e) => handleEduChange(idx, "school", e.target.value)}
                        />
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Years (e.g., 2018-2022)"
                          value={edu.years}
                          onChange={(e) => handleEduChange(idx, "years", e.target.value)}
                        />
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => handleEduChange(idx, "gpa", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEdu}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    + Add Education
                  </button>
                </div>
              </div>

              {/* Projects Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Projects
                </h2>
                <div className="space-y-6">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">Project {idx + 1}</h3>
                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProj(idx)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => handleProjChange(idx, "name", e.target.value)}
                      />
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Project description and key features..."
                        value={proj.description}
                        onChange={(e) => handleProjChange(idx, "description", e.target.value)}
                        rows={3}
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                        value={proj.technologies}
                        onChange={(e) => handleProjChange(idx, "technologies", e.target.value)}
                      />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="url"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Live Demo URL"
                          value={proj.link}
                          onChange={(e) => handleProjChange(idx, "link", e.target.value)}
                        />
                        <input
                          type="url"
                          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="GitHub Repository URL"
                          value={proj.github}
                          onChange={(e) => handleProjChange(idx, "github", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProj}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    + Add Project
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Save Resume
                </button>
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Preview & Download
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <PortfolioPreview
              name={name}
              title={title}
              email={email}
              phone={phone}
              location={location}
              website={website}
              bio={bio}
              skills={skills.filter(skill => skill.trim() !== "")}
              experience={experience}
              education={education}
              projects={projects}
              template={template}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// PortfolioPreview: presentational component for live preview
function PortfolioPreview({
  name,
  title,
  email,
  phone,
  location,
  website,
  bio,
  skills,
  experience,
  education,
  projects,
  template,
}: {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  skills: string[];
  experience: { company: string; role: string; years: string; description: string }[];
  education: { school: string; degree: string; years: string; gpa: string }[];
  projects: { name: string; description: string; technologies: string; link: string; github: string }[];
  template?: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>
        <div className="text-sm text-gray-500">
          {template && `Template: ${template}`}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {name || "Your Name"}
          </h1>
          <p className="text-xl text-indigo-600 mb-4">
            {title || "Your Professional Title"}
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {email && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </span>
            )}
            {website && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
                <a href={website} className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {bio && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Work Experience</h3>
          {experience.filter((e) => e.company || e.role || e.years).length === 0 ? (
            <p className="text-gray-400 italic">No experience added yet.</p>
          ) : (
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-indigo-200 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {exp.role || "Job Title"}
                    </h4>
                    <span className="text-sm text-gray-500">{exp.years}</span>
                  </div>
                  <p className="text-indigo-600 font-medium mb-2">
                    {exp.company || "Company Name"}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Education</h3>
          {education.filter((e) => e.school || e.degree || e.years).length === 0 ? (
            <p className="text-gray-400 italic">No education added yet.</p>
          ) : (
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="border-l-2 border-indigo-200 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {edu.degree || "Degree"}
                    </h4>
                    <span className="text-sm text-gray-500">{edu.years}</span>
                  </div>
                  <p className="text-indigo-600 font-medium">
                    {edu.school || "School/University"}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Projects</h3>
          {projects.filter((p) => p.name || p.description).length === 0 ? (
            <p className="text-gray-400 italic">No projects added yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {proj.name || "Project Name"}
                    </h4>
                    <div className="flex gap-2">
                      {proj.link && (
                        <a
                          href={proj.link}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Demo
                        </a>
                      )}
                      {proj.github && (
                        <a
                          href={proj.github}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                  )}
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.split(',').map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
