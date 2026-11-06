import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition, approveContent, handleContentEdit, requestChanges } from './contentStateMachine';
import { calculateCampaignFunnel, calculateCampaignProgress } from './campaignFunnel';
import { isFormatSupportedByPlatform, createPublishingJob } from './publishingRules';
import { ContentItem, User, Campaign } from '../types';

const mockUser: User = {
  id: 'usr_1',
  name: 'Alex Morgan',
  email: 'alex@brandgroup.co',
  role: 'Owner',
  avatar: 'AM'
};

const mockItem: ContentItem = {
  id: 'cnt_101',
  brandId: 'brd_aura',
  campaignId: 'cmp_glow',
  title: 'Morning Dew Drops Routine',
  objective: 'Brand Awareness',
  targetAudience: 'Skincare enthusiasts aged 22-35',
  funnelStage: 'TOFU',
  contentPillarId: 'pil_edu',
  format: 'instagram_reel',
  mainMessage: 'Hydration starts with 3 drops',
  creativeAngle: 'Satisfying ASMR Morning Prep',
  hook: 'Stop drying your skin with hot water!',
  storytelling: {
    hook: 'Stop drying your skin with hot water!',
    problem: 'Tight feeling after morning wash',
    agitation: 'Strip natural lipid barrier',
    solution: 'Dew Drops Hyaluronic barrier repair',
    cta: 'Save this morning routine'
  },
  visualDirection: 'Macro shot of dew drops on glass pipette',
  cta: 'Save for your morning routine',
  caption: 'Wake up your skin barrier in 3 steps.',
  hashtags: ['#CleanBeauty', '#MorningRoutine', '#SkincareTips'],
  status: 'IN_REVIEW',
  versions: [],
  currentVersion: 1
};

test('Content State Machine: Allowed and forbidden transitions', () => {
  assert.equal(canTransition('DRAFT', 'IN_REVIEW'), true);
  assert.equal(canTransition('IN_REVIEW', 'APPROVED'), true);
  assert.equal(canTransition('IN_REVIEW', 'CHANGES_REQUESTED'), true);
  // Cannot jump directly from DRAFT to PUBLISHED
  assert.equal(canTransition('DRAFT', 'PUBLISHED'), false);
  // Cannot jump from CHANGES_REQUESTED directly to APPROVED without IN_REVIEW
  assert.equal(canTransition('CHANGES_REQUESTED', 'APPROVED'), false);
});

test('PRD BR-009 & BR-014: Approval workflow and edit invalidation', () => {
  // 1. Approve content
  const approved = approveContent(mockItem, mockUser);
  assert.equal(approved.status, 'APPROVED');
  assert.equal(approved.approvedBy, 'Alex Morgan');
  assert.ok(approved.approvedAt);
  assert.ok(approved.idempotencyKey);

  // 2. Edit approved content -> Must invalidate approval and revert to IN_REVIEW (BR-014)
  const { updatedContent, approvalInvalidated } = handleContentEdit(
    approved,
    { title: 'Revised Morning Dew Drops' },
    mockUser,
    'Updated headline'
  );

  assert.equal(approvalInvalidated, true);
  assert.equal(updatedContent.status, 'IN_REVIEW');
  assert.equal(updatedContent.title, 'Revised Morning Dew Drops');
  assert.equal(updatedContent.approvedBy, undefined, 'Approver should be cleared on edit');
  assert.equal(updatedContent.approvedAt, undefined, 'Approval timestamp should be cleared on edit');
  assert.equal(updatedContent.currentVersion, 2);
  assert.equal(updatedContent.versions.length, 1);
});

test('Campaign Funnel: Breakdown and delta calculation', () => {
  const campaign: Campaign = {
    id: 'cmp_glow',
    brandId: 'brd_aura',
    name: 'Glow Barrier Spring 2026',
    objective: 'Drive brand reach and sales',
    targetAudience: 'Modern skincare lovers',
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    keyMessage: 'Nourish first, glow always',
    status: 'ACTIVE',
    tofuTarget: 50,
    mofuTarget: 30,
    bofuTarget: 20,
    contentItemIds: ['cnt_101', 'cnt_102', 'cnt_103', 'cnt_104']
  };

  const items: ContentItem[] = [
    { ...mockItem, id: 'cnt_101', funnelStage: 'TOFU', status: 'PUBLISHED' },
    { ...mockItem, id: 'cnt_102', funnelStage: 'TOFU', status: 'APPROVED' },
    { ...mockItem, id: 'cnt_103', funnelStage: 'MOFU', status: 'SCHEDULED' },
    { ...mockItem, id: 'cnt_104', funnelStage: 'BOFU', status: 'IN_REVIEW' }
  ];

  const breakdown = calculateCampaignFunnel(campaign, items);
  assert.equal(breakdown.total, 4);
  assert.equal(breakdown.tofuCount, 2);
  assert.equal(breakdown.mofuCount, 1);
  assert.equal(breakdown.bofuCount, 1);
  assert.equal(breakdown.tofuActualPct, 50);
  assert.equal(breakdown.tofuDelta, 0); // 50% actual vs 50% target

  const progress = calculateCampaignProgress(campaign, items);
  assert.equal(progress.totalCount, 4);
  assert.equal(progress.completedCount, 1);
  assert.ok(progress.percentage > 50);
});

test('Publishing Rules: Platform format capability and unapproved blocking', () => {
  assert.equal(isFormatSupportedByPlatform('instagram', 'instagram_reel'), true);
  assert.equal(isFormatSupportedByPlatform('instagram', 'pinterest_pin'), false);
  assert.equal(isFormatSupportedByPlatform('tiktok', 'tiktok_video'), true);

  // Unapproved item cannot be queued
  assert.throws(() => {
    createPublishingJob(mockItem, 'instagram'); // mockItem is IN_REVIEW
  }, /unapproved content/);

  // Approved item can be queued
  const approvedItem = approveContent(mockItem, mockUser);
  const job = createPublishingJob(approvedItem, 'instagram');
  assert.equal(job.status, 'QUEUED');
  assert.equal(job.platform, 'instagram');
  assert.ok(job.idempotencyKey);
});
