import Link from "next/link";
import Image from "next/image";
import type { ArtistForCard } from "@/lib/types";
import TagPills from "./TagPills";

interface ArtistCardProps {
  artist: ArtistForCard;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const images = artist.previewImageUrls;

  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        {images.length > 0 && (
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 flex">
            {images.length === 1 ? (
              <Image
                src={images[0]}
                alt={`${artist.displayName} featured work`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
            ) : (
              images.map((url, i) => (
                <div key={i} className="relative flex-1 overflow-hidden">
                  <Image
                    src={url}
                    alt={`${artist.displayName} work ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes={`(max-width: 640px) ${Math.floor(100 / images.length)}vw, ${Math.floor(50 / images.length)}vw`}
                    unoptimized
                  />
                </div>
              ))
            )}
          </div>
        )}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Image
              src={artist.iconUrl}
              alt={artist.displayName}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                {artist.displayName}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1">{artist.bio}</p>
            </div>
          </div>
          <TagPills tags={artist.styleTags} limit={3} />
        </div>
      </div>
    </Link>
  );
}
