"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import DeveloperOnly from "@/components/DeveloperOnly";
import type { WorksSearchFilters } from "@/lib/queries";

const trainingTypes = [
  { value: "light", label: "Light" },
  { value: "standard", label: "Standard" },
  { value: "strong", label: "Strong" },
] as const;

interface WorksSearchBarProps {
  filters: WorksSearchFilters;
}

export default function WorksSearchBar({ filters }: WorksSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(qParam);

  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  const pushFilters = useCallback(
    (overrides: Partial<WorksSearchFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(overrides)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      const qs = params.toString();
      router.push(qs ? `/works?${qs}` : "/works");
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    pushFilters({ q: query.trim() || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleTrainingType = (value: string) => {
    pushFilters({
      trainingType: filters.trainingType === value ? undefined : value,
    });
  };

  const toggleChip = (key: "commercial" | "adult", onValue: string) => {
    pushFilters({
      [key]: filters[key] === onValue ? undefined : onValue,
    });
  };

  const toggleConsult = () => {
    pushFilters({
      consult: filters.consult === "exclude" ? undefined : "exclude",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="タイトル、タグ、作家名で検索..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          検索
        </button>
      </div>

      {/* Filter chips */}
      <DeveloperOnly>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">学習許諾:</span>
          {trainingTypes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleTrainingType(value)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                filters.trainingType === value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}

          <span className="mx-1 h-4 w-px bg-gray-200" />

          <button
            onClick={() => toggleChip("commercial", "allowed")}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              filters.commercial === "allowed"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            商用OKのみ
          </button>

          <button
            onClick={() => toggleChip("adult", "allowed")}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              filters.adult === "allowed"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            成人向けOKのみ
          </button>

          <button
            onClick={toggleConsult}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              filters.consult === "exclude"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            要相談作品を除く
          </button>
        </div>
      </DeveloperOnly>
    </div>
  );
}
