"use client";

import { useState } from "react";

interface WorkFormData {
  title: string;
  description: string;
  coverImageUrl: string;
  tags: string[];
  status: string;
  license: {
    commercial: string;
    adult: string;
    trainingType: string;
    redistribution: string;
    priceJpy: number;
  };
}

interface WorkFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
    coverImageUrl: string;
    tags: string[];
    status: string;
    license: {
      commercial: string;
      adult: string;
      trainingType: string;
      redistribution: string;
      priceJpy: number;
    } | null;
  };
  onSubmit: (data: WorkFormData) => Promise<void>;
  isSubmitting: boolean;
}

const defaultLicense = {
  commercial: "consult",
  adult: "denied",
  trainingType: "light",
  redistribution: "denied",
  priceJpy: 0,
};

export default function WorkForm({ mode, initialData, onSubmit, isSubmitting }: WorkFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? "");
  const [tagsStr, setTagsStr] = useState(initialData?.tags.join(", ") ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");

  const lic = initialData?.license ?? defaultLicense;
  const [commercial, setCommercial] = useState(lic.commercial);
  const [adult, setAdult] = useState(lic.adult);
  const [trainingType, setTrainingType] = useState(lic.trainingType);
  const [redistribution, setRedistribution] = useState(lic.redistribution);
  const [priceJpy, setPriceJpy] = useState(lic.priceJpy);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      coverImageUrl,
      tags: tagsStr.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      status,
      license: { commercial, adult, trainingType, redistribution, priceJpy },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Work section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">作品情報</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="作品タイトル"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="作品の説明を入力"
            />
          </div>

          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              カバー画像URL
            </label>
            <input
              id="coverImageUrl"
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              タグ（カンマ区切り）
            </label>
            <input
              id="tags"
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="ファンタジー, 風景, キャラクター"
            />
          </div>
        </div>
      </div>

      {/* 公開設定 section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">公開設定</h2>
        {mode === "edit" ? (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              公開状態
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="draft">下書き</option>
              <option value="private">非公開</option>
              <option value="public">公開中</option>
            </select>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            新規作成時は下書きとして保存されます。公開状態は保存後の編集画面から変更できます。
          </p>
        )}
      </div>

      {/* License section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">利用条件</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="commercial" className="block text-sm font-medium text-gray-700 mb-1">
              商用利用 <span className="text-red-500">*</span>
            </label>
            <select
              id="commercial"
              value={commercial}
              onChange={(e) => setCommercial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="allowed">許可</option>
              <option value="denied">不可</option>
              <option value="consult">要相談</option>
            </select>
          </div>

          <div>
            <label htmlFor="adult" className="block text-sm font-medium text-gray-700 mb-1">
              成人向け利用 <span className="text-red-500">*</span>
            </label>
            <select
              id="adult"
              value={adult}
              onChange={(e) => setAdult(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="allowed">許可</option>
              <option value="denied">不可</option>
              <option value="consult">要相談</option>
            </select>
          </div>

          <div>
            <label htmlFor="trainingType" className="block text-sm font-medium text-gray-700 mb-1">
              AI学習 <span className="text-red-500">*</span>
            </label>
            <select
              id="trainingType"
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="light">Light — 軽量学習のみ許可</option>
              <option value="standard">Standard — 標準的な学習利用可</option>
              <option value="strong">Strong — 大規模学習も許可</option>
            </select>
          </div>

          <div>
            <label htmlFor="redistribution" className="block text-sm font-medium text-gray-700 mb-1">
              再配布 <span className="text-red-500">*</span>
            </label>
            <select
              id="redistribution"
              value={redistribution}
              onChange={(e) => setRedistribution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="allowed">許可</option>
              <option value="denied">不可</option>
              <option value="consult">要相談</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="priceJpy" className="block text-sm font-medium text-gray-700 mb-1">
              価格（円） <span className="text-red-500">*</span>
            </label>
            <input
              id="priceJpy"
              type="number"
              min={0}
              required
              value={priceJpy}
              onChange={(e) => setPriceJpy(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "保存中..."
            : mode === "create"
              ? "作品を作成"
              : "変更を保存"}
        </button>
      </div>
    </form>
  );
}
