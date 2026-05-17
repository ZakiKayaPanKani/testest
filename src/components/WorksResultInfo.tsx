"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { WorksSearchFilters } from "@/lib/queries";

interface WorksResultInfoProps {
  total: number;
  filters: WorksSearchFilters;
  hasActiveFilters: boolean;
}

const trainingTypeLabels: Record<string, string> = {
  light: "軽度",
  standard: "標準",
  strong: "強度",
};

const nonQFilterLabels: { key: Exclude<keyof WorksSearchFilters, "q" | "sort">; render: (v: string) => string }[] = [
  { key: "trainingType", render: (v) => `学習: ${trainingTypeLabels[v] ?? v}` },
  { key: "commercial", render: () => "商用OK" },
  { key: "adult", render: () => "成人向けOK" },
  { key: "consult", render: () => "要相談除く" },
];

export default function WorksResultInfo({
  total,
  filters,
  hasActiveFilters,
}: WorksResultInfoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!hasActiveFilters) return null;

  const qKeywords = filters.q
    ? filters.q.split(/[\s\u3000]+/).filter((k) => k)
    : [];

  const handleRemoveKeyword = (keyword: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const remaining = qKeywords.filter((k) => k !== keyword);
    if (remaining.length > 0) {
      params.set("q", remaining.join(" "));
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    router.push(qs ? `/works?${qs}` : "/works");
  };

  const handleRemoveFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const qs = params.toString();
    router.push(qs ? `/works?${qs}` : "/works");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">{total}件</span>

      {qKeywords.map((keyword) => (
        <span
          key={`q-${keyword}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
        >
          &quot;{keyword}&quot;
          <button
            type="button"
            onClick={() => handleRemoveKeyword(keyword)}
            className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-gray-300 transition-colors text-gray-400 hover:text-gray-600"
            aria-label={`${keyword} を削除`}
          >
            ×
          </button>
        </span>
      ))}

      {nonQFilterLabels.map(({ key, render }) => {
        const value = filters[key];
        if (!value) return null;
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
          >
            {render(value)}
            <button
              type="button"
              onClick={() => handleRemoveFilter(key)}
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-gray-300 transition-colors text-gray-400 hover:text-gray-600"
              aria-label={`${render(value)} を削除`}
            >
              ×
            </button>
          </span>
        );
      })}

      <Link
        href="/works"
        className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors ml-1"
      >
        すべてクリア
      </Link>
    </div>
  );
}
