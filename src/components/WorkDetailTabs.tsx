"use client";

import { useState, useEffect } from "react";
import type { WorkForCard } from "@/lib/types";
import { licenseValueText, trainingTypeText } from "@/lib/license";
import { useAuth } from "@/lib/auth";
import AuthorBadge from "./AuthorBadge";
import LicenseBadges from "./LicenseBadges";
import TagPills from "./TagPills";
import WorkActions from "./WorkActions";

interface WorkDetailTabsProps {
  artwork: WorkForCard;
}

export default function WorkDetailTabs({ artwork }: WorkDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "license">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#license") {
      return "license";
    }
    return "overview";
  });

  const license = artwork.license;
  const { user } = useAuth();

  const [acquireStatus, setAcquireStatus] = useState<{
    isDeveloper: boolean;
    canAcquire: boolean;
    alreadyAcquired: boolean;
    reason?: string;
  } | null>(null);
  const [acquiring, setAcquiring] = useState(false);

  useEffect(() => {
    if (!user) {
      setAcquireStatus(null);
      return;
    }
    fetch(
      `/api/works/${artwork.slug}/acquire-status?userSlug=${encodeURIComponent(user.id)}`,
    )
      .then((res) => res.json())
      .then(setAcquireStatus)
      .catch(() => setAcquireStatus(null));
  }, [user, artwork.slug]);

  const handleAcquire = async () => {
    if (!user || acquiring) return;
    setAcquiring(true);
    try {
      const res = await fetch(`/api/works/${artwork.slug}/acquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSlug: user.id }),
      });
      if (res.ok) {
        setAcquireStatus((prev) =>
          prev ? { ...prev, canAcquire: false, alreadyAcquired: true } : prev,
        );
      } else {
        const data = await res.json();
        alert(`取得に失敗しました: ${data.error}`);
      }
    } catch {
      alert("取得に失敗しました");
    } finally {
      setAcquiring(false);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("license")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "license"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          License
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          <AuthorBadge
            artistSlug={artwork.artistProfile.slug}
            artistName={artwork.artistProfile.displayName}
            artistIconUrl={artwork.artistProfile.iconUrl}
            size="md"
          />

          <p className="text-gray-600 leading-relaxed">{artwork.description}</p>

          <TagPills tags={artwork.tags.map((t) => t.name)} />

          <WorkActions likes={artwork.likesCount} comments={artwork.commentsCount} />

          <button
            onClick={() => setActiveTab("license")}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ライセンス詳細を確認 &rarr;
          </button>
        </div>
      )}

      {/* License Tab */}
      {activeTab === "license" && license && (
        <div className="space-y-5">
          <LicenseBadges terms={license} />

          <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">許諾条件</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">商用利用:</span>{" "}
                <span className="font-medium">{licenseValueText(license.commercial)}</span>
              </div>
              <div>
                <span className="text-gray-500">成人向け:</span>{" "}
                <span className="font-medium">{licenseValueText(license.adult)}</span>
              </div>
              <div>
                <span className="text-gray-500">学習タイプ:</span>{" "}
                <span className="font-medium">{trainingTypeText(license.trainingType)}</span>
              </div>
              <div>
                <span className="text-gray-500">再配布:</span>{" "}
                <span className="font-medium">{licenseValueText(license.redistribution)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-gray-900">
              &yen;{license.priceJpy.toLocaleString()}
            </p>

            {/* 未ログイン */}
            {!user && (
              <p className="text-sm text-gray-500">
                取得するにはログインが必要です
              </p>
            )}

            {/* ログイン済み・developer でない */}
            {user && acquireStatus && !acquireStatus.isDeveloper && (
              <p className="text-sm text-gray-400">
                Developer アカウントで取得できます
              </p>
            )}

            {/* developer・取得済み */}
            {user && acquireStatus?.alreadyAcquired && (
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold text-sm">
                  取得済み
                </span>
                <a
                  href="/dashboard/developer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  取得履歴で確認 &rarr;
                </a>
              </div>
            )}

            {/* developer・取得可能 */}
            {user &&
              acquireStatus?.isDeveloper &&
              acquireStatus.canAcquire &&
              !acquireStatus.alreadyAcquired && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleAcquire}
                    disabled={acquiring}
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {acquiring ? "取得中..." : "Acquire license"}
                  </button>
                  <p className="text-xs text-green-600">
                    現在の条件で即時取得できます
                  </p>
                </div>
              )}

            {/* developer・consult 含みで取得不可 */}
            {user &&
              acquireStatus?.isDeveloper &&
              !acquireStatus.canAcquire &&
              !acquireStatus.alreadyAcquired &&
              acquireStatus.reason === "CONSULT_REQUIRED" && (
                <div className="flex flex-col gap-1">
                  <span className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold text-sm">
                    要相談
                  </span>
                  <p className="text-xs text-gray-500">
                    この作品の取得には個別相談が必要です
                  </p>
                </div>
              )}

            {/* ステータス読み込み中 */}
            {user && acquireStatus === null && (
              <span className="text-sm text-gray-400">確認中...</span>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Terms shown here describe allowed usage.
          </p>
        </div>
      )}
    </div>
  );
}
