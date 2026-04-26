import type { WorkForCard } from "@/lib/types";
import ArtworkCard from "@/components/ArtworkCard";

interface WorksGridProps {
  works: WorkForCard[];
}

export default function WorksGrid({ works }: WorksGridProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-2">
          条件に合う作品が見つかりませんでした。
        </p>
        <p className="text-gray-400 text-sm">
          別のキーワードやフィルタで探してみてください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {works.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
