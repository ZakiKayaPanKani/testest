"use client";

import { useAuth } from "@/lib/auth";

export default function ArtistsPageDescription() {
  const { user, isLoading } = useAuth();

  return (
    <div className="text-sm text-gray-500 mb-6">
      <p>Artliで活動する作家を見つけ、作品や作風をたどることができます。</p>
      {!isLoading && user?.isDeveloper && (
        <p className="text-xs text-gray-400 mt-1">
          Developerアカウントでは、作家ごとの利用条件ポリシーを確認できます。
        </p>
      )}
    </div>
  );
}
