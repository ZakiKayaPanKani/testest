import type { Metadata } from "next";
import { getAllArtists, getSidebarData } from "@/lib/queries";
import ArtistsFilter from "@/components/ArtistsFilter";
import ArtistsPageDescription from "@/components/ArtistsPageDescription";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Artists | Artli",
};

export default async function ArtistsPage() {
  const [artists, sidebarData] = await Promise.all([
    getAllArtists(),
    getSidebarData(),
  ]);

  const allStyleTags = Array.from(
    new Set(artists.flatMap((a) => a.styleTags))
  ).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8" data-page="artists">
      <Sidebar className="hidden lg:block flex-shrink-0" data={sidebarData} />
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">クリエイター一覧</h1>
        <ArtistsPageDescription />
        <ArtistsFilter artists={artists} allStyleTags={allStyleTags} />
      </div>
    </div>
  );
}
