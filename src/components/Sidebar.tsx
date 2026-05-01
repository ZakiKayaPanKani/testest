"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SidebarData } from "@/lib/types";
import DeveloperOnly from "@/components/DeveloperOnly";

interface SidebarProps {
  className?: string;
  data: SidebarData;
}

function SidebarContent({ data }: { data: SidebarData }) {
  return (
    <div className="space-y-5">
      {/* Trending Tags */}
      <div>
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
          Trending Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {data.trendingTags.map(({ name }) => (
            <Link
              key={name}
              href={`/works?q=${encodeURIComponent(name)}`}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Artists */}
      <div>
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
          Featured Artists
        </h3>
        <div className="space-y-2.5">
          {data.featuredArtists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="flex items-center gap-2.5 group"
            >
              <Image
                src={artist.iconUrl}
                alt={artist.displayName}
                width={28}
                height={28}
                className="rounded-full flex-shrink-0"
                unoptimized
              />
              <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors truncate">
                {artist.displayName}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Works */}
      <div>
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
          New Works
        </h3>
        <div className="space-y-2.5">
          {data.newWorks.map((work) => (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="flex items-center gap-2.5 group"
            >
              <Image
                src={work.coverImageUrl}
                alt={work.title}
                width={40}
                height={30}
                className="rounded object-cover flex-shrink-0"
                unoptimized
              />
              <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors truncate">
                {work.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <DeveloperOnly>
      {/* License Quick Filters - Developer限定 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-900 tracking-wider mb-2">
          利用条件で探す
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href="/works?commercial=allowed"
            className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
          >
            商用OK
          </Link>
          <Link
            href="/works?adult=allowed"
            className="px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            成人OK
          </Link>
          <Link
            href="/works?trainingType=light"
            className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            学習 Light
          </Link>
          <Link
            href="/works?trainingType=standard"
            className="px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors"
          >
            学習 Standard
          </Link>
        </div>
      </div>
      </DeveloperOnly>
    </div>
  );
}

export default function Sidebar({ className, data }: SidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`w-56 ${className ?? ""}`}>
        <SidebarContent data={data} />
      </aside>

      {/* Mobile toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Explore
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-gray-900">Explore</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent data={data} />
          </div>
        </div>
      )}
    </>
  );
}
