import { Campaign, ContentItem, FunnelStage } from '../types';

export interface FunnelBreakdown {
  tofuCount: number;
  mofuCount: number;
  bofuCount: number;
  total: number;
  tofuActualPct: number;
  mofuActualPct: number;
  bofuActualPct: number;
  tofuDelta: number; // actual % - target %
  mofuDelta: number;
  bofuDelta: number;
}

export function calculateCampaignFunnel(campaign: Campaign, allItems: ContentItem[]): FunnelBreakdown {
  const linkedItems = allItems.filter(item => 
    item.campaignId === campaign.id || (campaign.contentItemIds && campaign.contentItemIds.includes(item.id))
  );

  let tofu = 0;
  let mofu = 0;
  let bofu = 0;

  linkedItems.forEach(item => {
    if (item.funnelStage === 'TOFU') tofu++;
    else if (item.funnelStage === 'MOFU') mofu++;
    else if (item.funnelStage === 'BOFU') bofu++;
  });

  const total = linkedItems.length;
  const tofuActualPct = total > 0 ? Math.round((tofu / total) * 100) : 0;
  const mofuActualPct = total > 0 ? Math.round((mofu / total) * 100) : 0;
  const bofuActualPct = total > 0 ? Math.round((bofu / total) * 100) : 0;

  const targetTofu = campaign.tofuTarget ?? 50;
  const targetMofu = campaign.mofuTarget ?? 30;
  const targetBofu = campaign.bofuTarget ?? 20;

  return {
    tofuCount: tofu,
    mofuCount: mofu,
    bofuCount: bofu,
    total,
    tofuActualPct,
    mofuActualPct,
    bofuActualPct,
    tofuDelta: tofuActualPct - targetTofu,
    mofuDelta: mofuActualPct - targetMofu,
    bofuDelta: bofuActualPct - targetBofu
  };
}

export function calculateCampaignProgress(campaign: Campaign, allItems: ContentItem[]): {
  completedCount: number;
  totalCount: number;
  percentage: number;
} {
  const linkedItems = allItems.filter(item => 
    item.campaignId === campaign.id || (campaign.contentItemIds && campaign.contentItemIds.includes(item.id))
  );
  if (linkedItems.length === 0) return { completedCount: 0, totalCount: 0, percentage: 0 };

  const completed = linkedItems.filter(item => item.status === 'PUBLISHED').length;
  const inFlight = linkedItems.filter(item => 
    item.status === 'APPROVED' || item.status === 'SCHEDULED' || item.status === 'QUEUED' || item.status === 'PUBLISHING'
  ).length;

  // Weighted progress: Published = 100%, Approved/Scheduled = 60%, In Review/Draft = 20%
  const score = linkedItems.reduce((acc, item) => {
    if (item.status === 'PUBLISHED') return acc + 1;
    if (item.status === 'SCHEDULED' || item.status === 'QUEUED' || item.status === 'APPROVED') return acc + 0.6;
    if (item.status === 'IN_REVIEW') return acc + 0.3;
    return acc + 0.1;
  }, 0);

  const percentage = Math.min(100, Math.round((score / linkedItems.length) * 100));

  return {
    completedCount: completed,
    totalCount: linkedItems.length,
    percentage
  };
}
