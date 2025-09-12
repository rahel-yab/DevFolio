import Link from "next/link";
import React from "react";

const templateImages = [
  "/temp1.webp",
  "/temp2.webp",
  "/temp3.webp",
  "/temp4.webp",
];

const templates = [
  {
    name: "Modern Minimal",
    description: "Clean lines, lots of whitespace, and elegant typography.",
    image: templateImages[0],
  },
  {
    name: "Creative Grid",
    description: "Bold, grid-based layout for visual project showcase.",
    image: templateImages[1],
  },
  {
    name: "Classic Resume",
    description:
      "Traditional resume with clear sections for experience and education.",
    image: templateImages[2],
  },
  {
    name: "Sidebar Profile",
    description:
      "Profile photo and contact info in a sidebar, content on the right.",
    image: templateImages[3],
  },
  {
    name: "Timeline",
    description: "Vertical timeline for work and education history.",
    image: templateImages[0],
  },
  {
    name: "Elegant Columns",
    description: "Two-column layout for easy reading and separation of info.",
    image: templateImages[1],
  },
];

export default function TemplatesPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-indigo-50 overflow-hidden">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Choose a Resume Template
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, idx) => (
            <Link
              key={template.name}
              href={`/editor?template=${encodeURIComponent(template.name)}`}
              className="bg-indigo-50 rounded-lg p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center border border-indigo-100 hover:bg-indigo-100 focus:outline-none"
            >
              <div className="w-full mb-4 flex justify-center">
                <img
                  src={template.image}
                  alt={template.name + " preview"}
                  className="rounded shadow max-h-40 object-contain border border-indigo-100 bg-white"
                />
              </div>
              <h2 className="text-xl font-bold text-indigo-700 mb-1 text-center">
                {template.name}
              </h2>
              <p className="text-gray-700 text-center text-sm mb-2">
                {template.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
