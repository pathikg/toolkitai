"use client";

import { createClient } from "@/lib/supabase/client";
import { Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { UserModal } from "@/components/UserModal";

export function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6">
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .navbar-enter {
          animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      {/* Floating Glassmorphism Container */}
      <div
        className={`relative backdrop-blur-xl bg-white/50 border border-white/20 rounded-3xl shadow-xl shadow-black/5 overflow-hidden max-w-5xl mx-auto ${
          isVisible ? "navbar-enter" : "opacity-0"
        }`}
      >
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/10 pointer-events-none rounded-3xl" />

        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-3xl" />

        <div className="relative px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-16">
            {/* Logo with glass effect */}
            <Link
              href="/tools"
              className="group flex items-center space-x-3 cursor-pointer"
            >
              <div className="relative">
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />

                {/* Glass card for icon */}
                <div className="relative backdrop-blur-sm bg-gradient-to-br from-indigo-500/90 to-purple-600/90 p-2.5 rounded-xl border border-white/20 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
              </div>

              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight group-hover:tracking-wide transition-all duration-300 drop-shadow-sm">
                ToolkitAI
              </span>
            </Link>

            {/* User button with glass effect */}
            {user && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="group relative flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md bg-gradient-to-br from-white/60 to-white/40 border border-white/30 hover:border-white/50 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-indigo-500/10 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="User menu"
              >
                {/* Inner glow on hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />

                <User className="w-5 h-5 text-indigo-600 group-hover:text-purple-600 transition-colors duration-300 relative z-10 drop-shadow-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {user && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          user={user}
        />
      )}
    </nav>
  );
}
