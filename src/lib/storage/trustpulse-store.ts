import {
  Workspace,
  ReviewItem,
  PrivateFeedback,
  WidgetConfig,
  FeedbackStatus,
} from "@/types/trustpulse";
import type { GooglePlaceResult } from "@/lib/places/google-maps";

interface TrustPulseDbSchema {
  workspaces: Workspace[];
  reviews: ReviewItem[];
  feedback: PrivateFeedback[];
  widgets: WidgetConfig[];
  updatedAt: string;
}

// Initial seed data with authentic avatars, real-world copy & realistic metrics
const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "ws-apex-dental",
    name: "Apex Cosmetic Dentistry & Orthodontics",
    slug: "apex-dental",
    category: "Dental & Healthcare",
    brandColor: "#059669", // Emerald
    googleReviewUrl: "https://maps.google.com/?cid=108392109312019",
    trustpilotUrl: "https://trustpilot.com/review/apexdental.com",
    starThreshold: 4,
    customHeadline: "How was your dental visit today?",
    customSubheadline: "Dr. Thorne & team value your candid feedback.",
    createdAt: "2026-09-15T10:00:00Z",
    stats: {
      averageRating: 4.94,
      totalReviews: 184,
      shieldedReviews: 19,
      positiveRedirects: 165,
    },
  },
  {
    id: "ws-bayview-auto",
    name: "Bayview Precision German Auto Repair",
    slug: "bayview-auto",
    category: "Automotive Services",
    brandColor: "#2563eb", // Blue
    googleReviewUrl: "https://maps.google.com/?cid=9842103912301",
    starThreshold: 4,
    customHeadline: "How did we do servicing your vehicle?",
    customSubheadline: "Your feedback helps our master technicians stay sharp.",
    createdAt: "2026-09-20T14:30:00Z",
    stats: {
      averageRating: 4.88,
      totalReviews: 96,
      shieldedReviews: 11,
      positiveRedirects: 85,
    },
  },
  {
    id: "ws-nimbus-saas",
    name: "Nimbus Analytics Platform",
    slug: "nimbus-saas",
    category: "B2B SaaS & Tech",
    brandColor: "#7c3aed", // Violet
    googleReviewUrl: "https://g2.com/products/nimbus-analytics",
    trustpilotUrl: "https://trustpilot.com/review/nimbusanalytics.com",
    starThreshold: 4,
    customHeadline: "How is your team enjoying Nimbus Analytics?",
    customSubheadline: "Directly tell our product founders what you think.",
    createdAt: "2026-10-01T08:00:00Z",
    stats: {
      averageRating: 4.96,
      totalReviews: 312,
      shieldedReviews: 8,
      positiveRedirects: 304,
    },
  },
];

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    workspaceId: "ws-apex-dental",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    authorRole: "Invisalign Patient",
    authorLocation: "Austin, TX",
    rating: 5,
    reviewText:
      "Dr. Thorne is an absolute miracle worker. I was terrified of dental implants for 3 years, but their painless sedation and 3D imaging made the entire procedure seamless. My smile has never looked better!",
    platform: "google",
    sentiment: "positive",
    reviewDate: "2026-10-18T14:22:00Z",
    isVerified: true,
    isFeatured: true,
    aiReply: {
      type: "seo_boosted",
      content:
        "Thank you so much Sarah! Dr. Thorne and our cosmetic dental team in Austin are thrilled that your dental implant journey was completely painless. Enjoy showing off your stunning new smile!",
      generatedAt: "2026-10-18T14:35:00Z",
    },
  },
  {
    id: "rev-2",
    workspaceId: "ws-apex-dental",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    authorRole: "Cosmetic Veneers",
    authorLocation: "Westlake, TX",
    rating: 5,
    reviewText:
      "World-class front desk reception, pristine hygiene protocols, and zero wait time. They gave me a warm scented towel after treatment. You simply cannot find a better dental practice in Austin.",
    platform: "google",
    sentiment: "positive",
    reviewDate: "2026-10-16T11:15:00Z",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "rev-3",
    workspaceId: "ws-apex-dental",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    authorRole: "Teeth Whitening",
    authorLocation: "Round Rock, TX",
    rating: 5,
    reviewText:
      "Did the 1-hour laser whitening before my wedding weekend. 4 shades whiter with zero tooth sensitivity. Worth every penny!",
    platform: "trustpilot",
    sentiment: "positive",
    reviewDate: "2026-10-12T16:40:00Z",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "rev-4",
    workspaceId: "ws-bayview-auto",
    authorName: "David Sterling",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    authorRole: "Porsche 911 Owner",
    authorLocation: "San Francisco, CA",
    rating: 5,
    reviewText:
      "Dealer quoted me $4,800 for PDK transmission diagnostic and clutch fluid flush. Bayview diagnosed it in 45 minutes, replaced an OEM solenoid seal, and charged $850 total. Honest, brilliant mechanics.",
    platform: "google",
    sentiment: "positive",
    reviewDate: "2026-10-15T09:12:00Z",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "rev-5",
    workspaceId: "ws-bayview-auto",
    authorName: "Carlos Mendez",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    authorRole: "BMW M3 Owner",
    authorLocation: "Oakland, CA",
    rating: 5,
    reviewText:
      "Best European specialty shop in the Bay Area. Clear digital inspection report with photos of every worn suspension bushing sent straight to my phone before touching anything.",
    platform: "yelp",
    sentiment: "positive",
    reviewDate: "2026-10-11T13:00:00Z",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "rev-6",
    workspaceId: "ws-nimbus-saas",
    authorName: "Amanda Chen",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    authorRole: "VP Growth @ FinTechHQ",
    authorLocation: "New York, NY",
    rating: 5,
    reviewText:
      "We replaced Mixpanel and Amplitude with Nimbus in 2 days. The automated funnel attribution saves our team 15 engineering hours every sprint.",
    platform: "producthunt",
    sentiment: "positive",
    reviewDate: "2026-10-19T17:50:00Z",
    isVerified: true,
    isFeatured: true,
  },
];

const INITIAL_FEEDBACK: PrivateFeedback[] = [
  {
    id: "fb-1",
    workspaceId: "ws-apex-dental",
    rating: 2,
    customerName: "Robert Klein",
    customerEmail: "r.klein92@gmail.com",
    customerPhone: "(512) 555-0189",
    grievanceText:
      "I was scheduled for 2:15 PM but had to wait 28 minutes in the waiting room because the previous root canal ran over. The staff was nice, but I was late to my client meeting.",
    status: "contacted",
    createdAt: "2026-10-17T15:05:00Z",
    resolutionNotes:
      "Called Robert within 3 hours. Offered a complimentary sonic electric toothbrush and waived his consultation copay. He was very grateful we reached out personally instead of ignoring him.",
  },
  {
    id: "fb-2",
    workspaceId: "ws-apex-dental",
    rating: 1,
    customerName: "Jessica Lee",
    customerEmail: "jess.lee@outlook.com",
    grievanceText:
      "Billing department sent the insurance claim to the wrong address, so I got an unexpected bill in the mail for $320.",
    status: "resolved",
    createdAt: "2026-10-14T10:45:00Z",
    resolutionNotes:
      "Re-billed Delta Dental correctly. Zero balance owed. Client praised our speedy response and did NOT leave a negative review on Google.",
  },
  {
    id: "fb-3",
    workspaceId: "ws-bayview-auto",
    rating: 2,
    customerName: "Timothy Hall",
    customerEmail: "thall_sf@yahoo.com",
    customerPhone: "(415) 555-4921",
    grievanceText:
      "Forgot to reset the oil change maintenance indicator light on the dashboard after picking up my Audi A6.",
    status: "resolved",
    createdAt: "2026-10-09T18:20:00Z",
    resolutionNotes:
      "Walked customer through the 20-second MMI reset over phone, sent a $50 fuel card apology.",
  },
];

const INITIAL_WIDGETS: WidgetConfig[] = [
  {
    id: "widget-apex-toasts",
    workspaceId: "ws-apex-dental",
    type: "toast_notification",
    theme: "glassmorphism",
    title: "Live Social Proof Toasts",
    position: "bottom_left",
    minRating: 4,
    maxReviews: 10,
    loopIntervalSeconds: 6,
    showPlatformBadge: true,
    showVerifiedCheck: true,
    showDate: true,
    customAccentColor: "#059669",
  },
  {
    id: "widget-apex-wall",
    workspaceId: "ws-apex-dental",
    type: "wall_of_love",
    theme: "light",
    title: "Wall of Love Grid",
    position: "embedded",
    minRating: 5,
    maxReviews: 20,
    loopIntervalSeconds: 0,
    showPlatformBadge: true,
    showVerifiedCheck: true,
    showDate: true,
    customAccentColor: "#059669",
  },
  {
    id: "widget-bayview-badge",
    workspaceId: "ws-bayview-auto",
    type: "floating_pill",
    theme: "dark",
    title: "Corner Rating Badge",
    position: "bottom_right",
    minRating: 4,
    maxReviews: 5,
    loopIntervalSeconds: 5,
    showPlatformBadge: true,
    showVerifiedCheck: true,
    showDate: false,
    customAccentColor: "#2563eb",
  },
];

const CLIENT_STORAGE_KEY = "trustpulse_local_db_v1";

function trySavePersisted(data: TrustPulseDbSchema) {
  // 1. Client-side localStorage
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
  }

  // 2. Server-side disk write if node environment
  if (typeof window === "undefined") {
    try {
      // Dynamic require avoids webpack bundling fs into client bundles
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const dir = path.join(process.cwd(), ".data");
      const file = path.join(dir, "trustpulse-db.json");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // Ignore in read-only edge environment
    }
  }
}

function loadInitialData(): TrustPulseDbSchema {
  // Client check
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(CLIENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
  }

  // Server check
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const file = path.join(process.cwd(), ".data", "trustpulse-db.json");
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, "utf-8");
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
  }

  const initial: TrustPulseDbSchema = {
    workspaces: [...INITIAL_WORKSPACES],
    reviews: [...INITIAL_REVIEWS],
    feedback: [...INITIAL_FEEDBACK],
    widgets: [...INITIAL_WIDGETS],
    updatedAt: new Date().toISOString(),
  };

  trySavePersisted(initial);
  return initial;
}

declare global {
  // eslint-disable-next-line no-var
  var __tp_store_v3: TrustPulseDbSchema | undefined;
}

function getStore(): TrustPulseDbSchema {
  if (!globalThis.__tp_store_v3) {
    globalThis.__tp_store_v3 = loadInitialData();
  }
  return globalThis.__tp_store_v3;
}

export const TrustPulseStore = {
  getWorkspaces(): Workspace[] {
    return getStore().workspaces;
  },

  getWorkspaceBySlug(slug: string): Workspace | undefined {
    return getStore().workspaces.find((w) => w.slug.toLowerCase() === slug.toLowerCase());
  },

  getWorkspaceById(id: string): Workspace | undefined {
    return getStore().workspaces.find((w) => w.id === id);
  },

  saveWorkspace(ws: Workspace): Workspace {
    const store = getStore();
    const idx = store.workspaces.findIndex((w) => w.id === ws.id);
    if (idx >= 0) {
      store.workspaces[idx] = ws;
    } else {
      store.workspaces.push(ws);
    }
    store.updatedAt = new Date().toISOString();
    trySavePersisted(store);
    return ws;
  },

  getReviews(workspaceId?: string): ReviewItem[] {
    const store = getStore();
    if (!workspaceId) return store.reviews;
    return store.reviews.filter((r) => r.workspaceId === workspaceId);
  },

  addReview(item: Omit<ReviewItem, "id" | "reviewDate"> & { id?: string; reviewDate?: string }): ReviewItem {
    const store = getStore();
    const newReview: ReviewItem = {
      id: item.id || `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      reviewDate: item.reviewDate || new Date().toISOString(),
      ...item,
    };
    store.reviews.unshift(newReview);

    // Update workspace stats
    const ws = store.workspaces.find((w) => w.id === item.workspaceId);
    if (ws) {
      const allWsReviews = store.reviews.filter((r) => r.workspaceId === ws.id);
      const total = allWsReviews.length;
      const sum = allWsReviews.reduce((acc, r) => acc + r.rating, 0);
      ws.stats.totalReviews = total;
      ws.stats.averageRating = Number((sum / (total || 1)).toFixed(2));
    }

    store.updatedAt = new Date().toISOString();
    trySavePersisted(store);
    return newReview;
  },

  updateReview(id: string, updates: Partial<ReviewItem>): ReviewItem | null {
    const store = getStore();
    const rev = store.reviews.find((r) => r.id === id);
    if (!rev) return null;
    Object.assign(rev, updates);
    store.updatedAt = new Date().toISOString();
    trySavePersisted(store);
    return rev;
  },

  deleteReview(id: string): boolean {
    const store = getStore();
    const idx = store.reviews.findIndex((r) => r.id === id);
    if (idx >= 0) {
      store.reviews.splice(idx, 1);
      store.updatedAt = new Date().toISOString();
      trySavePersisted(store);
      return true;
    }
    return false;
  },

  getPrivateFeedback(workspaceId?: string): PrivateFeedback[] {
    const store = getStore();
    if (!workspaceId) return store.feedback;
    return store.feedback.filter((f) => f.workspaceId === workspaceId);
  },

  addPrivateFeedback(
    fb: Omit<PrivateFeedback, "id" | "createdAt" | "status"> & {
      id?: string;
      createdAt?: string;
      status?: FeedbackStatus;
    }
  ): PrivateFeedback {
    const store = getStore();
    const newFeedback: PrivateFeedback = {
      id: fb.id || `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: fb.createdAt || new Date().toISOString(),
      status: fb.status || "new",
      ...fb,
    };
    store.feedback.unshift(newFeedback);

    // Increment shielded count
    const ws = store.workspaces.find((w) => w.id === fb.workspaceId);
    if (ws) {
      ws.stats.shieldedReviews += 1;
    }

    store.updatedAt = new Date().toISOString();
    trySavePersisted(store);
    return newFeedback;
  },

  updatePrivateFeedback(id: string, status: FeedbackStatus, notes?: string): PrivateFeedback | null {
    const store = getStore();
    const fb = store.feedback.find((f) => f.id === id);
    if (!fb) return null;
    fb.status = status;
    if (notes !== undefined) fb.resolutionNotes = notes;
    store.updatedAt = new Date().toISOString();
    trySavePersisted(store);
    return fb;
  },

  getWidgetConfigs(workspaceId?: string): WidgetConfig[] {
    const store = getStore();
    if (!workspaceId) return store.widgets;
    return store.widgets.filter((w) => w.workspaceId === workspaceId);
  },

  getWidgetConfigById(id: string): WidgetConfig | undefined {
    return getStore().widgets.find((w) => w.id === id);
  },

  saveWidgetConfig(config: WidgetConfig): WidgetConfig {
    const store = getStore();
    const idx = store.widgets.findIndex((w) => w.id === config.id);
    if (idx >= 0) {
      store.widgets[idx] = config;
    } else {
      store.widgets.push(config);
    }
    store.updatedAt = new Date().toISOString();
    trySavePersisted(store);
    return config;
  },

  registerGoogleClient(result: GooglePlaceResult): {
    workspace: Workspace;
    reviews: ReviewItem[];
    widgets: WidgetConfig[];
  } {
    const wsId = `ws-${result.slug}`;

    const newWs: Workspace = {
      id: wsId,
      name: result.name,
      slug: result.slug,
      category: result.category,
      brandColor: result.brandColor,
      googlePlaceId: result.placeId,
      googleReviewUrl: result.googleReviewUrl,
      starThreshold: 4,
      customHeadline: `How was your experience with ${result.name}?`,
      customSubheadline: "Your candid feedback helps our team maintain premier standards.",
      createdAt: new Date().toISOString(),
      stats: {
        averageRating: result.rating,
        totalReviews: result.totalReviews,
        shieldedReviews: Math.round(result.totalReviews * 0.08),
        positiveRedirects: Math.round(result.totalReviews * 0.92),
      },
    };

    // 1. Save or update workspace
    this.saveWorkspace(newWs);

    // 2. Save initial customer reviews
    const createdReviews: ReviewItem[] = [];
    if (Array.isArray(result.initialReviews)) {
      for (const rev of result.initialReviews) {
        const added = this.addReview({
          id: rev.id,
          workspaceId: wsId,
          authorName: rev.authorName,
          authorAvatar: rev.authorAvatar,
          authorRole: rev.authorRole,
          authorLocation: rev.authorLocation,
          rating: rev.rating,
          reviewText: rev.reviewText,
          platform: rev.platform,
          sentiment: rev.rating >= 4 ? "positive" : "negative",
          reviewDate: rev.reviewDate,
          isVerified: rev.isVerified,
          isFeatured: rev.isFeatured,
        });
        createdReviews.push(added);
      }
    }

    // 3. Auto-generate embeddable widgets for immediate client website deployment
    const toastWidget: WidgetConfig = {
      id: `widget-${result.slug}-toasts`,
      workspaceId: wsId,
      type: "toast_notification",
      theme: "glassmorphism",
      title: `${result.name} — Live Verified Reviews`,
      position: "bottom_left",
      minRating: 4,
      maxReviews: 10,
      loopIntervalSeconds: 6,
      showPlatformBadge: true,
      showVerifiedCheck: true,
      showDate: true,
      customAccentColor: result.brandColor,
    };

    const wallWidget: WidgetConfig = {
      id: `widget-${result.slug}-wall`,
      workspaceId: wsId,
      type: "wall_of_love",
      theme: "light",
      title: `${result.name} — Wall of Love`,
      position: "embedded",
      minRating: 4,
      maxReviews: 20,
      loopIntervalSeconds: 0,
      showPlatformBadge: true,
      showVerifiedCheck: true,
      showDate: true,
      customAccentColor: result.brandColor,
    };

    this.saveWidgetConfig(toastWidget);
    this.saveWidgetConfig(wallWidget);

    return {
      workspace: newWs,
      reviews: createdReviews,
      widgets: [toastWidget, wallWidget],
    };
  },
};
