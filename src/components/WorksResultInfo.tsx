import Link from "next/link";
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

const filterLabels: { key: keyof WorksSearchFilters; render: (v: string) => string }[] = [
  { key: "q", render: (v) => `"${v}"` },
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
  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">{total}件</span>

      {filterLabels.map(({ key, render }) => {
        const value = filters[key];
        if (!value) return null;
        return (
          <span
            key={key}
            className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
          >
            {render(value)}
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
