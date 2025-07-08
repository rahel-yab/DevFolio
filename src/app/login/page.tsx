"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    setSuccess("Login submitted! (No real authentication yet)");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-indigo-50">
      <div className="w-full max-w-md bg-indigo-100 rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 mb-1 font-bold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border-2 border-gray-400 rounded bg-white text-gray-900 focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 mb-1 font-bold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border-2 border-gray-400 rounded bg-white text-gray-900 focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-400 to-blue-400 text-white py-2 rounded font-semibold shadow hover:from-indigo-500 hover:to-blue-500 transition"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
