// 🌐 React Core
import React, { Fragment, useState } from "react";
import { motion } from "framer-motion";

// 🧠 UI & Components
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import { Button, Badge, Modal } from "./ui";
import TypingText from "./TypingText";

// 🎨 Icons
import { 
  Globe, 
  Plus,
  User,
  Shield,
  Crown,
  ChevronDown,
} from "lucide-react";

function Layout({ children, onNavigate }) {
    const { user, userRole, isAuthority, isSuperAdmin, firstName, isEmailVerified, departmentId, logout, isAuthenticated, unskip } = useAuth();
    const isSubmitEnabled = user && isEmailVerified;
    const [loginModal, setLoginModal] = useState({ show: false, message: "" });
    
    const handleLogout = () => {
      logout();
    };

    const handleAnonymousSubmitClick = () => {
      setLoginModal({ show: true, message: "Please log in to submit a grievance." });
    };
    
    const UserDisplay = () => {
      let displayName = firstName || (user ? user.email : 'Guest');
      let displayTitle = user ? user.email : 'Guest';
      
      return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-1 shadow-lg">
          <span className="text-sm text-cyan-200 font-medium">Welcome,</span>
          <span
            className="truncate font-semibold text-white"
            title={displayTitle}
          >
            {displayName}
          </span>
          {isSuperAdmin && (
            <Badge variant="critical">
              <Crown className="mr-1 h-3 w-3" /> SUPER ADMIN
            </Badge>
          )}
          {isAuthority && !isSuperAdmin && (
            <Badge variant="primary">
              <Shield className="mr-1 h-3 w-3" /> {departmentId}
            </Badge>
          )}
        </div>
      );
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-slate-100">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/20 bg-slate-900/80">
          <div className="container mx-auto flex justify-between items-center p-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate('dashboard')}
            >
              <Globe className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_6px_#06b6d4]" />
              <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
 <TypingText 
    texts={[
      'SAMADHAAN',
      'Public Grievance Portal', 
      'AI-Powered Issue Resolver'
    ]} 
  />
</h1>

            </div>
            
            <div className="flex items-center gap-4">
              <UserDisplay />
              <Button
                onClick={isAuthenticated ? () => onNavigate('submit') : handleAnonymousSubmitClick}
                disabled={isAuthenticated && !isSubmitEnabled}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400"
              >
                <Plus className="h-4 w-4 mr-1 inline-block" />
                Submit
              </Button>
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
                  <User className="h-4 w-4" /> Profile
                  <ChevronDown className="h-4 w-4" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-slate-900/90 border border-white/10 shadow-lg backdrop-blur-xl focus:outline-none">
                    <div className="py-1">
                      {isAuthenticated ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onNavigate('profile')}
                                className={`${
                                  active ? 'bg-cyan-500/20' : ''
                                } w-full text-left px-4 py-2 text-sm text-white`}
                              >
                                👤 My Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onNavigate('mycomplaints')}
                                className={`${
                                  active ? 'bg-cyan-500/20' : ''
                                } w-full text-left px-4 py-2 text-sm text-white`}
                              >
                                📄 My Complaints
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-rose-600/20' : ''
                                } w-full text-left px-4 py-2 text-sm text-rose-400`}
                              >
                                🚪 Sign Out
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={unskip}
                              className={`${
                                active ? 'bg-cyan-500/20' : ''
                              } w-full text-left px-4 py-2 text-sm text-white`}
                            >
                              🚪 Login
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

          </div>
        </nav>
        
        {/* Main Content */}
        <motion.main
          className="container mx-auto py-10 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
        
        {/* Footer */}
        <footer className="text-center text-slate-400 py-6 border-t border-white/10">
          © 2025 Public Grievance Portal. All rights reserved.
        </footer>

        <Modal
          show={loginModal.show}
          title="Login Required"
          onClose={() => setLoginModal({ show: false, message: "" })}
          type="info"
        >
          <p>{loginModal.message}</p>
        </Modal>
      </div>
    );
  }

  export default Layout;