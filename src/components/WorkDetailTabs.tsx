"use client";

import { useState, useEffect } from "react";
import type { WorkForCard } from "@/lib/types";
import { licenseValueText, trainingTypeText } from "@/lib/license";
import { useAuth } from "@/lib/auth";
import AuthorBadge from "./AuthorBadge";
import LicenseBadges from "./LicenseBadges";
import TagPills from "./TagPills";
import WorkActions from "./WorkActions";
import AcquireModal from "./AcquireModal";

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="ml-1 inline-flex items-center cursor-help group relative">
      <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {text}
      </span>
    </span>
  );
}

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
  const { user, isLoading } = useAuth();
  const showTabs = !!user?.isDeveloper;

  useEffect(() => {
    if (!isLoading && !user?.isDeveloper && activeTab === "license") {
      setActiveTab("overview");
    }
  }, [user, activeTab, isLoading]);

  const [acquireStatus, setAcquireStatus] = useState<{
    isDeveloper: boolean;
    canAcquire: boolean;
    alreadyAcquired: boolean;
    reason?: string;
  } | null>(null);
  const [acquiring, setAcquiring] = useState(false);
  const [showAcquireModal, setShowAcquireModal] = useState(false);

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
        setShowAcquireModal(false);
        setAcquireStatus((prev) =>
          prev ? { ...prev, canAcquire: false, alreadyAcquired: true } : prev,
        );
        setShowAcquireModal(false);
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
      {/* Tabs (Developer only) */}
      {showTabs && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            概要
          </button>
          <button
            onClick={() => setActiveTab("license")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "license"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            利用条件
          </button>
        </div>
      )}

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
        </div>
      )}

      {/* License Tab */}
      {activeTab === "license" && license && (
        <div className="space-y-5">
          <LicenseBadges terms={license} />

          <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">この作品の利用条件</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">商用利用:<InfoTooltip text="商用目的での利用可否を示します" /></span>{" "}
                <span className="font-medium">
                  {licenseValueText(license.commercial)}
                  {license.commercial === "consult" && <InfoTooltip text="クリエイターとの個別確認が必要な条件です" />}
                </span>
              </div>
              <div>
                <span className="text-gray-500">成人向け利用:<InfoTooltip text="成人向けコンテンツでの利用可否を示します" /></span>{" "}
                <span className="font-medium">
                  {licenseValueText(license.adult)}
                  {license.adult === "consult" && <InfoTooltip text="クリエイターとの個別確認が必要な条件です" />}
                </span>
              </div>
              <div>
                <span className="text-gray-500">AI学習利用:<InfoTooltip text="クリエイターが許可するAI学習利用の範囲を示します" /></span>{" "}
                <span className="font-medium">{trainingTypeText(license.trainingType)}</span>
              </div>
              <div>
                <span className="text-gray-500">再配布:<InfoTooltip text="この作品を第三者に再配布できるかを示します" /></span>{" "}
                <span className="font-medium">
                  {licenseValueText(license.redistribution)}
                  {license.redistribution === "consult" && <InfoTooltip text="クリエイターとの個別確認が必要な条件です" />}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-lg font-medium text-gray-700">
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
                開発者アカウントで取得できます
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
                  許諾取得履歴で確認 &rarr;
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
                    onClick={() => setShowAcquireModal(true)}
                    disabled={acquiring}
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {acquiring ? "取得中..." : "この条件で許諾を取得"}
                  </button>
                  <p className="text-xs text-gray-500">
                    取得後、表示された条件に基づいて利用できます
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
                    要相談の条件が含まれるため、現在の自動取得フローでは許諾取得できません。個別相談が必要です。
                  </p>
                </div>
              )}

            {/* ステータス読み込み中 */}
            {user && acquireStatus === null && (
              <span className="text-sm text-gray-400">確認中...</span>
            )}
          </div>

          <p className="text-xs text-gray-400">
            ここに表示される内容は、この作品に設定された利用条件です。
          </p>
        </div>
      )}

      {showAcquireModal && license && (
        <AcquireModal
          license={license}
          acquiring={acquiring}
          onConfirm={handleAcquire}
          onCancel={() => setShowAcquireModal(false)}
        />
      )}
    </div>
  );
}
