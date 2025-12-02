"use client";

import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { Film, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CinematicStoryboardClient from "./cinematic-storyboard-client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CinematicStoryboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        setShowLoginModal(true);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowLoginModal(false);
      } else {
        setShowLoginModal(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => router.push("/tools")}
          redirectAfterLogin="/tools/cinematic-storyboard"
        />
      )}
      <div
        className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${
          !user ? "blur-sm" : ""
        }`}
      >
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Cinematic Storyboard
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Transform a single image into a professional 6-shot storyboard
              with different camera angles.
            </p>
          </div>

          <CinematicStoryboardClient />
        </main>
      </div>
    </>
  );
}
