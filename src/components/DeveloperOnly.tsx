"use client";

import { useAuth } from "@/lib/auth";
import type { ReactNode } from "react";

interface DeveloperOnlyProps {
  children: ReactNode;
  /** 読み込み中に表示する内容（デフォルト: null） */
  fallback?: ReactNode;
}

export default function DeveloperOnly({ children, fallback = null }: DeveloperOnlyProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <>{fallback}</>;
  if (!user?.isDeveloper) return null;

  return <>{children}</>;
}
