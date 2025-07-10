import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-indigo-50 text-center text-gray-600 border-t border-indigo-100">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <span className="text-sm">
          © {new Date().getFullYear()} DevFolio. Built by Rahel Yabebal.
        </span>
        <a
          href="https://github.com/rahel-yab/DevFolio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:underline mt-1 text-sm"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
