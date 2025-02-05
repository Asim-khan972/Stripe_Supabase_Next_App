"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.js";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome, {user.email}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Profile"
          description="Manage your account settings and preferences."
          buttonText="View Profile"
          onClick={() => console.log("View Profile clicked")}
        />
        <DashboardCard
          title="Payment Cards"
          description="View and manage your payment methods."
          buttonText="Manage Cards"
          onClick={() => router.push("/payment-cards")}
        />
        <DashboardCard
          title="Activity"
          description="Check your recent account activity."
          buttonText="View Activity"
          onClick={() => console.log("View Activity clicked")}
        />
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600">
          Need help? Contact our support team at{" "}
          <a
            href="mailto:support@example.com"
            className="text-black hover:underline"
          >
            {user.email}
          </a>
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, buttonText, onClick }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          onClick={onClick}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
