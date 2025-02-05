"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.js";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8">
        Welcome to MyApp
      </h1>
      <p className="text-xl md:text-2xl text-center max-w-2xl px-4">
        Discover the power of our Next.js application with Supabase integration.
        Manage your payments, access your account, and more!
      </p>
    </div>
  );
}
