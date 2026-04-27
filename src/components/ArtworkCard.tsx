"use client";

import Link from "next/link";
import Image from "next/image";
import type { WorkForCard } from "@/lib/types";
import AuthorBadge from "./AuthorBadge";

interface ArtworkCardProps {
  artwork: WorkForCard;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail + Title link */}
      <Link href={`/works/${artwork.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={artwork.coverImageUrl}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
          />
        </div>
        <div className="px-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {artwork.title}
          </h3>
        </div>
      </Link>

      <div className="px-3 pb-3 pt-1.5 space-y-1.5">
        {/* Author Badge */}
        <AuthorBadge
          artistSlug={artwork.artistProfile.slug}
          artistName={artwork.artistProfile.displayName}
          artistIconUrl={artwork.artistProfile.iconUrl}
          size="sm"
        />

        {/* Tags */}
        {artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artwork.tags.slice(0, 3).map((t) => (
              <span key={t.name} className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full">
                {t.name}
              </span>
            ))}
            {artwork.tags.length > 3 && (
              <span className="text-[10px] text-gray-400">+{artwork.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Like count */}
        <div className="flex justify-end">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            ♡ {artwork.likesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
