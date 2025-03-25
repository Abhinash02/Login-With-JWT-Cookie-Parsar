"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(""); 
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
          setUsername(data.user.username); 
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
    window.location.href = "http://localhost:3000"; 
  };

  if (loading) return <p className="text-center text-gray-300 text-lg">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-5 flex flex-col space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-400">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <FiHome className="text-lg" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <FiUsers className="text-lg" />
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <FiSettings className="text-lg" />
            <span>Settings</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-500 mt-auto"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
          <h1 className="text-xl font-bold">
            Welcome, {username ? ` ${username}` : "Admin"}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </header>
      </main>
    </div>
  );
}
