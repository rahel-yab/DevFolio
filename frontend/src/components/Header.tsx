"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Image src="/logo.png" alt="DevFolio Logo" width={36} height={36} />
        DevFolio
      </h1>
      <nav className="space-x-4">
        <Link href="/" className="text-gray-600 hover:text-black">
          Home
        </Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-black">
          Dashboard
        </Link>
        <Link href="/login" className="text-gray-600 hover:text-black">
          Login
        </Link>
      </nav>
    </header>
  );
}
