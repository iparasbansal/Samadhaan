// 🌐 React Core
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateGrievance, deleteGrievance } from "../services/api";
import { Button } from "./ui";

// 🎨 Icons
import { 
  Loader2, 
  Settings, 
  RefreshCw, 
  Trash
} from "lucide-react";


// --- NEW Component: DepartmentAdminTools (For Status Updates) ---
function DepartmentAdminTools({ grievance, isAuthority, showToast }) {
    const { token } = useAuth();
    const [status, setStatus] = useState(grievance.status);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus) => {
        if (status === newStatus || loading) return;

        setLoading(true);
        try {
            await updateGrievance(grievance._id, { status: newStatus }, token);
            setStatus(newStatus);
            showToast(`Status updated to: ${newStatus}`, "success");
        } catch (error) {
            console.error("Status update failed:", error);
            showToast("Failed to update status.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this grievance? This cannot be undone.")) return;
        
        setLoading(true);
        try {
            await deleteGrievance(grievance._id, token);
            showToast("Grievance permanently deleted.", "success");
            // You might want to refresh the grievances list on the parent component
        } catch (error) {
            console.error("Deletion failed:", error);
            showToast("Failed to delete grievance.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthority) return null;

    return (
        <div className="mt-4 pt-3 border-t border-white/20 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                <Settings className="h-4 w-4" /> Admin Tools
            </div>
            
            {/* Status Update Buttons */}
            <div className="flex flex-wrap gap-2">
                {["Submitted", "In Progress", "Resolved"].map((s) => (
                    <Button
                        key={s}
                        size="sm"
                        variant={s === status ? "upvoted" : "secondary"}
                        onClick={() => handleStatusChange(s)}
                        disabled={loading}
                        className={`text-xs ${s === "Resolved" ? 'bg-emerald-600 hover:bg-emerald-700' : s === "In Progress" ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-600 hover:bg-slate-700'}`}
                    >
                        {loading && s === status ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                        {s}
                    </Button>
                ))}
            </div>

            {/* Delete Button */}
            <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="text-xs"
            >
                <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
        </div>
    );
}

export default DepartmentAdminTools;