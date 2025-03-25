"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [username, setUsername] = useState(""); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/user", { credentials: "include" });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();

        setUsername(data.user?.username || "Guest"); 
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
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}! 😊</h1>
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
