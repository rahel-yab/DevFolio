"use client";
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPolicy() {
  const lastUpdated = "February 6, 2026";

  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Information" },
    { id: "sharing", title: "3. Information Sharing" },
    { id: "security", title: "4. Data Security" },
    { id: "rights", title: "5. Your Rights" },
  ];

  return (
    <main className="min-h-screen bg-white p-4 pb-20">
      {/* Simple Header */}
      <div className="max-w-4xl mx-auto pt-12 mb-16">
        
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-500 font-medium">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Table of Contents - Sticky on Desktop */}
        <aside className="hidden md:block col-span-1">
          <nav className="sticky top-8 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contents</p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Policy Content */}
        <div className="col-span-1 md:col-span-3 prose prose-indigo max-w-none">
          <section id="collection" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you register for DevFolio, we collect information that identifies you, such as your:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Name and email address</li>
              <li>Profile information (GitHub URL, social links)</li>
              <li>Employment history and education details provided for your portfolio</li>
            </ul>
          </section>

          <section id="usage" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, including 
              generating your developer portfolio, authenticating your account, and providing customer support.
            </p>
          </section>

          <section id="sharing" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal data. Your portfolio information is made public only when you 
              choose to "Publish" your site. We may share data with service providers (like hosting) 
              necessary to run the app.
            </p>
          </section>

          <section id="security" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We use industry-standard encryption to protect your data. However, no method of transmission 
              over the internet is 100% secure.
            </p>
          </section>

          <section id="rights" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time 
              directly through your account settings or by contacting our support team.
            </p>
          </section>

          <div className="mt-16 p-8 bg-indigo-50 rounded-2xl border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Questions?</h3>
            <p className="text-indigo-700 text-sm mb-4">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <Link 
              href="/contact" 
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}