"use client";

import { useState } from "react";
import { licenseValueText, trainingTypeText } from "@/lib/license";
import type { LicenseValue, TrainingType } from "@/lib/types";

interface AcquireModalProps {
  license: {
    commercial: LicenseValue;
    adult: LicenseValue;
    trainingType: TrainingType;
    redistribution: LicenseValue;
    priceJpy: number;
  };
  acquiring: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AcquireModal({ license, acquiring, onConfirm, onCancel }: AcquireModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">
          この作品の利用権を取得しますか？
        </h2>
        <div className="text-sm text-gray-700 space-y-3">
          <p>この操作により、以下の条件でこの作品を利用できます。</p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
            <div className="font-medium text-gray-900">&yen;{license.priceJpy.toLocaleString()}</div>
            <div>・商用利用：{licenseValueText(license.commercial)}</div>
            <div>・成人向け利用：{licenseValueText(license.adult)}</div>
            <div>・AI学習利用：{trainingTypeText(license.trainingType)}</div>
            <div>・再配布：{licenseValueText(license.redistribution)}</div>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p>※条件は作家によって設定されています</p>
            <p>※取得内容は履歴として保存されます</p>
          </div>
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">上記の条件を確認しました</span>
        </label>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => { onConfirm(); }}
            disabled={!agreed || acquiring}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acquiring ? "取得中..." : "同意して取得"}
          </button>
        </div>
      </div>
    </div>
  );
}
