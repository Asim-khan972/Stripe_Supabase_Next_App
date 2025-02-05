"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext.js";

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying login...");
  const { setUser } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        handleMagicLogin(access_token, refresh_token);
      } else {
        setMessage("Invalid or expired link.");
      }
    }
  }, []);

  const handleMagicLogin = async (access_token, refresh_token) => {
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    console.log("data in magic link call back ", data);
    if (error) {
      setMessage("Failed to verify login.");
    } else {
      setMessage("Login successful! Redirecting...");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
      </div>
    </div>
  );
}
