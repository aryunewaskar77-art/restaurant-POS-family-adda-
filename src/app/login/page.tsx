"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PinPad } from "@/components/ui/PinPad";
import { loginWithPin } from "@/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (pin: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginWithPin(pin);

      if (result.success && result.role) {
        const from = searchParams.get("from");
        
        if (from) {
          router.push(from);
        } else {
          // Route based on role
          if (result.role === "admin" || result.role === "manager") {
            router.push("/admin");
          } else {
            router.push("/kitchen");
          }
        }
      } else {
        setError(result.error || "Invalid PIN");
        setIsLoading(false);
      }
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <PinPad
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      title="Enter your PIN"
    />
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-4xl">🍽️</span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-800 tracking-tight">
          Family Adda
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Staff Portal Access
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
