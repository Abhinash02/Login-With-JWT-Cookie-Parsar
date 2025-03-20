"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin", { credentials: "include" });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();

        if (data.user.role !== "admin") {
          router.push("/login");
        } else {
          setRole("admin");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
    router.push("/");
  };

  if (loading) return <p className="text-center text-gray-300 text-lg">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
        <p className="text-gray-400 mb-4">You have full access to the admin dashboard.</p>
        
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
