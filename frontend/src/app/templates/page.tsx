import Link from "next/link";
import Image from "next/image";
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
    description: "Clean lines, lots of whitespace, and elegant typography perfect for tech professionals.",
    image: templateImages[0],
    features: ["Clean Design", "ATS-Friendly", "Modern Layout"],
    popular: true,
  },
  {
    name: "Creative Grid",
    description: "Bold, grid-based layout for visual project showcase and creative portfolios.",
    image: templateImages[1],
    features: ["Visual Focus", "Project Showcase", "Creative Layout"],
    popular: false,
  },
  {
    name: "Classic Resume",
    description: "Traditional resume with clear sections for experience and education.",
    image: templateImages[2],
    features: ["Traditional", "Professional", "Easy to Read"],
    popular: false,
  },
  {
    name: "Sidebar Profile",
    description: "Profile photo and contact info in a sidebar, content on the right.",
    image: templateImages[3],
    features: ["Photo Friendly", "Organized", "Contact Focus"],
    popular: true,
  },
  {
    name: "Timeline",
    description: "Vertical timeline for work and education history with visual progression.",
    image: templateImages[0],
    features: ["Timeline View", "Career Path", "Visual Story"],
    popular: false,
  },
  {
    name: "Elegant Columns",
    description: "Two-column layout for easy reading and clear separation of information.",
    image: templateImages[1],
    features: ["Two Column", "Balanced", "Professional"],
    popular: false,
  },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Choose Your Perfect
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Template</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Select from our professionally designed templates, each crafted to highlight your unique skills and experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ATS-Friendly
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Mobile Responsive
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                AI-Enhanced
              </span>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, idx) => (
              <Link
                key={template.name}
                href={`/editor?template=${encodeURIComponent(template.name)}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {template.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Template Preview */}
                  <div className="relative mb-6 overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={template.image}
                      alt={`${template.name} template preview`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <div className="pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Click to customize</span>
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                          <svg className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">
              Can't decide? Start with our most popular template and customize it later.
            </p>
            <Link href="/editor?template=Modern%20Minimal">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Start with Modern Minimal
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
