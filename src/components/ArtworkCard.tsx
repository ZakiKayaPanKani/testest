"use client";

import Image from "next/image";
import Link from "next/link";
import type { WorkForCard } from "@/lib/types";
import AuthorBadge from "./AuthorBadge";
import DeveloperOnly from "./DeveloperOnly";
import LicenseBadges from "./LicenseBadges";

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

        {/* License badges - Developer限定 */}
        {artwork.license && (
          <DeveloperOnly>
            <LicenseBadges terms={artwork.license} mini />
          </DeveloperOnly>
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
