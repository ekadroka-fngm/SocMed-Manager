import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Brand,
  Campaign,
  ContentItem,
  IdeaItem,
  Competitor,
  CompetitorSnapshot,
  SocialIntegration,
  AuditLogItem,
  User,
  Workspace,
  PublishingJob,
  AIMessage,
  SocialPlatform,
  ContentFormat
} from '../types';
import {
  CURRENT_WORKSPACE,
  INITIAL_BRANDS,
  INITIAL_CAMPAIGNS,
  INITIAL_CONTENT_ITEMS,
  INITIAL_IDEAS,
  INITIAL_COMPETITORS,
  INITIAL_INTEGRATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { approveContent, canScheduleContent, canTransition, handleContentEdit, requestChanges } from '../logic/contentStateMachine';
import { createPublishingJob } from '../logic/publishingRules';

export type AppPage = 
  | 'overview'
  | 'brands'
  | 'intelligence'
  | 'campaigns'
  | 'ideas'
  | 'creative'
  | 'calendar'
  | 'analytics'
  | 'publishing'
  | 'competitors'
  | 'integrations'
  | 'settings';

interface AppContextType {
  // Navigation & View
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  navigateTo: (page: AppPage, options?: { campaignId?: string; contentId?: string }) => void;
  
  // Theme & Workspace
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  workspace: Workspace;
  currentUser: User;
  
  // Active Brand
  activeBrandId: string;
  activeBrand: Brand;
  switchBrand: (brandId: string) => void;
  selectBrand: (brandId: string) => void;
  brands: Brand[];
  createBrand: (brand: Omit<Brand, 'id' | 'campaignCount' | 'totalFollowers' | 'avgEngagementRate'>) => void;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  archiveBrand: (brandId: string) => boolean;
  
  // Campaigns
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'contentItemIds'>) => void;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  
  // Content Items & Creative Studio
  contentItems: ContentItem[];
  selectedContentId: string | null;
  selectedContent: ContentItem | null;
  setSelectedContentId: (id: string | null) => void;
  submitContentForReview: (contentId: string) => boolean;
  approveContentItem: (contentId: string) => boolean;
  requestChangesOnItem: (contentId: string, reason: string) => boolean;
  updateContentItem: (contentId: string, updates: Partial<ContentItem>, note?: string) => void;
  createContentItem: (item: Partial<ContentItem>) => ContentItem;
  
  // Ideas
  ideas: IdeaItem[];
  createIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'status'>) => void;
  updateIdeaStatus: (ideaId: string, status: IdeaItem['status']) => void;
  convertIdeaToContentBrief: (ideaId: string) => string; // returns contentId
  
  // Calendar & Publishing
  scheduleContentItem: (contentId: string, scheduledTime: string, platform: SocialPlatform) => boolean;
  publishingJobs: PublishingJob[];
  retryPublishingJob: (jobId: string) => void;
  cancelPublishingJob: (jobId: string) => void;
  
  // Competitors & Integrations
  competitors: Competitor[];
  addCompetitor: (comp: Omit<Competitor, 'id' | 'snapshots'>) => string;
  addCompetitorSnapshot: (competitorId: string, snapshot: Omit<CompetitorSnapshot, 'id' | 'competitorId'>) => void;
  integrations: SocialIntegration[];
  toggleIntegration: (platform: SocialPlatform) => void;
  syncIntegration: (platform: SocialPlatform) => void;
  
  // Audit Logs & Search / Filters
  auditLogs: AuditLogItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: '7d' | '30d' | '90d' | 'all';
  setDateRange: (range: '7d' | '30d' | '90d' | 'all') => void;
  
  // UI Panels
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  setIsAiAssistantOpen: (open: boolean) => void;
  isQuickAccessOpen: boolean;
  setIsQuickAccessOpen: (open: boolean) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  
  // AI Assistant
  aiMessages: AIMessage[];
  sendAIMessage: (prompt: string) => Promise<void>;
  clearAIConversation: () => void;
  isAILoading: boolean;

  // Toast & Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Scheduling Modal
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  scheduleModalContentId?: string;
  openScheduleModal: (contentId?: string) => void;
  closeScheduleModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [workspace, setWorkspace] = useState<Workspace>(CURRENT_WORKSPACE);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_WORKSPACE.users[0]);
  
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [activeBrandId, setActiveBrandId] = useState<string>('brd_arunika');
  
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>('cmp_panen_gayo');
  
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [selectedContentId, setSelectedContentId] = useState<string | null>('cnt_panen_gayo_1');
  
  const [ideas, setIdeas] = useState<IdeaItem[]>(INITIAL_IDEAS);
  const [competitors, setCompetitors] = useState<Competitor[]>(INITIAL_COMPETITORS);
  const [integrations, setIntegrations] = useState<SocialIntegration[]>(INITIAL_INTEGRATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  
  const [publishingJobs, setPublishingJobs] = useState<PublishingJob[]>(() => {
    // initialize from approved and scheduled items
    return INITIAL_CONTENT_ITEMS
      .filter(item => item.status === 'QUEUED' || item.status === 'SCHEDULED' || item.status === 'PUBLISHED')
      .map(item => {
        try {
          const platform = (item.format.includes('instagram') ? 'instagram' :
                           item.format.includes('tiktok') ? 'tiktok' :
                           item.format.includes('youtube') ? 'youtube' :
                           item.format.includes('pinterest') ? 'pinterest' : 'facebook') as SocialPlatform;
          const job = createPublishingJob(item, platform);
          if (item.status === 'PUBLISHED') {
            job.status = 'PUBLISHED';
            job.publishedUrl = item.publishedUrl;
          }
          return job;
        } catch {
          return null;
        }
      })
      .filter((j): j is PublishingJob => j !== null);
  });

  // Cloud-backed workspace data. Initial demo data is bootstrapped once per workspace;
  // subsequent mutations are persisted with optimistic revision checks.
  type WorkspaceAppState = {
    brands: Brand[];
    campaigns: Campaign[];
    contentItems: ContentItem[];
    ideas: IdeaItem[];
    competitors: Competitor[];
    integrations: SocialIntegration[];
    publishingJobs: PublishingJob[];
  };

  const [isAppStateReady, setIsAppStateReady] = useState(false);
  const appStateRevisionRef = useRef(0);
  const appStateHydratedRef = useRef(false);
  const appStateSaveInFlightRef = useRef(false);
  const appStateSavePendingRef = useRef(false);
  const appStateErrorShownRef = useRef(false);

  const latestAppStateRef = useRef<WorkspaceAppState>({
    brands,
    campaigns,
    contentItems,
    ideas,
    competitors,
    integrations,
    publishingJobs
  });
  latestAppStateRef.current = {
    brands,
    campaigns,
    contentItems,
    ideas,
    competitors,
    integrations,
    publishingJobs
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scheduling Modal Global State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalContentId, setScheduleModalContentId] = useState<string | undefined>(undefined);

  const openScheduleModal = (contentId?: string) => {
    setScheduleModalContentId(contentId);
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setScheduleModalContentId(undefined);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const applyWorkspaceAppState = (snapshot: Partial<WorkspaceAppState>) => {
    if (Array.isArray(snapshot.brands)) {
      setBrands(snapshot.brands);
      setActiveBrandId(snapshot.brands[0]?.id || '');
    }
    if (Array.isArray(snapshot.campaigns)) {
      setCampaigns(snapshot.campaigns);
      setSelectedCampaignId(snapshot.campaigns[0]?.id || null);
    }
    if (Array.isArray(snapshot.contentItems)) {
      setContentItems(snapshot.contentItems);
      setSelectedContentId(snapshot.contentItems[0]?.id || null);
    }
    if (Array.isArray(snapshot.ideas)) setIdeas(snapshot.ideas);
    if (Array.isArray(snapshot.competitors)) setCompetitors(snapshot.competitors);
    if (Array.isArray(snapshot.integrations)) setIntegrations(snapshot.integrations);
    if (Array.isArray(snapshot.publishingJobs)) setPublishingJobs(snapshot.publishingJobs);
  };

  useEffect(() => {
    let cancelled = false;

    const initializeWorkspaceData = async () => {
      try {
        const identityResponse = await fetch('/api/v1/me');
        const identity = await identityResponse.json().catch(() => ({})) as {
          user?: { id?: string; email?: string; name?: string; role?: string };
          workspace?: { id?: string; name?: string; timezone?: string };
          error?: string;
        };
        if (!identityResponse.ok || !identity.user || !identity.workspace) {
          throw new Error(identity.error || 'Identitas workspace belum tersedia. Login Cloudflare Access diperlukan.');
        }
        if (cancelled) return;

        const displayName = identity.user.name || identity.user.email || 'Workspace member';
        setCurrentUser({
          id: identity.user.id || CURRENT_WORKSPACE.users[0].id,
          email: identity.user.email || CURRENT_WORKSPACE.users[0].email,
          name: displayName,
          role: identity.user.role === 'Editor' ? 'Editor' : 'Owner',
          avatar: displayName.split(/\\s+/).map(part => part.charAt(0)).join('').slice(0, 2).toUpperCase()
        });
        setWorkspace(previous => ({
          ...previous,
          id: identity.workspace?.id || previous.id,
          name: identity.workspace?.name || previous.name,
          timezone: identity.workspace?.timezone || previous.timezone
        }));

        const auditResponse = await fetch('/api/v1/audit-logs');
        const auditResult = await auditResponse.json().catch(() => ({})) as {
          data?: AuditLogItem[];
          error?: string;
        };
        if (auditResponse.ok && Array.isArray(auditResult.data)) {
          setAuditLogs(auditResult.data);
        }

        const response = await fetch('/api/v1/app-state');
        const result = await response.json().catch(() => ({})) as {
          revision?: number;
          state?: Partial<WorkspaceAppState> | null;
          error?: string;
        };
        if (!response.ok) throw new Error(result.error || `Gagal memuat data workspace (HTTP ${response.status}).`);
        if (cancelled) return;

        if (result.state) {
          applyWorkspaceAppState(result.state);
          appStateRevisionRef.current = Number(result.revision || 0);
        } else {
          // First workspace visit: seed the cloud store with the current starter dataset.
          const bootstrap = await fetch('/api/v1/app-state', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              expectedRevision: 0,
              state: latestAppStateRef.current
            })
          });
          const saved = await bootstrap.json().catch(() => ({})) as { revision?: number; error?: string };
          if (!bootstrap.ok) throw new Error(saved.error || `Gagal menyiapkan data workspace (HTTP ${bootstrap.status}).`);
          appStateRevisionRef.current = Number(saved.revision || 1);
        }

        appStateHydratedRef.current = true;
        setIsAppStateReady(true);
      } catch (error) {
        if (cancelled) return;
        appStateHydratedRef.current = false;
        setIsAppStateReady(false);
        showToast(error instanceof Error
          ? `${error.message} Data saat ini hanya tersedia di sesi browser.`
          : 'Cloud sync gagal. Data saat ini hanya tersedia di sesi browser.');
      }
    };

    void initializeWorkspaceData();
    return () => { cancelled = true; };
  }, []);

  const saveWorkspaceAppState = async (): Promise<void> => {
    if (!appStateHydratedRef.current) return;
    if (appStateSaveInFlightRef.current) {
      appStateSavePendingRef.current = true;
      return;
    }

    appStateSaveInFlightRef.current = true;
    try {
      do {
        appStateSavePendingRef.current = false;
        const response = await fetch('/api/v1/app-state', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            expectedRevision: appStateRevisionRef.current,
            state: latestAppStateRef.current
          })
        });
        const result = await response.json().catch(() => ({})) as { revision?: number; error?: string };
        if (response.status === 409) {
          const latest = await fetch('/api/v1/app-state');
          const remote = await latest.json().catch(() => ({})) as {
            revision?: number;
            state?: Partial<WorkspaceAppState> | null;
          };
          if (latest.ok && remote.state) {
            appStateRevisionRef.current = Number(remote.revision || 0);
            applyWorkspaceAppState(remote.state);
          }
          showToast(result.error || 'Data workspace berubah di perangkat lain. Data terbaru dimuat ulang.');
          break;
        }
        if (!response.ok) throw new Error(result.error || `Gagal menyimpan data workspace (HTTP ${response.status}).`);
        appStateRevisionRef.current = Number(result.revision || appStateRevisionRef.current + 1);
        appStateErrorShownRef.current = false;
      } while (appStateSavePendingRef.current);
    } catch (error) {
      if (!appStateErrorShownRef.current) {
        showToast(error instanceof Error ? error.message : 'Cloud sync gagal menyimpan perubahan.');
        appStateErrorShownRef.current = true;
      }
    } finally {
      appStateSaveInFlightRef.current = false;
      if (appStateSavePendingRef.current) {
        appStateSavePendingRef.current = false;
        void saveWorkspaceAppState();
      }
    }
  };

  useEffect(() => {
    if (!isAppStateReady || !appStateHydratedRef.current) return;
    const timer = window.setTimeout(() => {
      void saveWorkspaceAppState();
    }, 450);
    return () => window.clearTimeout(timer);
  }, [
    isAppStateReady,
    brands,
    campaigns,
    contentItems,
    ideas,
    competitors,
    integrations,
    publishingJobs,
    auditLogs
  ]);

  // Sync theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const activeBrand = brands.find(b => b.id === activeBrandId) || brands[0];
  const selectedContent = contentItems.find(c => c.id === selectedContentId) || contentItems[0] || null;

  const logAudit = (action: string, entityType: AuditLogItem['entityType'], entityId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `aud_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 200));
    void fetch('/api/v1/audit-logs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, entityType, entityId, details })
    }).then(response => {
      if (!response.ok) console.warn('Audit log was not persisted.', response.status);
    }).catch(error => {
      console.warn('Audit log request failed.', error);
    });
  };

  const switchBrand = (brandId: string) => {
    setActiveBrandId(brandId);
    // Find first campaign for this brand if exists
    const brandCamp = campaigns.find(c => c.brandId === brandId);
    if (brandCamp) setSelectedCampaignId(brandCamp.id);
    const brandContent = contentItems.find(c => c.brandId === brandId);
    if (brandContent) setSelectedContentId(brandContent.id);
    logAudit('BRAND_SWITCH', 'BRAND', brandId, `Switched active workspace brand to ${brands.find(b => b.id === brandId)?.name}`);
  };

  const navigateTo = (page: AppPage, options?: { campaignId?: string; contentId?: string }) => {
    setActivePage(page);
    if (options?.campaignId) setSelectedCampaignId(options.campaignId);
    if (options?.contentId) setSelectedContentId(options.contentId);
    setIsMobileDrawerOpen(false);
  };

  // Content Actions
  const submitContentForReview = (contentId: string): boolean => {
    const item = contentItems.find(content => content.id === contentId);
    if (!item) {
      showToast('Konten tidak ditemukan.');
      return false;
    }
    if (!canTransition(item.status, 'IN_REVIEW')) {
      showToast(`Konten berstatus ${item.status} tidak bisa dikirim ke review.`);
      return false;
    }

    setContentItems(prev => prev.map(content =>
      content.id === contentId
        ? { ...content, status: 'IN_REVIEW' }
        : content
    ));
    logAudit('CONTENT_SUBMITTED_FOR_REVIEW', 'CONTENT', contentId, `Submitted "${item.title}" for review.`);
    showToast('Konten berhasil dikirim untuk review.');
    return true;
  };

  const approveContentItem = (contentId: string): boolean => {
    const item = contentItems.find(content => content.id === contentId);
    if (!item) {
      showToast('Konten tidak ditemukan. Muat ulang daftar sebelum mencoba lagi.');
      return false;
    }

    try {
      const approved = approveContent(item, currentUser);
      setContentItems(prev => prev.map(content => content.id === contentId ? approved : content));
      logAudit('CONTENT_APPROVED', 'CONTENT', contentId, 'Approved brief "' + item.title + '" at version v' + item.currentVersion + '.');
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Konten tidak dapat disetujui pada status saat ini.');
      return false;
    }
  };

  const requestChangesOnItem = (contentId: string, reason: string): boolean => {
    const item = contentItems.find(content => content.id === contentId);
    if (!item) {
      showToast('Konten tidak ditemukan. Muat ulang daftar sebelum mencoba lagi.');
      return false;
    }
    if (!reason.trim()) {
      showToast('Alasan revisi wajib diisi.');
      return false;
    }

    try {
      const revised = requestChanges(item, currentUser, reason.trim());
      setContentItems(prev => prev.map(content => content.id === contentId ? revised : content));
      logAudit('CONTENT_CHANGES_REQUESTED', 'CONTENT', contentId, 'Requested revisions for "' + item.title + '": ' + reason.trim());
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Permintaan revisi tidak valid pada status saat ini.');
      return false;
    }
  };

  const updateContentItem = (contentId: string, updates: Partial<ContentItem>, note: string = 'Copy update') => {
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        const { updatedContent, approvalInvalidated } = handleContentEdit(item, updates, currentUser, note);
        if (approvalInvalidated) {
          logAudit('CONTENT_APPROVAL_INVALIDATED', 'CONTENT', contentId, `Edit on approved item "${item.title}" reverted status to IN_REVIEW (PRD BR-014).`);
        } else {
          logAudit('CONTENT_UPDATED', 'CONTENT', contentId, `Updated brief "${item.title}".`);
        }
        return updatedContent;
      }
      return item;
    }));
  };

  const createContentItem = (newItemData: Partial<ContentItem>): ContentItem => {
    const newId = `cnt_${Date.now()}`;
    const brand = activeBrand;
    const item: ContentItem = {
      id: newId,
      brandId: newItemData.brandId || brand.id,
      campaignId: newItemData.campaignId || selectedCampaignId || undefined,
      title: newItemData.title || 'Untitled Content Brief',
      objective: newItemData.objective || 'Drive audience awareness',
      targetAudience: newItemData.targetAudience || brand.personas[0]?.name || 'Target Audience',
      funnelStage: newItemData.funnelStage || 'TOFU',
      contentPillarId: newItemData.contentPillarId || brand.pillars[0]?.id || 'pil_1',
      format: newItemData.format || 'instagram_reel',
      mainMessage: newItemData.mainMessage || 'Core brand insight',
      creativeAngle: newItemData.creativeAngle || 'Creative concept hook',
      hook: newItemData.hook || 'Attention hook here...',
      storytelling: newItemData.storytelling || {
        hook: 'Attention hook',
        problem: 'Relatable consumer struggle',
        agitation: 'Consequence of ignoring problem',
        solution: 'Our brand methodology',
        cta: 'Clear next step call to action'
      },
      visualDirection: newItemData.visualDirection || 'Natural lighting, clean typography, editorial pacing.',
      cta: newItemData.cta || 'Save and follow for more insights',
      caption: newItemData.caption || 'Write compelling social copy here...',
      hashtags: newItemData.hashtags || ['#KompasIntelligence', '#BrandGrowth'],
      status: 'DRAFT',
      currentVersion: 1,
      versions: []
    };

    setContentItems(prev => [item, ...prev]);
    setSelectedContentId(newId);
    logAudit('CONTENT_CREATED', 'CONTENT', newId, `Created new content brief: "${item.title}"`);
    return item;
  };

  const createIdea = (ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'status'>) => {
    const newIdea: IdeaItem = {
      ...ideaData,
      id: `idea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    setIdeas(prev => [newIdea, ...prev]);
    logAudit('IDEA_CREATED', 'CONTENT', newIdea.id, `Logged new idea: "${newIdea.title}"`);
  };

  const updateIdeaStatus = (ideaId: string, status: IdeaItem['status']) => {
    const idea = ideas.find(item => item.id === ideaId);
    if (!idea) {
      showToast('Ide tidak ditemukan.');
      return;
    }
    if (idea.status === 'CONVERTED' && status !== 'ARCHIVED') {
      showToast('Ide yang sudah menjadi brief tidak bisa diubah statusnya.');
      return;
    }
    setIdeas(prev => prev.map(item => item.id === ideaId ? { ...item, status } : item));
    logAudit('IDEA_STATUS_UPDATED', 'CONTENT', ideaId, `Changed idea status from ${idea.status} to ${status}`);
  };

  const convertIdeaToContentBrief = (ideaId: string): string => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return '';

    const newContent = createContentItem({
      brandId: idea.brandId,
      campaignId: idea.campaignId,
      sourceIdeaId: idea.id,
      title: idea.title,
      objective: idea.objective,
      targetAudience: idea.targetAudience,
      funnelStage: idea.funnelStage,
      contentPillarId: idea.contentPillarId,
      format: idea.format,
      mainMessage: `Addressing problem: ${idea.audienceProblem}`,
      creativeAngle: idea.creativeAngle,
      hook: `Did you know? ${idea.topic || idea.title}`,
      caption: `${idea.title}\n\nHere is what you need to know:\n\n#${(idea.topic || idea.title).replace(/\s+/g, '')}`,
      hashtags: [`#${(idea.topic || idea.title).replace(/\s+/g, '')}`, '#ContentIntelligence']
    });

    // Mark idea as converted
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: 'CONVERTED', convertedContentId: newContent.id } : i));
    logAudit('IDEA_CONVERTED', 'CONTENT', idea.id, `Converted Idea #${idea.id} to Creative Studio Brief #${newContent.id}`);
    
    // Switch to Creative Studio with newly created content
    navigateTo('creative', { contentId: newContent.id });
    return newContent.id;
  };

  const scheduleContentItem = (contentId: string, scheduledTime: string, platform: SocialPlatform): boolean => {
    const item = contentItems.find(c => c.id === contentId);
    if (!item) {
      showToast('Konten tidak ditemukan. Muat ulang halaman lalu coba lagi.');
      return false;
    }

    // BR-009: Scheduling must never create approval as a side effect.
    if (!canScheduleContent(item)) {
      showToast(`Approval wajib dilakukan sebelum scheduling. Status konten saat ini: ${item.status}.`);
      return false;
    }

    try {
      const updatedItem: ContentItem = {
        ...item,
        status: 'SCHEDULED',
        scheduledFor: scheduledTime
      };
      const job = createPublishingJob(updatedItem, platform);

      // Update state only after job validation succeeds.
      setContentItems(prev => prev.map(c => c.id === contentId ? updatedItem : c));
      setPublishingJobs(prev => [job, ...prev.filter(j => j.contentId !== contentId)]);
      logAudit('CONTENT_SCHEDULED', 'PUBLISHING', contentId, `Scheduled "${item.title}" for ${new Date(scheduledTime).toLocaleString()} on ${platform}`);
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal membuat jadwal konten.');
      return false;
    }
  };

  const retryPublishingJob = (jobId: string) => {
    const job = publishingJobs.find(item => item.id === jobId);
    if (!job) {
      showToast('Job tidak ditemukan. Muat ulang daftar publishing.');
      return;
    }
    if (job.status !== 'FAILED') {
      showToast('Hanya job FAILED yang bisa dicoba ulang.');
      return;
    }
    if (job.retryCount >= job.maxRetries) {
      showToast('Batas percobaan ulang job sudah tercapai.');
      return;
    }

    const content = contentItems.find(item => item.id === job.contentId);
    if (!content || !content.approvedBy || !content.approvedAt) {
      showToast('Retry ditolak: bukti approval konten tidak ditemukan.');
      return;
    }

    const retried: PublishingJob = {
      ...job,
      retryCount: job.retryCount + 1,
      status: 'QUEUED',
      lastError: undefined,
      logTrail: [
        ...job.logTrail,
        {
          timestamp: new Date().toISOString(),
          step: 'RETRY_QUEUED',
          status: 'info',
          details: `Retry attempt ${job.retryCount + 1}/${job.maxRetries} masuk antrean lokal. Worker platform belum aktif.`
        }
      ]
    };

    setPublishingJobs(prev => prev.map(item => item.id === jobId ? retried : item));
    setContentItems(prev => prev.map(item => item.id === content.id ? { ...item, status: 'QUEUED' } : item));
    logAudit('PUBLISHING_RETRY_QUEUED', 'PUBLISHING', jobId, `Queued local retry attempt ${retried.retryCount}; no external publish call was made.`);
    showToast('Retry masuk antrean lokal. Konten belum dikirim ke platform.');
  };

  const cancelPublishingJob = (jobId: string) => {
    const job = publishingJobs.find(item => item.id === jobId);
    if (!job) {
      showToast('Job tidak ditemukan.');
      return;
    }
    if (!['QUEUED', 'SCHEDULED', 'FAILED'].includes(job.status)) {
      showToast(`Job berstatus ${job.status} tidak bisa dibatalkan.`);
      return;
    }

    const cancelled: PublishingJob = {
      ...job,
      status: 'CANCELLED',
      logTrail: [
        ...job.logTrail,
        {
          timestamp: new Date().toISOString(),
          step: 'JOB_CANCELLED',
          status: 'warn',
          details: `Dibatalkan oleh ${currentUser.name} di aplikasi.`
        }
      ]
    };
    setPublishingJobs(prev => prev.map(item => item.id === jobId ? cancelled : item));
    setContentItems(prev => prev.map(item =>
      item.id === job.contentId && ['SCHEDULED', 'QUEUED', 'FAILED'].includes(item.status)
        ? { ...item, status: 'CANCELLED' }
        : item
    ));
    logAudit('PUBLISHING_CANCELLED', 'PUBLISHING', jobId, `Cancelled local publishing job ${jobId}`);
    showToast('Jadwal dibatalkan. Tidak ada request ke platform sosial.');
  };

  const createBrand = (brandData: Omit<Brand, 'id' | 'campaignCount' | 'totalFollowers' | 'avgEngagementRate'>) => {
    const newBrand: Brand = {
      ...brandData,
      id: `brd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      campaignCount: 0,
      totalFollowers: '0',
      avgEngagementRate: '0.0%'
    };
    setBrands(prev => [...prev, newBrand]);
    logAudit('BRAND_CREATED', 'BRAND', newBrand.id, `Created new brand "${newBrand.name}" in workspace session`);
  };

  const updateBrand = (brandId: string, updates: Partial<Brand>) => {
    const existing = brands.find(brand => brand.id === brandId);
    if (!existing) {
      showToast('Brand tidak ditemukan.');
      return;
    }
    setBrands(prev => prev.map(brand => brand.id === brandId ? { ...brand, ...updates } : brand));
    logAudit('BRAND_UPDATED', 'BRAND', brandId, `Updated brand "${existing.name}"`);
  };

  const archiveBrand = (brandId: string): boolean => {
    const brand = brands.find(item => item.id === brandId);
    if (!brand) {
      showToast('Brand tidak ditemukan.');
      return false;
    }
    if (brands.length <= 1) {
      showToast('Minimal satu brand harus tetap aktif di workspace.');
      return false;
    }

    const remainingBrands = brands.filter(item => item.id !== brandId);
    setBrands(remainingBrands);
    if (activeBrandId === brandId) {
      setActiveBrandId(remainingBrands[0].id);
    }
    logAudit('BRAND_ARCHIVED', 'BRAND', brandId, `Archived brand "${brand.name}" from the active brand list.`);
    return true;
  };

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'contentItemIds'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      contentItemIds: []
    };
    setCampaigns(prev => [...prev, newCamp]);
    setSelectedCampaignId(newCamp.id);
    setBrands(prev => prev.map(b => b.id === campaignData.brandId ? { ...b, campaignCount: b.campaignCount + 1 } : b));
    logAudit('CAMPAIGN_CREATED', 'CAMPAIGN', newCamp.id, `Created campaign "${newCamp.name}"`);
  };

  const updateCampaign = (campaignId: string, updates: Partial<Campaign>) => {
    const existing = campaigns.find(campaign => campaign.id === campaignId);
    if (!existing) {
      showToast('Campaign tidak ditemukan.');
      return;
    }
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === campaignId ? { ...campaign, ...updates } : campaign
    ));
    logAudit('CAMPAIGN_UPDATED', 'CAMPAIGN', campaignId, `Updated campaign "${existing.name}".`);
  };

  const addCompetitor = (compData: Omit<Competitor, 'id' | 'snapshots'>): string => {
    const newComp: Competitor = {
      ...compData,
      id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      snapshots: []
    };
    setCompetitors(prev => [newComp, ...prev]);
    logAudit('COMPETITOR_ADDED', 'BRAND', newComp.id, `Added competitor "${newComp.name}" without fabricated metrics.`);
    return newComp.id;
  };

  const addCompetitorSnapshot = (
    competitorId: string,
    snapshotData: Omit<CompetitorSnapshot, 'id' | 'competitorId'>
  ) => {
    const competitor = competitors.find(item => item.id === competitorId);
    if (!competitor) {
      showToast('Kompetitor tidak ditemukan.');
      return;
    }

    const snapshot: CompetitorSnapshot = {
      ...snapshotData,
      id: `snp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      competitorId
    };
    setCompetitors(prev => prev.map(item =>
      item.id === competitorId
        ? {
            ...item,
            snapshots: [snapshot, ...item.snapshots],
            lastObservedAt: snapshot.snapshotDate || snapshot.date || new Date().toISOString()
          }
        : item
    ));
    logAudit('COMPETITOR_SNAPSHOT_ADDED', 'BRAND', competitorId, `Added manual snapshot for "${competitor.name}".`);
    showToast('Snapshot observasi tersimpan di sesi aplikasi.');
  };

  const toggleIntegration = (platform: SocialPlatform) => {
    setIntegrations(prev => prev.map(item => {
      if (item.platform === platform) {
        const updated = {
          ...item,
          connected: !item.connected,
          tokenStatus: (!item.connected ? 'VALID' : 'EXPIRED') as 'VALID' | 'EXPIRED'
        };
        logAudit(
          updated.connected ? 'INTEGRATION_CONNECTED' : 'INTEGRATION_DISCONNECTED',
          'SECURITY',
          platform,
          `${updated.connected ? 'Connected' : 'Disconnected'} ${item.platformName}`
        );
        return updated;
      }
      return item;
    }));
  };

  const syncIntegration = (platform: SocialPlatform) => {
    setIntegrations(prev => prev.map(item => {
      if (item.platform === platform) {
        logAudit('INTEGRATION_SYNC', 'SECURITY', platform, `Manually refreshed token and metrics for ${item.platformName}`);
        return {
          ...item,
          lastSync: 'Just now',
          tokenStatus: 'VALID'
        };
      }
      return item;
    }));
  };

  // AI Assistant Chat Messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);

  const clearAIConversation = () => {
    if (isAILoading) {
      showToast('Tunggu sampai jawaban AI selesai sebelum memulai sesi baru.');
      return;
    }
    setAiMessages([]);
  };

  const sendAIMessage = async (prompt: string) => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isAILoading) return;

    const userMsg: AIMessage = {
      id: `msg_user_${crypto.randomUUID()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: cleanPrompt,
      contextPage: activePage,
      contextBrand: activeBrand.name
    };

    const priorHistory = aiMessages.slice(-8).map(message => ({
      sender: message.sender,
      content: message.content
    }));

    setAiMessages(prev => [...prev, userMsg]);
    setIsAILoading(true);

    const activeBrandContent = contentItems.filter(item => item.brandId === activeBrand.id);
    const activeBrandCampaigns = campaigns.filter(item => item.brandId === activeBrand.id);
    const activeBrandIdeas = ideas.filter(item => item.brandId === activeBrand.id);
    const activeBrandCompetitors = competitors.filter(item => item.brandId === activeBrand.id);
    const statusCounts = activeBrandContent.reduce<Record<string, number>>((counts, item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
      return counts;
    }, {});
    const funnelCounts = activeBrandContent.reduce<Record<string, number>>((counts, item) => {
      counts[item.funnelStage] = (counts[item.funnelStage] || 0) + 1;
      return counts;
    }, {});

    const context = {
      page: activePage,
      workspace: { name: workspace.name, timezone: workspace.createdAt ? 'Asia/Jakarta' : 'Asia/Jakarta' },
      currentUser: { name: currentUser.name, role: currentUser.role },
      brand: {
        id: activeBrand.id,
        name: activeBrand.name,
        category: activeBrand.category,
        positioning: activeBrand.positioning,
        voiceAndTone: activeBrand.voiceAndTone,
        pillars: activeBrand.pillars.map(pillar => pillar.name),
        personas: activeBrand.personas.map(persona => persona.name),
        products: activeBrand.products.map(product => product.name)
      },
      selectedContent: selectedContent ? {
        title: selectedContent.title,
        status: selectedContent.status,
        funnelStage: selectedContent.funnelStage,
        format: selectedContent.format,
        hook: selectedContent.hook,
        caption: selectedContent.caption,
        cta: selectedContent.cta
      } : null,
      contentSummary: {
        total: activeBrandContent.length,
        byStatus: statusCounts,
        byFunnel: funnelCounts,
        upcomingSchedules: activeBrandContent
          .filter(item => item.scheduledFor && ['SCHEDULED', 'QUEUED'].includes(item.status))
          .slice(0, 10)
          .map(item => ({ title: item.title, status: item.status, scheduledFor: item.scheduledFor }))
      },
      campaigns: activeBrandCampaigns.slice(0, 12).map(campaign => ({
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        funnelDistribution: campaign.funnelDistribution
      })),
      ideas: activeBrandIdeas.slice(0, 12).map(idea => ({
        title: idea.title,
        funnelStage: idea.funnelStage,
        status: idea.status,
        format: idea.format
      })),
      competitors: activeBrandCompetitors.slice(0, 10).map(competitor => ({
        name: competitor.name,
        platform: competitor.platform,
        category: competitor.category,
        observedThemes: competitor.dominantThemes,
        latestObservation: competitor.snapshots[0]?.postSnippet || competitor.manualNotes || null,
        lastObservedAt: competitor.lastObservedAt || null
      })),
      publishing: {
        jobs: publishingJobs.filter(job => job.brandId === activeBrand.id).length,
        queued: publishingJobs.filter(job => job.brandId === activeBrand.id && ['QUEUED', 'SCHEDULED'].includes(job.status)).length
      },
      availableDataNotes: [
        'Social reach, impressions, follower growth, watch time, conversion and competitor private metrics are not available unless a connected official API or verified manual snapshot supplies them.',
        'A local publishing job is not proof that a post has been published.',
        'Do not infer metrics that are not present in this context.'
      ]
    };

    try {
      const response = await fetch('/api/v1/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: cleanPrompt, context, history: priorHistory })
      });
      const result = await response.json().catch(() => ({})) as { text?: string; error?: string; model?: string };
      if (!response.ok) {
        throw new Error(result.error || `GPT tidak bisa dihubungi (HTTP ${response.status}).`);
      }
      if (!result.text?.trim()) {
        throw new Error('GPT tidak mengembalikan jawaban.');
      }

      const assistantMsg: AIMessage = {
        id: `msg_ai_${crypto.randomUUID()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: result.text.trim(),
        contextPage: activePage,
        contextBrand: activeBrand.name
      };
      setAiMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GPT gagal memproses permintaan.';
      setAiMessages(prev => [...prev, {
        id: `msg_err_${crypto.randomUUID()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: message,
        contextPage: activePage,
        contextBrand: activeBrand.name
      }]);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        navigateTo,
        theme,
        setTheme,
        toggleTheme,
        workspace,
        currentUser,
        activeBrandId,
        activeBrand,
        switchBrand,
        selectBrand: switchBrand,
        brands,
        createBrand,
        updateBrand,
        archiveBrand,
        campaigns,
        selectedCampaignId,
        setSelectedCampaignId,
        createCampaign,
        updateCampaign,
        contentItems,
        selectedContentId,
        selectedContent,
        setSelectedContentId,
        submitContentForReview,
        approveContentItem,
        requestChangesOnItem,
        updateContentItem,
        createContentItem,
        ideas,
        createIdea,
        updateIdeaStatus,
        convertIdeaToContentBrief,
        scheduleContentItem,
        publishingJobs,
        retryPublishingJob,
        cancelPublishingJob,
        competitors,
        addCompetitor,
        addCompetitorSnapshot,
        integrations,
        toggleIntegration,
        syncIntegration,
        auditLogs,
        searchQuery,
        setSearchQuery,
        dateRange,
        setDateRange,
        isAssistantOpen,
        setIsAssistantOpen,
        setIsAiAssistantOpen: setIsAssistantOpen,
        isQuickAccessOpen,
        setIsQuickAccessOpen,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        aiMessages,
        sendAIMessage,
        clearAIConversation,
        isAILoading,
        toastMessage,
        showToast,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        scheduleModalContentId,
        openScheduleModal,
        closeScheduleModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
