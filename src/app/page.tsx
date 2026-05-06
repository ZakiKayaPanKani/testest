import Link from "next/link";
import { getFeaturedWorks, getNewWorks, getFeaturedArtists, getSidebarData } from "@/lib/queries";
import ArtworkCard from "@/components/ArtworkCard";
import ArtistCard from "@/components/ArtistCard";
import Sidebar from "@/components/Sidebar";
import { BRAND } from "@/lib/brand";

export default async function HomePage() {
  const [featuredWorks, newWorksRaw, featuredArtists, sidebarData] = await Promise.all([
    getFeaturedWorks(6),
    getNewWorks(9),
    getFeaturedArtists(4),
    getSidebarData(),
  ]);

  const featuredIds = new Set(featuredWorks.map((w) => w.id));
  const newWorks = newWorksRaw.filter((w) => !featuredIds.has(w.id)).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {BRAND.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto">
            {BRAND.taglineJa}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/works"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-indigo-600 font-semibold shadow-lg hover:bg-indigo-50 transition-colors text-sm"
            >
              作品を見る
            </Link>
            <Link
              href="/artists"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 transition-colors text-sm"
            >
              クリエイターを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        <Sidebar className="hidden lg:block flex-shrink-0" data={sidebarData} />
        <div className="flex-1 min-w-0 space-y-14">

          {/* おすすめ作品 */}
          {featuredWorks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">おすすめ作品</h2>
                <Link href="/works" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  すべて見る →
                </Link>
              </div>
              <p className="text-xs text-gray-400 mb-5">Artliに投稿された注目作品です。</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {featuredWorks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            </section>
          )}

          {/* 新着作品 */}
          {newWorks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">新着作品</h2>
                <Link href="/works" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  すべて見る →
                </Link>
              </div>
              <p className="text-xs text-gray-400 mb-5">最近投稿・更新された作品です。</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {newWorks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            </section>
          )}

          {/* 注目作家 */}
          {featuredArtists.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">注目クリエイター</h2>
                <Link href="/artists" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  すべて見る →
                </Link>
              </div>
              <p className="text-xs text-gray-400 mb-5">作品群から気になるクリエイターを見つけられます。</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {featuredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
