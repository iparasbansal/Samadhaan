// 🌐 React Core
import React from "react";
import { motion } from "framer-motion";

// 🎨 Icons
import { 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
} from "lucide-react";


export const Button = React.forwardRef(({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-800',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        upvoted: 'bg-blue-600 text-white hover:bg-blue-700', 
    };
    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
    };
    return (
        <button
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
});

export const Input = React.forwardRef(({ className = '', type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-cyan-400/30 bg-slate-900/70 text-white px-3 py-2 text-sm placeholder:text-slate-400 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 
    focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 
    transition-all duration-300 hover:border-cyan-300/60 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] ${className}`}
    ref={ref}
    {...props}
  />
));

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    className={`flex min-h-[100px] w-full rounded-md border border-cyan-400/30 bg-slate-900/70 text-white px-3 py-2 text-sm 
    placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 
    focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 
    transition-all duration-300 hover:border-cyan-300/60 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] ${className}`}
    ref={ref}
    {...props}
  />
));

export const Modal = ({ show, onClose, title, children, type = 'info' }) => {
  if (!show) return null;

  const icons = {
    info: <Info className="h-6 w-6 text-cyan-400" />,
    success: <CheckCircle className="h-6 w-6 text-emerald-400" />,
    error: <AlertTriangle className="h-6 w-6 text-rose-400" />,
  };
  const iconBgs = {
    info: 'bg-cyan-500/10',
    success: 'bg-emerald-500/10',
    error: 'bg-rose-500/10',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-6 shadow-[0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-2xl text-white"
      >
        <div className="flex items-start">
          <div className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgs[type]}`}>
            {icons[type]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-cyan-300">{title}</h3>
            <div className="mt-2 text-sm text-slate-300">{children}</div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button onClick={onClose} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg hover:from-cyan-400 hover:to-indigo-400 transition-all">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};


export const GlobalSpinner = ({ message = "Loading..." }) => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
    </div>
);

export const Badge = ({ className = '', variant = 'default', children }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800 border-gray-300',
        success: 'bg-green-100 text-green-800 border-green-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        destructive: 'bg-red-100 text-red-800 border-red-300',
        critical: 'bg-red-700 text-white border-red-800 animate-pulse', 
        primary: 'bg-blue-600 text-white border-blue-700', 
    };
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase leading-5 border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
