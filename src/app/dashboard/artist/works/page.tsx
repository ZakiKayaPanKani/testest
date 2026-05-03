"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import TagPills from "@/components/TagPills";
import type { LicenseValue, TrainingType } from "@/lib/types";

const statusStyles: Record<string, string> = {
  public: "bg-green-100 text-green-700",
  private: "bg-gray-100 text-gray-600",
  draft: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  public: "公開中",
  private: "非公開",
  draft: "下書き",
};

interface DashboardWork {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  status: string;
  likes: number;
  acquisitions: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  licenseTerms: {
    commercial: string;
    adult: string;
    trainingType: string;
    redistribution: string;
  } | null;
}

function getLicenseHighlights(
  terms: DashboardWork["licenseTerms"]
): string[] {
  if (!terms) return [];
  const items: string[] = [];

  switch (terms.commercial as LicenseValue) {
    case "allowed":
      items.push("商用OK");
      break;
    case "consult":
      items.push("商用: 要相談");
      break;
    default:
      break;
  }

  if (
    terms.trainingType === "light" ||
    terms.trainingType === "standard" ||
    terms.trainingType === "strong"
  ) {
    items.push(`学習: ${terms.trainingType as TrainingType}`);
  }

  return items.slice(0, 2);
}

export default function WorksListPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [works, setWorks] = useState<DashboardWork[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user || !user.isArtist) return;
    setDataLoading(true);
    fetch(`/api/dashboard/artist/works?userSlug=${encodeURIComponent(user.id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: { works: DashboardWork[] }) => {
        setWorks(data.works ?? []);
      })
      .catch(() => {
        setWorks([]);
      })
      .finally(() => setDataLoading(false));
  }, [user]);

  if (isLoading || (user?.isArtist && dataLoading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  if (!user.isArtist) {
    router.push("/dashboard/artist");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">作品管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            投稿した作品の一覧と管理
          </p>
        </div>
        <Link
          href="/dashboard/artist/works/new"
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新しい作品を投稿
        </Link>
      </div>

      {works.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">まだ作品がありません</h2>
          <p className="text-sm text-gray-500 mb-6">最初の作品を投稿しましょう。</p>
          <Link
            href="/dashboard/artist/works/new"
            className="inline-flex px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            新しい作品を投稿
          </Link>
        </div>
      ) : (
        /* Works list */
        <div className="space-y-4">
          {works.map((work) => {
            const licenseHighlights = getLicenseHighlights(work.licenseTerms);
            return (
              <div
                key={work.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-40 h-28 flex-shrink-0">
                  {work.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover rounded-lg bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-gray-100" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {work.title}
                    </h3>
                    <span
                      className={`inline-flex flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[work.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {statusLabels[work.status] ?? work.status}
                    </span>
                  </div>
                  {work.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {work.description}
                    </p>
                  )}
                  {work.tags.length > 0 && (
                    <div className="mb-2">
                      <TagPills tags={work.tags} limit={5} />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span className="text-sm text-gray-500">♥ {work.likes}</span>
                    {licenseHighlights.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 sm:items-end justify-end flex-shrink-0">
                  <Link
                    href={`/dashboard/artist/works/${work.id}/edit`}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    編集
                  </Link>
                  {work.status === "public" && (
                    <Link
                      href={`/works/${work.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      作品詳細
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
