import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Brand,
  Campaign,
  ContentItem,
  IdeaItem,
  Competitor,
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
import { approveContent, handleContentEdit, requestChanges } from '../logic/contentStateMachine';
import { createPublishingJob, simulateJobExecution } from '../logic/publishingRules';

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
  
  // Campaigns
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'contentItemIds'>) => void;
  
  // Content Items & Creative Studio
  contentItems: ContentItem[];
  selectedContentId: string | null;
  selectedContent: ContentItem | null;
  setSelectedContentId: (id: string | null) => void;
  approveContentItem: (contentId: string) => void;
  requestChangesOnItem: (contentId: string, reason: string) => void;
  updateContentItem: (contentId: string, updates: Partial<ContentItem>, note?: string) => void;
  createContentItem: (item: Partial<ContentItem>) => ContentItem;
  
  // Ideas
  ideas: IdeaItem[];
  createIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'status'>) => void;
  convertIdeaToContentBrief: (ideaId: string) => string; // returns contentId
  
  // Calendar & Publishing
  scheduleContentItem: (contentId: string, scheduledTime: string, platform: SocialPlatform) => void;
  publishingJobs: PublishingJob[];
  retryPublishingJob: (jobId: string) => void;
  cancelPublishingJob: (jobId: string) => void;
  
  // Competitors & Integrations
  competitors: Competitor[];
  addCompetitor: (comp: Omit<Competitor, 'id' | 'snapshots'>) => void;
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
  const [workspace] = useState<Workspace>(CURRENT_WORKSPACE);
  const [currentUser] = useState<User>(CURRENT_WORKSPACE.users[0]);
  
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
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
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
  const approveContentItem = (contentId: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        const approved = approveContent(item, currentUser);
        logAudit('CONTENT_APPROVED', 'CONTENT', contentId, `Approved brief "${item.title}"`);
        return approved;
      }
      return item;
    }));
  };

  const requestChangesOnItem = (contentId: string, reason: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        const revised = requestChanges(item, currentUser, reason);
        logAudit('CONTENT_CHANGES_REQUESTED', 'CONTENT', contentId, `Requested revisions for "${item.title}": ${reason}`);
        return revised;
      }
      return item;
    }));
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
      id: `idea_${Date.now()}`,
      status: 'IDEA',
      createdAt: new Date().toISOString()
    };
    setIdeas(prev => [newIdea, ...prev]);
    logAudit('IDEA_CREATED', 'CONTENT', newIdea.id, `Logged new idea: "${newIdea.title}"`);
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

  const scheduleContentItem = (contentId: string, scheduledTime: string, platform: SocialPlatform) => {
    const item = contentItems.find(c => c.id === contentId);
    if (!item) return;

    if (item.status !== 'APPROVED') {
      showToast(`Approval required: Content must be APPROVED before scheduling (PRD BR-009). Current status is ${item.status}.`);
      return;
    }

    const updatedItem: ContentItem = {
      ...item,
      status: 'SCHEDULED',
      scheduledFor: scheduledTime
    };

    setContentItems(prev => prev.map(c => c.id === contentId ? updatedItem : c));

    // Create or update publishing job
    try {
      const job = createPublishingJob(updatedItem, platform);
      setPublishingJobs(prev => [job, ...prev.filter(j => j.contentId !== contentId)]);
      logAudit('CONTENT_SCHEDULED', 'PUBLISHING', contentId, `Scheduled "${item.title}" for ${new Date(scheduledTime).toLocaleString()} on ${platform}`);
    } catch (err: unknown) {
      showToast((err as Error).message);
    }
  };

  const retryPublishingJob = (jobId: string) => {
    setPublishingJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const retried: PublishingJob = {
          ...job,
          retryCount: job.retryCount + 1,
          status: 'QUEUED',
          logTrail: [
            ...job.logTrail,
            {
              timestamp: new Date().toISOString(),
              step: 'JOB_RETRY',
              status: 'info',
              details: `Manual retry dispatched (Attempt ${job.retryCount + 1}/${job.maxRetries})`
            }
          ]
        };
        const { updatedJob } = simulateJobExecution(retried);
        logAudit('PUBLISHING_RETRY', 'PUBLISHING', jobId, `Retried publishing job ${jobId}`);
        return updatedJob;
      }
      return job;
    }));
  };

  const cancelPublishingJob = (jobId: string) => {
    setPublishingJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        logAudit('PUBLISHING_CANCELLED', 'PUBLISHING', jobId, `Cancelled scheduled publishing job ${jobId}`);
        return {
          ...job,
          status: 'CANCELLED',
          logTrail: [
            ...job.logTrail,
            {
              timestamp: new Date().toISOString(),
              step: 'JOB_CANCELLED',
              status: 'warn',
              details: `Cancelled by user ${currentUser.name}`
            }
          ]
        };
      }
      return job;
    }));
  };

  const createBrand = (brandData: Omit<Brand, 'id' | 'campaignCount' | 'totalFollowers' | 'avgEngagementRate'>) => {
    const newBrand: Brand = {
      ...brandData,
      id: `brd_${Date.now()}`,
      campaignCount: 0,
      totalFollowers: '0',
      avgEngagementRate: '0.0%'
    };
    setBrands(prev => [...prev, newBrand]);
    logAudit('BRAND_CREATED', 'BRAND', newBrand.id, `Created new brand "${newBrand.name}" in workspace`);
  };

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'contentItemIds'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `cmp_${Date.now()}`,
      contentItemIds: []
    };
    setCampaigns(prev => [...prev, newCamp]);
    setBrands(prev => prev.map(b => b.id === campaignData.brandId ? { ...b, campaignCount: b.campaignCount + 1 } : b));
    logAudit('CAMPAIGN_CREATED', 'CAMPAIGN', newCamp.id, `Created campaign "${newCamp.name}"`);
  };

  const addCompetitor = (compData: Omit<Competitor, 'id' | 'snapshots'>) => {
    const newComp: Competitor = {
      ...compData,
      id: `cmp_${Date.now()}`,
      snapshots: [
        {
          id: `snp_${Date.now()}`,
          competitorId: `cmp_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          publicFollowers: '120K',
          estimatedPostFreq: '1 post / day',
          topFormat: 'Video Reels',
          observedTheme: (compData.topPublicThemes && compData.topPublicThemes[0]) || compData.dominantThemes?.[0] || 'Brand messaging',
          differentiationOpportunity: compData.differentiationAngle || compData.whitespaceOpportunity || 'Diferensiasi kualitas'
        }
      ]
    };
    setCompetitors(prev => [newComp, ...prev]);
    logAudit('COMPETITOR_ADDED', 'BRAND', newComp.id, `Added competitor observation "${newComp.name}"`);
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
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg_1',
      sender: 'user',
      timestamp: '2025-10-02T09:10:00Z',
      content: 'Ringkas performa campaign Panen Raya Gayo dan sarankan 2 konten berikutnya.',
      contextPage: 'overview',
      contextBrand: 'Arunika Coffee'
    },
    {
      id: 'msg_2',
      sender: 'assistant',
      timestamp: '2025-10-02T09:11:00Z',
      content: `Campaign berjalan baik di TOFU tapi belum menutup funnel. Ringkasannya:\n\n• Engagement 5,1% di atas rata-rata brand 4,2% pada periode sama.\n• BOFU hanya 4 dari 18 konten: funnel belum seimbang; conversion belum terukur.\n• Rekomendasi konten 1: Testimoni pelanggan Gayo (Reel, BOFU).\n• Rekomendasi konten 2: Perbandingan harga per cangkir (Carousel, MOFU).\n\nSumber: D1 analytics_daily · 30 hari · bukan approval`,
      contextPage: 'overview',
      contextBrand: 'Arunika Coffee'
    }
  ]);

  const sendAIMessage = async (prompt: string) => {
    const userMsg: AIMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: prompt,
      contextPage: activePage,
      contextBrand: activeBrand.name
    };

    setAiMessages(prev => [...prev, userMsg]);
    setIsAILoading(true);

    try {
      // Simulate or call backend AI Assistant
      // Formulate deep, domain-specific intelligence response grounded in active brand and page
      await new Promise(r => setTimeout(r, 650));

      let responseText = '';
      const brand = activeBrand;
      const lower = prompt.toLowerCase();

      if (activePage === 'overview' || lower.includes('overview') || lower.includes('performance')) {
        responseText = `Based on current workspace telemetry for **${brand.name}**:
• Overall engagement is strong at **${brand.avgEngagementRate}** across ${brand.connectedPlatforms.join(', ')}.
• Your primary funnel bottleneck is in **BOFU conversion**—while TOFU educational reels are driving high bookmark saves, only 14% of scheduled items lead with a clear product benefit or trial CTA.
• Recommended action: Convert 2 high-performing educational concepts into 30-day proof stories before launching the next promotional cycle.`;
      } else if (activePage === 'creative' || lower.includes('hook') || lower.includes('script') || lower.includes('brief')) {
        responseText = `For the **${selectedContent?.title || 'current brief'}** targeting **${selectedContent?.targetAudience || brand.personas[0]?.name}**:
1. **Hook Enhancement**: Replace passive lead-in with pattern-interrupt: *"If your skin feels tight 20 minutes after putting on serum, you are stripping your lipid barrier."*
2. **Visual Pacing**: Use 0.8s micro-cuts in the first 3 seconds, cutting directly into the macro dropper texture on damp skin.
3. **CTA Alignment**: Ensure compliance with PRD BR-014—remember that editing any copy here will invalidate its previous approval and require review by ${CURRENT_WORKSPACE.users.find(u => u.id !== currentUser.id)?.name || 'a second seat'}.`;
      } else if (activePage === 'ideas' || lower.includes('idea') || lower.includes('angle')) {
        responseText = `Strategic idea clusters for **${brand.name}** under **${brand.pillars[0]?.name}**:
• **Idea 1 (TOFU)**: "The 3 common skincare ingredients that cancel each other out" (Reel / TikTok)
• **Idea 2 (MOFU)**: "Why we source bio-fermented edelweiss instead of wild harvesting" (Carousel)
• **Idea 3 (BOFU)**: "Customer skin barrier score before vs 21 days after" (Video case study)
Would you like me to push any of these directly to Idea Lab or convert them into a Creative Brief?`;
      } else if (activePage === 'competitors' || lower.includes('competitor')) {
        responseText = `Competitor Intelligence Audit:
We observe that direct competitors are leaning heavily into founder-led celebrity lifestyle content. This creates a significant **differentiation opportunity** for **${brand.name}**:
• Double down on transparent bio-tech laboratory metrics and unretouched dermatological microscopy.
• Consumers report fatigue with spiritual wellness claims; our clinical barrier restoration data will stand out sharply.`;
      } else {
        responseText = `Analyzing **${activePage.toUpperCase()}** for **${brand.name}**:
Our data confirms all linked content follows the **DATA → INSIGHT → STRATEGY → CREATIVITY → EXECUTION** cycle. Currently, you have **${contentItems.filter(c => c.brandId === brand.id && c.status === 'IN_REVIEW').length} items pending approval**. Reviewing these will unblock your publishing queue for the upcoming week.`;
      }

      const assistantMsg: AIMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: responseText,
        contextPage: activePage,
        contextBrand: brand.name
      };

      setAiMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Fallback
      setAiMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          content: 'Unable to query context engine. Please verify backend connection.',
          contextPage: activePage
        }
      ]);
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
        campaigns,
        selectedCampaignId,
        setSelectedCampaignId,
        createCampaign,
        contentItems,
        selectedContentId,
        selectedContent,
        setSelectedContentId,
        approveContentItem,
        requestChangesOnItem,
        updateContentItem,
        createContentItem,
        ideas,
        createIdea,
        convertIdeaToContentBrief,
        scheduleContentItem,
        publishingJobs,
        retryPublishingJob,
        cancelPublishingJob,
        competitors,
        addCompetitor,
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
