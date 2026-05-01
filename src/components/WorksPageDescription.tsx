"use client";

import { useAuth } from "@/lib/auth";

export default function WorksPageDescription() {
  const { user, isLoading } = useAuth();

  return (
    <div className="text-sm text-gray-500 mb-6 space-y-0.5">
      <p>Artliに投稿された作品を、タグや作家名から探せます。</p>
      <p>気になる作品や作家を見つけて、詳細ページからさらに閲覧できます。</p>
      {!isLoading && user?.isDeveloper && (
        <p className="text-xs text-gray-400 mt-1">
          Developerアカウントでは、作品ごとの利用条件を確認し、必要に応じて許諾取得を行えます。
        </p>
      )}
    </div>
  );
}
