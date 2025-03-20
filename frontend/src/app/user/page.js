"use client";

import { useRouter } from "next/navigation";

function UserDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">User Dashboard</h1>
        <p className="text-gray-400 mb-6">Welcome to your dashboard. Enjoy your session!</p>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
