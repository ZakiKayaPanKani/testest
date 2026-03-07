// ─── Types ───────────────────────────────────────────────────────────────────

import type { LicenseTerms } from "./mock";

export interface User {
  id: string;
  email: string;
  password: string;
  displayName: string;
  avatarUrl: string;
  isArtist: boolean;
  isDeveloper: boolean;
}

export interface ArtistProfile {
  userId: string;
  displayName: string;
  bio: string;
  styleTags: string[];
  policySummary: string;
}

export interface DeveloperProfile {
  userId: string;
  companyName: string;
  purpose: string;
}

export interface DashboardWork {
  id: string;
  title: string;
  imageUrl: string;
  status: "public" | "private" | "draft";
  likes: number;
  acquisitions: number;
  licenseTerms: LicenseTerms;
  createdAt: string;
}

export interface Acquisition {
  id: string;
  workId: string;
  workTitle: string;
  workImageUrl: string;
  artistName: string;
  artistId: string;
  acquiredAt: string;
  licenseSummary: string;
  commercialAllowed: boolean;
}

// ─── Demo Users ──────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "viewer@artli.dev",
    password: "password",
    displayName: "Demo Viewer",
    avatarUrl: "https://picsum.photos/seed/user1/200/200",
    isArtist: false,
    isDeveloper: false,
  },
  {
    id: "user-2",
    email: "artist@artli.dev",
    password: "password",
    displayName: "Yuki Tanaka",
    avatarUrl: "https://picsum.photos/seed/user2/200/200",
    isArtist: true,
    isDeveloper: false,
  },
  {
    id: "user-3",
    email: "dev@artli.dev",
    password: "password",
    displayName: "Dev Studio",
    avatarUrl: "https://picsum.photos/seed/user3/200/200",
    isArtist: false,
    isDeveloper: true,
  },
  {
    id: "user-4",
    email: "hybrid@artli.dev",
    password: "password",
    displayName: "Sakura Ito",
    avatarUrl: "https://picsum.photos/seed/user4/200/200",
    isArtist: true,
    isDeveloper: true,
  },
];

// ─── Artist Profiles ─────────────────────────────────────────────────────────

const artistProfiles: ArtistProfile[] = [
  {
    userId: "user-2",
    displayName: "Yuki Tanaka",
    bio: "東京を拠点に活動するイラストレーター。幻想的な風景とキャラクターデザインを得意としています。",
    styleTags: ["Fantasy", "Landscape", "Character"],
    policySummary: "商用利用は応相談。軽量学習のみ許可。",
  },
  {
    userId: "user-4",
    displayName: "Sakura Ito",
    bio: "アニメスタイルのイラストレーター。キャラクターデザインと同人活動を中心に活動中。",
    styleTags: ["Anime", "Character Design", "Manga"],
    policySummary: "商用利用可。成人向け許可。学習はストロングまで許可。再配布可。",
  },
];

// ─── Developer Profiles ──────────────────────────────────────────────────────

const developerProfiles: DeveloperProfile[] = [
  {
    userId: "user-3",
    companyName: "Dev Studio Inc.",
    purpose: "ゲーム開発におけるコンセプトアートの素材取得",
  },
  {
    userId: "user-4",
    companyName: "Sakura Creative LLC",
    purpose: "個人プロジェクトおよびクライアントワークでの素材利用",
  },
];

// ─── Dashboard Works (for artist users) ──────────────────────────────────────

const dashboardWorks: Record<string, DashboardWork[]> = {
  "user-2": [
    {
      id: "dw-1",
      title: "夜明けの浮遊城",
      imageUrl: "https://picsum.photos/seed/art1/800/600",
      status: "public",
      likes: 234,
      acquisitions: 12,
      licenseTerms: { commercial: "consult", adult: "denied", trainingType: "light", redistribution: "denied" },
      createdAt: "2025-11-01",
    },
    {
      id: "dw-2",
      title: "森の精霊",
      imageUrl: "https://picsum.photos/seed/art2/800/600",
      status: "public",
      likes: 187,
      acquisitions: 8,
      licenseTerms: { commercial: "consult", adult: "denied", trainingType: "light", redistribution: "consult" },
      createdAt: "2025-10-15",
    },
    {
      id: "dw-3",
      title: "月光の庭園",
      imageUrl: "https://picsum.photos/seed/dw3/800/600",
      status: "private",
      likes: 0,
      acquisitions: 0,
      licenseTerms: { commercial: "denied", adult: "denied", trainingType: "light", redistribution: "denied" },
      createdAt: "2025-12-01",
    },
    {
      id: "dw-4",
      title: "星降る夜の街",
      imageUrl: "https://picsum.photos/seed/dw4/800/600",
      status: "draft",
      likes: 0,
      acquisitions: 0,
      licenseTerms: { commercial: "consult", adult: "denied", trainingType: "standard", redistribution: "consult" },
      createdAt: "2025-12-10",
    },
    {
      id: "dw-5",
      title: "天空の渡り鳥",
      imageUrl: "https://picsum.photos/seed/dw5/800/600",
      status: "public",
      likes: 156,
      acquisitions: 5,
      licenseTerms: { commercial: "allowed", adult: "denied", trainingType: "light", redistribution: "allowed" },
      createdAt: "2025-09-20",
    },
    {
      id: "dw-6",
      title: "古代遺跡の守護者",
      imageUrl: "https://picsum.photos/seed/dw6/800/600",
      status: "public",
      likes: 98,
      acquisitions: 3,
      licenseTerms: { commercial: "consult", adult: "denied", trainingType: "light", redistribution: "denied" },
      createdAt: "2025-08-05",
    },
    {
      id: "dw-7",
      title: "水底の神殿（WIP）",
      imageUrl: "https://picsum.photos/seed/dw7/800/600",
      status: "draft",
      likes: 0,
      acquisitions: 0,
      licenseTerms: { commercial: "consult", adult: "denied", trainingType: "light", redistribution: "denied" },
      createdAt: "2025-12-15",
    },
  ],
  "user-4": [
    {
      id: "dw-8",
      title: "魔法少女ルナ",
      imageUrl: "https://picsum.photos/seed/art9/800/600",
      status: "public",
      likes: 498,
      acquisitions: 25,
      licenseTerms: { commercial: "allowed", adult: "allowed", trainingType: "strong", redistribution: "allowed" },
      createdAt: "2025-10-01",
    },
    {
      id: "dw-9",
      title: "放課後の約束",
      imageUrl: "https://picsum.photos/seed/art10/800/600",
      status: "public",
      likes: 345,
      acquisitions: 18,
      licenseTerms: { commercial: "allowed", adult: "allowed", trainingType: "strong", redistribution: "allowed" },
      createdAt: "2025-09-15",
    },
    {
      id: "dw-10",
      title: "夏祭りの夜",
      imageUrl: "https://picsum.photos/seed/dw10/800/600",
      status: "public",
      likes: 267,
      acquisitions: 10,
      licenseTerms: { commercial: "allowed", adult: "denied", trainingType: "standard", redistribution: "allowed" },
      createdAt: "2025-08-20",
    },
    {
      id: "dw-11",
      title: "新キャラ設定画",
      imageUrl: "https://picsum.photos/seed/dw11/800/600",
      status: "draft",
      likes: 0,
      acquisitions: 0,
      licenseTerms: { commercial: "allowed", adult: "allowed", trainingType: "strong", redistribution: "allowed" },
      createdAt: "2025-12-12",
    },
    {
      id: "dw-12",
      title: "冬のイルミネーション",
      imageUrl: "https://picsum.photos/seed/dw12/800/600",
      status: "private",
      likes: 0,
      acquisitions: 0,
      licenseTerms: { commercial: "consult", adult: "denied", trainingType: "light", redistribution: "denied" },
      createdAt: "2025-11-30",
    },
    {
      id: "dw-13",
      title: "桜並木の散歩道",
      imageUrl: "https://picsum.photos/seed/dw13/800/600",
      status: "public",
      likes: 189,
      acquisitions: 7,
      licenseTerms: { commercial: "allowed", adult: "denied", trainingType: "standard", redistribution: "allowed" },
      createdAt: "2025-07-10",
    },
  ],
};

// ─── Acquisitions (for developer users) ──────────────────────────────────────

const acquisitions: Record<string, Acquisition[]> = {
  "user-3": [
    {
      id: "acq-1",
      workId: "art-3",
      workTitle: "ネオン都市2087",
      workImageUrl: "https://picsum.photos/seed/art3/800/600",
      artistName: "Haruto Sato",
      artistId: "artist-2",
      acquiredAt: "2025-11-15",
      licenseSummary: "商用利用可・再配布不可・学習スタンダード",
      commercialAllowed: true,
    },
    {
      id: "acq-2",
      workId: "art-5",
      workTitle: "春の小川",
      workImageUrl: "https://picsum.photos/seed/art5/800/600",
      artistName: "Mio Hayashi",
      artistId: "artist-3",
      acquiredAt: "2025-11-20",
      licenseSummary: "商用利用可・再配布可・学習ライト",
      commercialAllowed: true,
    },
    {
      id: "acq-3",
      workId: "art-7",
      workTitle: "URBAN PULSE",
      workImageUrl: "https://picsum.photos/seed/art7/800/600",
      artistName: "Ren Kimura",
      artistId: "artist-4",
      acquiredAt: "2025-12-01",
      licenseSummary: "全利用応相談",
      commercialAllowed: false,
    },
    {
      id: "acq-4",
      workId: "art-9",
      workTitle: "魔法少女ルナ",
      workImageUrl: "https://picsum.photos/seed/art9/800/600",
      artistName: "Sakura Ito",
      artistId: "artist-5",
      acquiredAt: "2025-12-10",
      licenseSummary: "商用利用可・再配布可・学習ストロング",
      commercialAllowed: true,
    },
  ],
  "user-4": [
    {
      id: "acq-5",
      workId: "art-4",
      workTitle: "戦闘メカ・ゼロ",
      workImageUrl: "https://picsum.photos/seed/art4/800/600",
      artistName: "Haruto Sato",
      artistId: "artist-2",
      acquiredAt: "2025-10-05",
      licenseSummary: "商用利用可・再配布不可・学習スタンダード",
      commercialAllowed: true,
    },
    {
      id: "acq-6",
      workId: "art-6",
      workTitle: "眠る子鹿",
      workImageUrl: "https://picsum.photos/seed/art6/800/600",
      artistName: "Mio Hayashi",
      artistId: "artist-3",
      acquiredAt: "2025-10-20",
      licenseSummary: "商用利用可・再配布可・学習ライト",
      commercialAllowed: true,
    },
    {
      id: "acq-7",
      workId: "art-11",
      workTitle: "Fractal Bloom",
      workImageUrl: "https://picsum.photos/seed/art11/800/600",
      artistName: "Kaito Yamamoto",
      artistId: "artist-6",
      acquiredAt: "2025-11-10",
      licenseSummary: "商用利用不可・再配布不可・鑑賞のみ",
      commercialAllowed: false,
    },
    {
      id: "acq-8",
      workId: "art-1",
      workTitle: "夜明けの浮遊城",
      workImageUrl: "https://picsum.photos/seed/art1/800/600",
      artistName: "Yuki Tanaka",
      artistId: "artist-1",
      acquiredAt: "2025-12-05",
      licenseSummary: "商用利用応相談・再配布不可・学習ライト",
      commercialAllowed: false,
    },
    {
      id: "acq-9",
      workId: "art-8",
      workTitle: "POP EXPLOSION",
      workImageUrl: "https://picsum.photos/seed/art8/800/600",
      artistName: "Ren Kimura",
      artistId: "artist-4",
      acquiredAt: "2025-12-15",
      licenseSummary: "全利用応相談・成人向け許可",
      commercialAllowed: false,
    },
  ],
};

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email);
}

export function getArtistProfile(userId: string): ArtistProfile | undefined {
  return artistProfiles.find((p) => p.userId === userId);
}

export function getDeveloperProfile(userId: string): DeveloperProfile | undefined {
  return developerProfiles.find((p) => p.userId === userId);
}

export function getDashboardWorks(userId: string): DashboardWork[] {
  return dashboardWorks[userId] ?? [];
}

export function getAcquisitions(userId: string): Acquisition[] {
  return acquisitions[userId] ?? [];
}
