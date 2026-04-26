import type { Metadata } from "next";
import { searchPublicWorks, getSidebarData } from "@/lib/queries";
import type { WorksSearchFilters } from "@/lib/queries";
import WorksSearchBar from "@/components/WorksSearchBar";
import WorksResultInfo from "@/components/WorksResultInfo";
import WorksGrid from "@/components/WorksGrid";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Works | Artli",
};

interface WorksPageProps {
  searchParams: Promise<{
    q?: string;
    trainingType?: string;
    adult?: string;
    commercial?: string;
    consult?: string;
  }>;
}

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const filters: WorksSearchFilters = {
    q: params.q,
    trainingType: params.trainingType,
    adult: params.adult,
    commercial: params.commercial,
    consult: params.consult,
  };

  const [{ works, total }, sidebarData] = await Promise.all([
    searchPublicWorks(filters),
    getSidebarData(),
  ]);

  const hasActiveFilters = !!(
    filters.q ||
    filters.trainingType ||
    filters.adult ||
    filters.commercial ||
    filters.consult
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8" data-page="works">
      <Sidebar className="hidden lg:block flex-shrink-0" data={sidebarData} />
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          3つの『アイ』を伝える、新世代イラストSNS
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          作品を公開しながら、AI学習への利用条件を設定・管理できるプラットフォーム
        </p>
        <WorksSearchBar filters={filters} />
        <WorksResultInfo total={total} filters={filters} hasActiveFilters={hasActiveFilters} />
        <WorksGrid works={works} />
      </div>
    </div>
  );
}
