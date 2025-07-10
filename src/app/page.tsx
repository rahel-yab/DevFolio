import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-indigo-50 overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-10">
        <img
          src="public/logo.png"
          alt="DevFolio Logo Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow p-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center">
          AI-powered Developer Portfolio Builder
        </h1>
        <p className="text-xl text-gray-700 text-center max-w-2xl mb-8">
          Build your own stunning developer portfolio in minutes. Leverage smart
          templates, AI-powered suggestions, and modern design to showcase your
          skills and projects effortlessly.
        </p>
        <Link href="/templates">
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-400 to-blue-400 text-white rounded-lg text-lg font-semibold shadow hover:from-indigo-500 hover:to-blue-500 transition">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
