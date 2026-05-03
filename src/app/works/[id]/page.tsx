import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getWorkBySlug, getWorksByArtistSlug, getWorksByTag } from "@/lib/queries";
import ArtworkCard from "@/components/ArtworkCard";
import WorkDetailTabs from "@/components/WorkDetailTabs";

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getWorkBySlug(id);
  return {
    title: artwork ? `Work: ${artwork.title} | Artli` : "Work Not Found | Artli",
  };
}

interface WorkDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = await params;
  const artwork = await getWorkBySlug(id);

  if (!artwork) {
    notFound();
  }

  const moreFromArtist = (await getWorksByArtistSlug(artwork.artistProfile.slug, { publicOnly: true }))
    .filter((a) => a.id !== artwork.id)
    .slice(0, 6);

  const primaryTagName = artwork.tags[0]?.name;
  const sameTagWorks = primaryTagName
    ? await getWorksByTag(primaryTagName, artwork.id, 6)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-page="work-detail" data-id={id}>
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-10">
        {/* WorkImageViewer: currently single image, future: images[] */}
        <div className="relative w-full min-h-[400px] aspect-[3/4] sm:aspect-[4/3] rounded-xl overflow-hidden bg-neutral-50 border border-gray-100 shadow-sm">
          <Image
            src={artwork.coverImageUrl}
            alt={artwork.title}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 65vw"
            priority
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{artwork.title}</h1>
          <WorkDetailTabs artwork={artwork} />
        </div>
      </div>

      {/* More from this artist */}
      {moreFromArtist.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More from {artwork.artistProfile.displayName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreFromArtist.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        </section>
      )}

      {/* Works with the same tag */}
      {sameTagWorks.length > 0 && primaryTagName && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            「{primaryTagName}」タグの作品
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sameTagWorks.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
