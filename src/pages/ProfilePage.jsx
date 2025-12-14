// 🌐 React Core
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { getGrievances } from "../services/api";

function ProfilePage() {
  const { user, firstName } = useAuth();
  const [stats, setStats] = useState({ total: 0, resolved: 0, progress: 0, pending: 0 });

  if (!user)
    return (
      <div className="text-center py-10 text-slate-300">
        Please log in to view your profile.
      </div>
    );

  // 🔹 Fetch user complaint stats
  useEffect(() => {
    getGrievances()
      .then(data => {
        const userComplaints = data.filter(c => c.submitterUserId === user.id);
        const resolved = userComplaints.filter((c) => c.status === "Resolved").length;
        const progress = userComplaints.filter((c) => c.status === "In Progress").length;
        const pending = userComplaints.filter((c) => c.status === "Submitted" || c.status === "Pending").length;
        setStats({
          total: userComplaints.length,
          resolved,
          progress,
          pending,
        });
      })
      .catch(err => console.error(err));
  }, [user]);

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-slate-900/70 border border-white/10 rounded-2xl p-8 text-white shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
        My Profile
      </h2>

      {/* Profile Info */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Name:</span>
            <span className="font-medium text-white">{firstName || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Email:</span>
            <span className="font-medium text-white">{user.email}</span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">User ID:</span>
            <span className="font-mono text-xs text-slate-400">{user.id}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {[
            { label: "Total", value: stats.total, color: "from-cyan-500 to-blue-600" },
            { label: "Resolved", value: stats.resolved, color: "from-emerald-500 to-green-600" },
            { label: "In Progress", value: stats.progress, color: "from-amber-500 to-orange-600" },
            { label: "Pending", value: stats.pending, color: "from-rose-500 to-red-600" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl bg-gradient-to-br ${item.color} p-4 text-center shadow-lg`}
            >
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="text-sm text-white/80">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;