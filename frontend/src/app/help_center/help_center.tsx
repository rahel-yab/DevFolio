"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { title: "Getting Started", icon: "🚀", count: 12 },
  { title: "Account & Profile", icon: "👤", count: 8 },
  { title: "Portfolio Editor", icon: "🎨", count: 15 },
  { title: "Custom Domains", icon: "🌐", count: 5 },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 pb-20">
      {/* 1. Consistent Header/Logo */}
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

      {/* 2. Hero Search Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How can we help?</h1>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for articles (e.g. 'custom domain', 'markdown')..."
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Grid of Categories (Using the Card Style) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.title}
            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
              {cat.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.title}</h3>
            <p className="text-gray-500 text-sm">{cat.count} Articles</p>
          </button>
        ))}
      </div>

      {/* 4. Bottom Support CTA */}
      <div className="max-w-2xl mx-auto mt-20 text-center bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-6">Our team of developers is ready to assist you with any technical issues.</p>
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Contact Support
        </button>
      </div>
    </main>
  );
}