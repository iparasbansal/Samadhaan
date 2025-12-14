// 🌐 React Core
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getGrievances } from "../services/api";
import GrievanceCard from "../components/GrievanceCard";
import TypingText from "../components/TypingText";

// 🎨 Icons
import { 
  BarChart3, 
  Loader2, 
  CheckCircle, 
  ThumbsUp, 
  Clock,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const ALL_CATEGORIES = [
    'Roads & Infrastructure',
    'Water Supply',
    'Electricity',
    'Waste Management',
    'Public Safety',
    'Emergency Services',
    'Other',
]

function DashboardPage() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "All", category: "All", search: "" });
  const [sortBy, setSortBy] = useState("date"); 

  const { isAuthority, isSuperAdmin, user, departmentId } = useAuth();
  
  const [toast, setToast] = useState(null);
  
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    address: "Fetching location..."
  });

  // 🌍 Fetch user’s precise or fallback location with toast
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        showToast("📡 Fetching location… please wait", "info");

        // ⏳ Wait 1s to let GPS stabilize before reading coordinates
        await new Promise((res) => setTimeout(res, 1000));

        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          })
        );

        const { latitude, longitude } = pos.coords;

        // Reverse geocode to get readable address
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const geoJson = await geoRes.json();

        const address = geoJson.display_name || "Unknown location";

        setUserLocation({ latitude, longitude, address });

        showToast(`✅ Accurate location: ${address.split(",")[0]}`, "success");
        console.log("📍 Dashboard accurate location:", { latitude, longitude, address });
      } catch (err) {
        console.warn("⚠️ GPS failed, fallback to IP:", err);

        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          const ipJson = await ipRes.json();
          const fallbackAddress = `${ipJson.city}, ${ipJson.region}`;

          setUserLocation({
            latitude: ipJson.latitude,
            longitude: ipJson.longitude,
            address: fallbackAddress,
          });

          showToast(`🌐 Using approximate location: ${fallbackAddress}`, "info");
        } catch (ipErr) {
          console.error("❌ Both GPS and IP failed:", ipErr);
          setUserLocation({
            latitude: null,
            longitude: null,
            address: "Location unavailable",
          });
          showToast("❌ Unable to fetch location", "error");
        }
      }
    };

    fetchLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // ✅ Haversine distance (in kilometers)
  const getDistanceKm = (loc1, loc2) => {
    if (!loc1?.latitude || !loc2?.latitude) return Infinity;
    const R = 6371;
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((loc1.latitude * Math.PI) / 180) *
        Math.cos((loc2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ✅ Function to show a toast for few seconds
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  const stats = useMemo(() => {
    return grievances.reduce(
      (acc, g) => {
        acc.total++;
        if (g.status === "In Progress") acc.inProgress++;
        if (g.status === "Resolved") acc.resolved++;
        return acc;
      },
      { total: 0, inProgress: 0, resolved: 0 }
    );
  }, [grievances]);

  useEffect(() => {
    setLoading(true);
    getGrievances()
        .then(data => {
            setGrievances(data);
            setLoading(false);
        })
        .catch(err => {
            setError("Failed to load grievances. Please refresh.");
            setLoading(false);
        });
  }, []); 


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Define priority order
  const priorityOrder = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
    Pending: 5,
    undefined: 6,
  };

  // ✅ Filter + Sort grievances by priority
  const filteredGrievances = grievances
  .filter((g) => {
    const matchesStatus = filters.status === "All" || g.status === filters.status;
    const matchesCategory = filters.category === "All" || g.category === filters.category;
    const matchesSearch =
      !filters.search ||
      g.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      g.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      (g.aiPriority || "").toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  })
  .sort((a, b) => {
  if (sortBy === "priority") {
    const aPriority = priorityOrder[a.aiPriority] || 6;
    const bPriority = priorityOrder[b.aiPriority] || 6;
    return aPriority - bPriority;
  } else if (sortBy === "upvotes") {
    return (b.upvotes || 0) - (a.upvotes || 0);
  }
    else if (sortBy === "nearest" && userLocation) { 
  const distA = getDistanceKm(userLocation, a.location);
  const distB = getDistanceKm(userLocation, b.location);
  return distA - distB;
    }
    else {
    // Default: newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  }
});

  return (
    <motion.div
      className="relative min-h-screen px-6 py-10 overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      {/* Header */}
     <motion.div
  className="mb-10 space-y-6"
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Header + Filters Container */}
  <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
  {/* Left Section (Title + Search) */}
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
        Dashboard
      </h2>
      <p className="text-slate-400 text-sm mt-1">
        {isSuperAdmin
          ? "Viewing all departments"
          : isAuthority
          ? `Department: ${departmentId}`
          : "Public grievances overview"}
      </p>
    </div>

    {/* 🔍 Search Bar */}
    <div className="relative w-full sm:w-96">
      <input
        type="text"
        value={filters.search || ""}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        className="w-full px-4 py-2 rounded-xl bg-slate-900/70 border border-cyan-400/30 text-white 
                    placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      />
      {(!filters.search || filters.search.trim() === "") && (
        <motion.span
          key="search-typing-placeholder"
          className="absolute left-4 top-2.5 text-slate-400 pointer-events-none text-sm"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <TypingText
            texts={[
              "Search 'fire hazard' 🔥",
              "Try 'electricity issue' ⚡",
              "Type 'road damage' 🚧",
              "Search by 'Critical' priority 🚨",
            ]}
            typingSpeed={100}
            deletingSpeed={50}
            pauseTime={1000}
          />
        </motion.span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-4 top-2.5 h-5 w-5 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
        />
      </svg>
    </div>
  </div>

  {/* Right Section (Filters + Sorting) */}
  <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3">
    {/* Sorting Buttons */}
    <div className="flex flex-wrap gap-2">
      {[
        { id: "date", label: "Newest", icon: <Clock className="h-4 w-4" /> },
        { id: "upvotes", label: "Most Upvoted", icon: <ThumbsUp className="h-4 w-4" /> },
        { id: "priority", label: "Highest Priority", icon: <AlertTriangle className="h-4 w-4" /> },
        { id: "nearest", label: "Most Nearest", icon: <MapPin className="h-4 w-4" /> },
      ].map((btn) => (
        <motion.button
          key={btn.id}
          onClick={() => setSortBy(btn.id)}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            sortBy === btn.id
              ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md"
              : "bg-white/10 text-slate-300 hover:bg-cyan-500/10"
          }`}
        >
          {btn.icon}
          {btn.label}
        </motion.button>
      ))}
    </div>

    {/* Filters */}
    <select
      name="status"
      value={filters.status}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-slate-900/70 border border-cyan-400/30 text-white focus:ring-2 focus:ring-cyan-400"
    >
      <option>All</option>
      <option>Submitted</option>
      <option>In Progress</option>
      <option>Resolved</option>
    </select>

    <select
      name="category"
      value={filters.category}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-slate-900/70 border border-cyan-400/30 text-white focus:ring-2 focus:ring-cyan-400"
    >
      <option>All</option>
      {ALL_CATEGORIES.map((cat) => (
        <option key={cat}>{cat}</option>
      ))}
    </select>
  </div>
</div>

  {/* ✅ Toast Notification (Animated) */}
<AnimatePresence>
  {toast && (
    <motion.div
      key="toast"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium z-50
        ${toast.type === "success" ? "bg-emerald-600/90" :
          toast.type === "error" ? "bg-rose-600/90" :
          toast.type === "info" ? "bg-cyan-600/90" : "bg-slate-600/90"}`}
    >
      {toast.message}
    </motion.div>
  )}
</AnimatePresence>

</motion.div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Grievances", value: stats.total, color: "from-cyan-500 to-indigo-500", icon: <BarChart3 className="h-6 w-6" /> },
          { label: "In Progress", value: stats.inProgress, color: "from-amber-500 to-orange-500", icon: <Clock className="h-6 w-6" /> },
          { label: "Resolved", value: stats.resolved, color: "from-emerald-500 to-teal-500", icon: <CheckCircle className="h-6 w-6" /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${stat.color} p-[1px] shadow-lg`}
          >
            <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex justify-center mb-2 text-white">{stat.icon}</div>
              <p className="text-sm text-slate-300">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-3xl opacity-30"></div>
          </motion.div>
        ))}
      </div>

      {/* Grievance List */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-rose-400">{error}</div>
      ) : filteredGrievances.length === 0 ? (
        <div className="text-center text-slate-400 py-10 border border-slate-700/50 rounded-xl bg-slate-900/50 backdrop-blur-xl">
          No grievances found matching your filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrievances.map((g, index) => (
            <GrievanceCard
              key={g._id}
              grievance={g}
              index={index}
              isAuthority={isAuthority}
              currentUserId={user?.id}
              showToast={showToast} 
              userLocation={userLocation} 
              getDistanceKm={getDistanceKm}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default DashboardPage;