"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext.js";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-lg">
        <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold">
          My App
        </Link>
      </h1>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>{user.email}</span>
            <Link
              href="/payment-cards"
              className="bg-green-500 px-3 py-1 rounded"
            >
              Manage Cards
            </Link>

            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-blue-500 px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
