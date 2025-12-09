"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, User, Mail, Coins, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CheckButton } from "./CheckButton";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  // Existing state
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle hydration (ensure we only run portal on client)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setDisplayName(
        user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.username ||
          user.email?.split("@")[0] ||
          "User"
      );
    }
  }, [user, isOpen]);

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  // Return null if not mounted (optimization)
  if (!mounted) return null;

  // Wrap the entire return JSX in createPortal
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1], // Custom smooth easing curve
            }}
            className="fixed right-0 top-0 z-[9999] h-full w-full max-w-md bg-white shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <motion.div
              className="flex h-full flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Header Section */}
              <motion.div
                className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                      User Settings
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                className="flex-1 px-6 py-6 space-y-6 overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                {/* User Info Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Name
                    </label>
                    <Input
                      value={displayName}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">
                      Name is managed by your Google account
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      Email
                    </label>
                    <Input
                      value={email}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">
                      Email is managed by your Google account
                    </p>
                  </div>
                </div>

                {/* Billion Section */}
                <div className="space-y-2 border-t pt-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-indigo-600" />
                    Billion
                  </label>
                  <Input
                    type="text"
                    value="Coming soon"
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    This feature is currently disabled
                  </p>
                </div>

                {/* Sign Out Button */}
                <div className="border-t pt-4">
                  <Button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-2 my-2 w">
                    <CheckButton className="w-full" />{" "}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body // Target container
  );
}
