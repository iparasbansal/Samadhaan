// 🌐 React Core
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { updateGrievance } from "../services/api";
import DepartmentAdminTools from "./DepartmentAdminTools";
import { Badge } from "./ui";


// --- GrievanceCard Component with Upvote + Priority Colors + Admin Tools ---
function GrievanceCard({ grievance, index, isAuthority, currentUserId, showToast, getDistanceKm, userLocation }) {
  const { token } = useAuth();
  const [localUpvotes, setLocalUpvotes] = useState(grievance.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(grievance.upvotedBy?.includes(currentUserId));
  const [upvoting, setUpvoting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const distance = userLocation && grievance.location ? getDistanceKm(userLocation, grievance.location) : null;

  const priorityColors = {
    Critical: "from-rose-700/80 to-red-900/60",
    High: "from-amber-600/80 to-orange-800/60",
    Medium: "from-cyan-600/70 to-sky-800/60",
    Low: "from-emerald-600/70 to-green-800/60",
    Pending: "from-slate-700/80 to-slate-900/60",
    Submitted: "from-slate-700/80 to-slate-900/60", 
  };

  const handleUpvote = async () => {
    if (isAuthority || upvoting) return;
    setUpvoting(true);
    try {
      const newCount = isUpvoted ? localUpvotes - 1 : localUpvotes + 1;
      const upvotedBy = isUpvoted
        ? grievance.upvotedBy.filter(id => id !== currentUserId)
        : [...grievance.upvotedBy, currentUserId];

      await updateGrievance(grievance._id, { upvotes: newCount, upvotedBy }, token);

      showToast(isUpvoted ? "Upvote removed 👎" : "Upvoted successfully 🎉", "success");
      setLocalUpvotes(newCount);
      setIsUpvoted(!isUpvoted);
    } catch (error) {
      console.error("Upvote failed:", error);
    } finally {
      setUpvoting(false);
    }
  };

  const borderColor =
    grievance.aiPriority === "Critical"
      ? "border-rose-500/60"
      : grievance.aiPriority === "High"
      ? "border-amber-400/60"
      : grievance.aiPriority === "Medium"
      ? "border-cyan-400/60"
      : grievance.aiPriority === "Low"
      ? "border-emerald-400/60"
      : "border-slate-600/60";

  return (
    <>
      {/* 🧱 Grievance Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        className={`relative overflow-hidden rounded-2xl ${borderColor} border-2 p-6 shadow-lg 
                    bg-gradient-to-br ${priorityColors[grievance.aiPriority] || priorityColors[grievance.status]}
                    backdrop-blur-2xl hover:shadow-cyan-500/40 transition-all duration-300 cursor-pointer`}
        onClick={() => setShowDetails(true)}
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-white line-clamp-1">
              {grievance.title}
            </h3>
            <Badge
              variant={
                grievance.status === "Resolved"
                  ? "success"
                  : grievance.status === "In Progress"
                  ? "warning"
                  : "default"
              }
            >
              {grievance.status}
            </Badge>
          </div>

          {/* Short Description */}
          <p className="text-slate-200 text-sm mb-3 line-clamp-3">
            {grievance.description}
          </p>

          {/* Small Location + Distance */}
          {grievance.location && (
            <p className="text-xs text-cyan-300 mb-2">
              📍 {grievance.location.address?.split(",")[0] || "Unknown Location"}
              {distance !== null && (
                <span className="text-slate-400 ml-1">
                  • {distance.toFixed(1)} km away
                </span>
              )}
            </p>
          )}

          {/* Footer Info */}
          <div className="flex justify-between items-center mt-3 text-xs text-slate-300">
            <span>Dept: {grievance.category || "Unassigned"}</span>
            <span>Priority: {grievance.aiPriority || "Pending"}</span>
          </div>

          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            disabled={upvoting || isAuthority}
            className={`absolute bottom-4 right-4 flex items-center gap-2 text-sm font-semibold rounded-full px-3 py-1 transition-all
              ${isUpvoted ? "bg-blue-600 text-white" : "bg-black/20 text-slate-200 hover:bg-black/40"}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            👍 {localUpvotes}
          </button>
        </div>
      </motion.div>

      {/* Modal for details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="w-full max-w-lg bg-slate-800/80 border border-cyan-400/20 rounded-2xl p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3 text-cyan-300">{grievance.title}</h2>
            <p className="text-slate-300 mb-4">{grievance.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><strong className="text-cyan-400">Department:</strong> {grievance.category}</div>
                <div><strong className="text-cyan-400">AI Priority:</strong> {grievance.aiPriority}</div>
                <div><strong className="text-cyan-400">Status:</strong> {grievance.status}</div>
                <div><strong className="text-cyan-400">Upvotes:</strong> {localUpvotes}</div>
            </div>

            {grievance.summary && (
                <p className="text-sm text-slate-300 mb-2">
                    <strong className="text-cyan-400">AI Summary:</strong> {grievance.summary}
                </p>
            )}

            {grievance.location?.address && (
                <p className="text-sm text-slate-300 mb-4">
                    <strong className="text-cyan-400">Location:</strong> {grievance.location.address}
                </p>
            )}

            <DepartmentAdminTools 
                grievance={grievance}
                isAuthority={isAuthority}
                showToast={showToast}
            />

            <button
              onClick={() => setShowDetails(false)}
              className="mt-6 w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-indigo-400"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default GrievanceCard;