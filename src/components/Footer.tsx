import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {BRAND.name}
            </span>
            <p className="mt-2 text-sm text-gray-500">
              {BRAND.taglineJa}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">見る</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/works" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  作品
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  クリエイター
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">情報</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-400">Artliについて（準備中）</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">利用規約（準備中）</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            &copy; 2025-2026 {BRAND.name} — プロトタイプ
          </p>
        </div>
      </div>
    </footer>
  );
}
