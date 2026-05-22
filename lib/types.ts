export type Niche = "gym" | "restaurant" | "cafe" | "retail";

export type SignalType =
  | "promo"
  | "discount"
  | "launch"
  | "event"
  | "referral"
  | "menu_change"
  | "price_change"
  | "hire"
  | "other";

export interface Business {
  id: string;
  name: string;
  niche: Niche | null;
  businessType: string | null;
  location: { city: string; suburb: string } | null;
  onboarded: boolean;
}

export interface Competitor {
  id: string;
  businessId: string;
  name: string;
  handle: string;
  niche: Niche;
  city: string;
  suburb: string;
  distanceKm: number;
  tier: "local" | "inspiration";
  avatarUrl: string;
  baselineLikes: number;
}

export interface Post {
  id: string;
  competitorId: string;
  postedAt: string;
  caption: string;
  mediaUrl: string;
  likeCount: number;
  commentCount: number;
}

export interface Signal {
  id: string;
  postId: string;
  competitorId: string;
  businessId: string;
  signalType: SignalType;
  summary: string;
  evidenceQuote: string;
  confidence: number;
  importance: number;
  engagementDelta: number;
  postedAt: string;
}

export interface AnalyticsResponse {
  initiatives: (Signal & { competitorName: string })[];
  engagement: {
    competitorId: string;
    competitorName: string;
    weeks: { weekStart: string; avgLikes: number; avgComments: number }[];
  }[];
  postsPerWeek: {
    competitorId: string;
    competitorName: string;
    weeks: { weekStart: string; count: number }[];
  }[];
  topMovers: {
    competitorId: string;
    competitorName: string;
    engagementDeltaPct: number;
  }[];
}
