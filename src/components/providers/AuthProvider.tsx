"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Cek session saat ini
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);

      if (!session && pathname !== "/login") {
        router.push("/login");
      }
    };

    checkSession();

    // Dengarkan perubahan auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session && pathname !== "/login") {
          router.push("/login");
        } else if (session && pathname === "/login") {
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p className="font-hand text-3xl animate-pulse">Sedang masuk ke Rumah Mungil...</p>
      </div>
    );
  }

  // Jika belum login dan ada di selain halaman login, jangan render children (biarkan router bekerja)
  if (!session && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
