import { ContentFormat, ContentItem, PublishingJob, SocialPlatform } from '../types';

export const PLATFORM_CAPABILITIES: Record<SocialPlatform, {
  name: string;
  publishSupported: boolean;
  analyticsSupported: boolean;
  supportedFormats: ContentFormat[];
}> = {
  instagram: {
    name: 'Instagram (Meta)',
    publishSupported: true,
    analyticsSupported: true,
    supportedFormats: ['instagram_reel', 'instagram_carousel', 'instagram_story']
  },
  tiktok: {
    name: 'TikTok Direct Post',
    publishSupported: true,
    analyticsSupported: true,
    supportedFormats: ['tiktok_video']
  },
  youtube: {
    name: 'YouTube Data API',
    publishSupported: true,
    analyticsSupported: true,
    supportedFormats: ['youtube_shorts', 'youtube_video']
  },
  pinterest: {
    name: 'Pinterest API v5',
    publishSupported: true,
    analyticsSupported: true,
    supportedFormats: ['pinterest_pin']
  },
  facebook: {
    name: 'Facebook Pages API',
    publishSupported: true,
    analyticsSupported: true,
    supportedFormats: ['facebook_post', 'instagram_reel']
  }
};

export function isFormatSupportedByPlatform(platform: SocialPlatform, format: ContentFormat): boolean {
  return PLATFORM_CAPABILITIES[platform]?.supportedFormats.includes(format) ?? false;
}

export function createPublishingJob(content: ContentItem, platform: SocialPlatform): PublishingJob {
  if (content.status !== 'APPROVED' && content.status !== 'SCHEDULED') {
    throw new Error(`Cannot queue publishing job for unapproved content (Status: ${content.status}). PRD BR-009.`);
  }

  if (!isFormatSupportedByPlatform(platform, content.format)) {
    throw new Error(`Platform ${platform} does not support format ${content.format}. Check capability matrix.`);
  }

  const scheduledTime = content.scheduledFor || new Date().toISOString();
  const idempotencyKey = content.idempotencyKey || `job_${content.id}_v${content.currentVersion}_${Date.now()}`;

  return {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    contentId: content.id,
    brandId: content.brandId,
    platform,
    format: content.format,
    scheduledTime,
    status: 'QUEUED',
    idempotencyKey,
    retryCount: 0,
    maxRetries: 3,
    logTrail: [
      {
        timestamp: new Date().toISOString(),
        step: 'JOB_CREATED',
        status: 'info',
        details: `Publishing job queued with idempotency key ${idempotencyKey}`
      },
      {
        timestamp: new Date().toISOString(),
        step: 'APPROVAL_CHECK',
        status: 'success',
        details: `Verified content approval by ${content.approvedBy || 'Authorized Seat'}`
      }
    ]
  };
}

export function simulateJobExecution(job: PublishingJob): {
  updatedJob: PublishingJob;
  success: boolean;
} {
  const isPastTime = new Date(job.scheduledTime).getTime() <= Date.now() + 60000;
  
  if (!isPastTime) {
    return {
      updatedJob: {
        ...job,
        status: 'SCHEDULED'
      },
      success: true
    };
  }

  // Execute
  const newLog = {
    timestamp: new Date().toISOString(),
    step: 'EXECUTION_DISPATCH',
    status: 'success' as const,
    details: `Successfully published via ${PLATFORM_CAPABILITIES[job.platform].name} API.`
  };

  return {
    updatedJob: {
      ...job,
      status: 'PUBLISHED',
      publishedUrl: `https://${job.platform}.com/kompas_preview/${job.contentId}`,
      logTrail: [...job.logTrail, newLog]
    },
    success: true
  };
}
