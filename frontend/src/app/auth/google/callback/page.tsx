"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService } from "../../../../services/api";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Finishing Google sign-in...");

  useEffect(() => {
    const status = searchParams.get("status");
    const errorMessage = searchParams.get("message");

    if (status !== "success") {
      router.replace(`/login?message=${encodeURIComponent(errorMessage || "Google sign-in failed.")}`);
      return;
    }

    const complete = async () => {
      try {
        await apiService.refreshToken();
        await apiService.getProfile();
        window.location.href = "/dashboard";
      } catch (error) {
        setMessage("Google sign-in finished, but the session could not be loaded.");
        setTimeout(() => {
          router.replace("/login?message=Google sign-in failed.");
        }, 1200);
      }
    };

    complete();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="shell-card max-w-md rounded-[2rem] p-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
        <p className="mt-4 text-sm text-slate-700">{message}</p>
      </div>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="shell-card max-w-md rounded-[2rem] p-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
          </div>
        </main>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
