"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 1. Data Structure for your FAQs
const FAQ_DATA = {
  "Getting Started": [
    { q: "How do I create my first portfolio?", a: "Once logged in, go to your Dashboard and click 'Create New'. Our AI will guide you through the initial setup." },
    { q: "Can I import data from GitHub?", a: "Yes! In the editor, you can link your GitHub profile to automatically pull in your repositories and contributions." },
    { q: "Is DevFolio free for students?", a: "DevFolio is free for everyone. We offer a Pro tier for custom domains and advanced analytics." }
  ],
  "Account & Profile": [
    { q: "How do I change my password?", a: "Go to Account Settings from your dashboard dropdown to update your security credentials." },
    { q: "Can I delete my account?", a: "Yes, you can find the 'Delete Account' option at the bottom of the Settings page. This action is permanent." }
  ],
  "Portfolio Editor": [
    { q: "How do I change the theme?", a: "Inside the editor, click the 'Design' tab on the left sidebar to toggle between different professional themes." },
    { q: "Can I use custom CSS?", a: "Custom CSS is currently a Pro feature available in the Design settings." }
  ],
  "Custom Domains": [
    { q: "How do I connect my own domain?", a: "In the 'Publish' settings, enter your domain name and follow the DNS instructions provided." },
    { q: "Do you provide SSL certificates?", a: "Yes, all portfolios hosted on DevFolio (including custom domains) get free SSL certificates." }
  ]
};

const categories = [
  { title: "Getting Started", icon: "🚀", count: 3 },
  { title: "Account & Profile", icon: "👤", count: 2 },
  { title: "Portfolio Editor", icon: "🎨", count: 2 },
  { title: "Custom Domains", icon: "🌐", count: 2 },
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Getting Started");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search (Simple version)
  const filteredCategories = categories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 pb-20">
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto pt-8 mb-12">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <Image src="/logo.png" alt="DevFolio Logo" width={40} height={40} className="rounded-xl" />
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DevFolio
            </span>
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Hero Search */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How can we help?</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content: 4-Column Grid for Categories */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredCategories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => setActiveCategory(cat.title)}
            className={`p-8 rounded-2xl border transition-all text-left group ${
              activeCategory === cat.title 
                ? "border-indigo-600 bg-white shadow-xl ring-2 ring-indigo-600/10" 
                : "border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1"
            }`}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
              {cat.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.title}</h3>
            <p className="text-gray-500 text-sm">{cat.count} Articles</p>
          </button>
        ))}
      </div>

      {/* Dynamic FAQ Display Area */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[400px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="mr-3">{categories.find(c => c.title === activeCategory)?.icon}</span>
            {activeCategory} Articles
          </h2>
          
          <div className="space-y-6">
            {FAQ_DATA[activeCategory as keyof typeof FAQ_DATA]?.map((faq, index) => (
              <div key={index} className="group border-b border-gray-50 pb-6 last:border-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {faq.q}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-12 text-center bg-indigo-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <h2 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h2>
          <p className="text-indigo-100 mb-6">Our support engineers are available 24/7 to help you.</p>
          <button className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
}