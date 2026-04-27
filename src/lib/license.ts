import type { LicenseValue, TrainingType } from "@/lib/types";

export function licenseValueText(value: LicenseValue): string {
  switch (value) {
    case "allowed":
      return "許可";
    case "denied":
      return "不可";
    case "consult":
      return "要相談";
  }
}

export function trainingTypeText(type: TrainingType): string {
  switch (type) {
    case "light":
      return "軽度のAI学習利用";
    case "standard":
      return "標準的なAI学習利用";
    case "strong":
      return "広範なAI学習利用";
  }
}
