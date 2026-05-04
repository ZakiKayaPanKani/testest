"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { mockUsers } from "@/lib/mockUsers";
import { BRAND } from "@/lib/brand";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error ?? "ログインに失敗しました。");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {BRAND.name}
          </span>
          <p className="mt-2 text-sm text-gray-500">アカウントにログイン</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ログイン
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            新規登録
          </Link>
        </p>

        {/* Demo accounts helper */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            デモアカウント
          </h3>
          <div className="space-y-2">
            {mockUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setEmail(u.email);
                  setPassword(u.password);
                  setError("");
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                    {u.displayName}
                  </span>
                  <div className="flex gap-1">
                    {u.isArtist && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">
                        クリエイター
                      </span>
                    )}
                    {u.isDeveloper && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
                        開発者
                      </span>
                    )}
                    {!u.isArtist && !u.isDeveloper && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                        一般ユーザー
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{u.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
