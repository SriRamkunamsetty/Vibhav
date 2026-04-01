"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  const isMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

  useEffect(() => {
    if (isMockAuth) return;
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router, isMockAuth]);

  if (isMockAuth) return <>{children}</>;
  if (loading) return <div>Loading...</div>; // TODO: Professional loading state

  if (!user || user.role !== "ADMIN") return null;

  return <>{children}</>;
};
