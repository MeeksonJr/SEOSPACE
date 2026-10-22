export type PlatformType = "google" | "trustpilot" | "producthunt" | "yelp" | "direct";

export type SentimentType = "positive" | "neutral" | "negative" | "critical";

export type FeedbackStatus = "new" | "contacted" | "resolved";

export type WidgetType = "wall_of_love" | "toast_notification" | "floating_pill" | "review_badge";

export type WidgetTheme = "dark" | "light" | "glassmorphism";

export interface ReviewItem {
  id: string;
  workspaceId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  authorLocation?: string;
  rating: number; // 1 to 5
  reviewText: string;
  platform: PlatformType;
  sentiment: SentimentType;
  reviewDate: string;
  isVerified: boolean;
  isFeatured: boolean;
  aiReply?: {
    type: "seo_boosted" | "de_escalation" | "loyalty_reward";
    content: string;
    generatedAt: string;
  };
}

export interface PrivateFeedback {
  id: string;
  workspaceId: string;
  campaignId?: string;
  rating: number; // 1 to 3
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  grievanceText: string;
  status: FeedbackStatus;
  createdAt: string;
  resolutionNotes?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  category: string;
  logoUrl?: string;
  brandColor: string;
  googlePlaceId?: string;
  googleReviewUrl: string;
  trustpilotUrl?: string;
  starThreshold: number; // default 4 (>= 4 -> Google, < 4 -> Private)
  customHeadline?: string;
  customSubheadline?: string;
  createdAt: string;
  stats: {
    averageRating: number;
    totalReviews: number;
    shieldedReviews: number;
    positiveRedirects: number;
  };
}

export interface WidgetConfig {
  id: string;
  workspaceId: string;
  type: WidgetType;
  theme: WidgetTheme;
  title: string;
  position: "bottom_left" | "bottom_right" | "top_right" | "embedded";
  minRating: number;
  maxReviews: number;
  loopIntervalSeconds: number;
  showPlatformBadge: boolean;
  showVerifiedCheck: boolean;
  showDate: boolean;
  customAccentColor?: string;
  customCss?: string;
}

export interface AIReplyOption {
  type: "seo_boosted" | "de_escalation" | "loyalty_reward";
  title: string;
  description: string;
  content: string;
}
