import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArtistBySlug } from "@/lib/queries";
import TagPills from "@/components/TagPills";
import ArtworkCard from "@/components/ArtworkCard";
import DeveloperOnly from "@/components/DeveloperOnly";

export async function generateMetadata({ params }: ArtistDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtistBySlug(id);
  return {
    title: artist ? `${artist.displayName} | Artli` : "Artist Not Found | Artli",
  };
}

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { id } = await params;
  const artist = await getArtistBySlug(id);

  if (!artist) {
    notFound();
  }

  const sortedByLikes = [...artist.works].sort((a, b) => b.likesCount - a.likesCount);
  const previewWorks = sortedByLikes.slice(0, 3);
  const featuredWorks = sortedByLikes.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-page="artist-detail" data-id={id}>
      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Profile info */}
          <div className="flex flex-col sm:flex-row items-start gap-6 flex-1 min-w-0">
            <Image
              src={artist.iconUrl}
              alt={artist.displayName}
              width={96}
              height={96}
              className="rounded-full flex-shrink-0"
              unoptimized
            />
            <div className="space-y-3 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">{artist.displayName}</h1>
              <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
              <TagPills tags={artist.styleTags} />
              {artist.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {artist.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      {new URL(link).hostname}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured work preview thumbnails */}
          {previewWorks.length > 0 && (
            <div className="flex flex-row gap-3 flex-shrink-0">
              {previewWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/works/${work.slug}`}
                  className="group block"
                  aria-label={work.title}
                >
                  <div className="relative w-20 aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                    <Image
                      src={work.coverImageUrl}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105 group-hover:opacity-90"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured works */}
      {featuredWorks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">代表作品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}

      {/* Policy Summary (Developer only) */}
      <DeveloperOnly>
        <section className="mb-10">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h2 className="text-xs font-semibold text-gray-700 mb-1">この作家の許諾方針</h2>
            <p className="text-xs text-gray-600">{artist.policySummary}</p>
            <p className="text-[10px] text-gray-400 mt-2">
              この内容はDeveloper向けの補助情報です。作品ごとの利用条件は各作品詳細で確認してください。
            </p>
          </div>
        </section>
      </DeveloperOnly>

      {/* All Works */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">作品一覧</h2>
        {artist.works.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artist.works.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">公開作品はまだありません</p>
        )}
      </section>

      {/* Back link */}
      <div className="mt-10">
        <Link
          href="/artists"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          &larr; 作家一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
