import { ContentItem, ContentStatus, User } from '../types';

export const ALLOWED_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: ['IN_REVIEW', 'ARCHIVED'],
  IN_REVIEW: ['APPROVED', 'CHANGES_REQUESTED', 'DRAFT', 'ARCHIVED'],
  CHANGES_REQUESTED: ['IN_REVIEW', 'DRAFT', 'ARCHIVED'],
  APPROVED: ['SCHEDULED', 'QUEUED', 'IN_REVIEW', 'CANCELLED'],
  SCHEDULED: ['QUEUED', 'CANCELLED', 'IN_REVIEW'],
  QUEUED: ['PUBLISHING', 'FAILED', 'CANCELLED'],
  PUBLISHING: ['PUBLISHED', 'FAILED'],
  PUBLISHED: ['ARCHIVED'],
  FAILED: ['QUEUED', 'CANCELLED', 'ARCHIVED'],
  CANCELLED: ['DRAFT', 'ARCHIVED'],
  ARCHIVED: ['DRAFT']
};

export function canTransition(current: ContentStatus, target: ContentStatus): boolean {
  if (current === target) return true;
  return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
}

/**
 * BR-009: Scheduling is only allowed after a user explicitly approves the content.
 * Do not treat DRAFT, IN_REVIEW, or CHANGES_REQUESTED as implicitly approved.
 */
export function canScheduleContent(content: Pick<ContentItem, 'status'>): boolean {
  return content.status === 'APPROVED';
}

/**
 * BR-014: Any edit to an approved or scheduled content item immediately
 * invalidates previous approval and returns it to IN_REVIEW.
 */
export function handleContentEdit(
  content: ContentItem,
  updates: Partial<Omit<ContentItem, 'id' | 'brandId' | 'versions' | 'currentVersion'>>,
  editorUser: User,
  changeNote: string = 'Updated creative copy'
): { updatedContent: ContentItem; approvalInvalidated: boolean } {
  const isApprovedOrScheduled = content.status === 'APPROVED' || content.status === 'SCHEDULED' || content.status === 'QUEUED';
  
  const newVersionNumber = content.currentVersion + 1;
  const newVersion = {
    versionNumber: newVersionNumber,
    timestamp: new Date().toISOString(),
    author: editorUser.name,
    title: updates.title ?? content.title,
    hook: updates.hook ?? content.hook,
    caption: updates.caption ?? content.caption,
    changeNote: changeNote + (isApprovedOrScheduled ? ' (Approval invalidated)' : '')
  };

  const statusAfterEdit: ContentStatus = isApprovedOrScheduled ? 'IN_REVIEW' : content.status;

  const updatedContent: ContentItem = {
    ...content,
    ...updates,
    currentVersion: newVersionNumber,
    versions: [newVersion, ...content.versions],
    status: statusAfterEdit,
    // Reset approval fields if invalidated
    approvedBy: isApprovedOrScheduled ? undefined : content.approvedBy,
    approvedAt: isApprovedOrScheduled ? undefined : content.approvedAt,
    idempotencyKey: isApprovedOrScheduled ? undefined : content.idempotencyKey
  };

  return {
    updatedContent,
    approvalInvalidated: isApprovedOrScheduled
  };
}

/**
 * BR-009: Explicit approval workflow
 */
export function approveContent(content: ContentItem, approver: User): ContentItem {
  if (!canTransition(content.status, 'APPROVED')) {
    throw new Error(`Cannot approve content from current status: ${content.status}`);
  }

  const now = new Date().toISOString();
  return {
    ...content,
    status: 'APPROVED',
    approvedBy: approver.name,
    approvedAt: now,
    idempotencyKey: `idemp_${content.id}_v${content.currentVersion}_${Date.now()}`
  };
}

/**
 * Request changes or reject content
 */
export function requestChanges(content: ContentItem, reviewer: User, reason: string): ContentItem {
  if (!canTransition(content.status, 'CHANGES_REQUESTED')) {
    throw new Error(`Cannot request changes from current status: ${content.status}`);
  }

  return {
    ...content,
    status: 'CHANGES_REQUESTED',
    referenceNotes: `${content.referenceNotes ? content.referenceNotes + '\n' : ''}[Change Request from ${reviewer.name}]: ${reason}`
  };
}
