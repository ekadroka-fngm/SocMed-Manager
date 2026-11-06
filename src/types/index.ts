export type FunnelStage = 'TOFU' | 'MOFU' | 'BOFU';

export type ContentFormat = 
  | 'instagram_reel'
  | 'instagram_carousel'
  | 'instagram_story'
  | 'tiktok_video'
  | 'youtube_shorts'
  | 'youtube_video'
  | 'youtube_longform'
  | 'pinterest_pin'
  | 'facebook_post'
  | 'facebook_reel';

export type ContentStatus = 
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'QUEUED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'pinterest' | 'facebook';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Editor';
  avatar: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: 'Private Dual-Seat' | 'Private · 2 members' | string;
  users: User[];
  createdAt: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  targetPercentage: number;
  color: string;
}

export interface ProductOrService {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  usp: string;
  keyBenefits: string[];
}

export interface CustomerPersona {
  id: string;
  name: string;
  ageRange: string;
  role: string;
  corePainPoints: string[];
  desires: string[];
  preferredPlatforms: SocialPlatform[];
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  logo: string;
  themeColor?: string;
  positioning: string;
  voiceAndTone: string;
  personas: CustomerPersona[];
  products: ProductOrService[];
  pillars: ContentPillar[];
  connectedPlatforms: SocialPlatform[];
  campaignCount: number;
  totalFollowers: string;
  avgEngagementRate: string;
}

export interface CompetitorSnapshot {
  id: string;
  competitorId?: string;
  date?: string;
  snapshotDate?: string;
  postSnippet?: string;
  publicFollowers?: string;
  estimatedPostFreq?: string;
  topFormat?: string;
  observedTheme?: string;
  observedThemes?: string[];
  sourceUrl?: string;
  verifiedPublic?: boolean;
  differentiationOpportunity?: string;
}

export interface Competitor {
  id: string;
  brandId: string;
  name: string;
  handle?: string;
  platform: SocialPlatform;
  profileUrl: string;
  category?: string;
  postFrequency?: string;
  dominantThemes?: string[];
  whitespaceOpportunity?: string;
  status?: string;
  lastObservedAt?: string;
  lastResearched?: string;
  manualNotes?: string;
  topPublicThemes?: string[];
  differentiationAngle?: string;
  snapshots: CompetitorSnapshot[];
}

export interface IdeaItem {
  id: string;
  brandId: string;
  campaignId?: string;
  title: string;
  topic?: string;
  targetAudience?: string;
  audienceProblem?: string;
  objective?: string;
  funnelStage: FunnelStage;
  contentPillarId: string;
  creativeAngle?: string;
  format: ContentFormat;
  tone?: string;
  referenceUrl?: string;
  hypothesis?: string;
  status: 'IDEA' | 'SAVED' | 'CONVERTED' | 'NEW' | 'ARCHIVED';
  convertedContentId?: string;
  createdAt: string;
}

export interface StorytellingFlow {
  hook: string;
  problem: string;
  agitation: string;
  solution: string;
  cta: string;
}

export interface ContentVersion {
  versionNumber: number;
  timestamp?: string;
  modifiedAt?: string;
  author?: string;
  modifiedBy?: string;
  title?: string;
  hook?: string;
  caption?: string;
  cta?: string;
  hashtags?: string[];
  storytelling?: StorytellingFlow;
  changeNote?: string;
}

export interface ContentItem {
  id: string;
  brandId: string;
  campaignId?: string;
  sourceIdeaId?: string;
  title: string;
  objective: string;
  targetAudience: string;
  funnelStage: FunnelStage;
  contentPillarId: string;
  format: ContentFormat;
  mainMessage: string;
  creativeAngle: string;
  hook: string;
  storytelling?: StorytellingFlow;
  visualDirection: string;
  cta: string;
  caption: string;
  hashtags: string[];
  referenceNotes?: string;
  references?: string[];
  revisions?: any[];
  createdAt?: string;
  updatedAt?: string;
  
  // Workflow & Publishing
  status: ContentStatus;
  scheduledFor?: string;
  approvedBy?: string;
  approvedAt?: string;
  versions: ContentVersion[];
  currentVersion: number;
  idempotencyKey?: string;
  publishedUrl?: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  slug?: string;
  objective: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  keyMessage: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'IN_REVIEW' | 'COMPLETED';
  tofuTarget?: number;
  mofuTarget?: number;
  bofuTarget?: number;
  contentItemIds?: string[];
  primaryFunnelFocus?: string;
  targetFunnelBreakdown?: { TOFU?: number; MOFU?: number; BOFU?: number; tofu?: number; mofu?: number; bofu?: number };
  assignedProductIds?: string[];
  assignedPillarIds?: string[];
  publishedCount?: number;
  contentCount?: number;
  metrics?: {
    reach?: string;
    engagementRate?: string;
    conversions?: number;
    totalViews?: string;
  };
  funnelDistribution?: {
    tofu?: number;
    mofu?: number;
    bofu?: number;
    TOFU?: number;
    MOFU?: number;
    BOFU?: number;
  };
}

export interface PublishingJob {
  id: string;
  contentId: string;
  brandId: string;
  platform: SocialPlatform;
  format: ContentFormat;
  scheduledTime: string;
  status: ContentStatus;
  idempotencyKey: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  publishedUrl?: string;
  logTrail: {
    timestamp: string;
    step: string;
    status: 'info' | 'success' | 'warn' | 'error';
    details: string;
  }[];
}

export interface SocialIntegration {
  platform: SocialPlatform;
  platformName?: string;
  connected?: boolean;
  accountHandle: string;
  accountName?: string;
  avatarUrl?: string;
  lastSync?: string;
  publishSupported?: boolean;
  analyticsSupported?: boolean;
  supportedFormats: ContentFormat[];
  permissions?: string[];
  scopes?: string[];
  tokenStatus?: 'VALID' | 'REFRESH_REQUIRED' | 'EXPIRED';
  tokenExpiresAt?: string;
  lastSyncedAt?: string;
  errorRatePercent?: number;
  rateLimitQuotaPerHour?: number;
  rateLimitRemaining?: number;
  status?: string;
  quotaRemaining?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'BRAND' | 'CONTENT' | 'CONTENT_ITEM' | 'CAMPAIGN' | 'PUBLISHING' | 'SECURITY';
  entityId: string;
  details: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  contextPage?: string;
  contextBrand?: string;
}
