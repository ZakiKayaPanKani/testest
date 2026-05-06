import type { LicenseTerms, LicenseValue, TrainingType } from "@/lib/types";

function valueBadgeClass(value: LicenseValue): string {
  switch (value) {
    case "allowed":
      return "bg-green-100 text-green-800 border-green-300";
    case "denied":
      return "bg-red-100 text-red-800 border-red-300";
    case "consult":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
}

function valueLabel(value: LicenseValue): string {
  switch (value) {
    case "allowed":
      return "OK";
    case "denied":
      return "NG";
    case "consult":
      return "要相談";
  }
}

function trainingBadgeClass(type: TrainingType): string {
  switch (type) {
    case "light":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "standard":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "strong":
      return "bg-orange-100 text-orange-800 border-orange-300";
  }
}

function trainingLabel(type: TrainingType): string {
  switch (type) {
    case "light":
      return "軽度";
    case "standard":
      return "標準";
    case "strong":
      return "強度";
  }
}

interface LicenseBadgesProps {
  terms: LicenseTerms;
  compact?: boolean;
  /** カード内表示用の極小サイズ */
  mini?: boolean;
}

export default function LicenseBadges({ terms, compact = false, mini = false }: LicenseBadgesProps) {
  const badgeBase = "inline-flex items-center border rounded-full font-medium";
  const sizeClass = mini
    ? "px-1.5 py-0 text-[10px]"
    : compact
      ? "px-2 py-0.5 text-xs"
      : "px-2.5 py-1 text-xs";
  const gapClass = mini ? "gap-1" : "gap-1.5";

  return (
    <div className={`flex flex-wrap ${gapClass}`}>
      <span className={`${badgeBase} ${sizeClass} ${valueBadgeClass(terms.commercial)}`}>
        商用 {valueLabel(terms.commercial)}
      </span>
      <span className={`${badgeBase} ${sizeClass} ${valueBadgeClass(terms.adult)}`}>
        成人 {valueLabel(terms.adult)}
      </span>
      <span className={`${badgeBase} ${sizeClass} ${trainingBadgeClass(terms.trainingType)}`}>
        学習 {trainingLabel(terms.trainingType)}
      </span>
      <span className={`${badgeBase} ${sizeClass} ${valueBadgeClass(terms.redistribution)}`}>
        再配布 {valueLabel(terms.redistribution)}
      </span>
    </div>
  );
}
