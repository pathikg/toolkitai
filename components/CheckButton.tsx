"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function CheckButton({ className }: { className?: string }) {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const handleClick = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.user_metadata.full_name,
          email: user?.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      throw new Error((err as Error).message || "Something went wrong");
    }
  };
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

  console.log(user,'the user ');
  return <Button className={className} onClick={handleClick}>Subscribe</Button>;
}
