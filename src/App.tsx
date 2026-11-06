import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { GooeyQuickAccess } from './components/quickaccess/GooeyQuickAccess';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { ScheduleModal } from './components/modals/ScheduleModal';

// Pages
import { OverviewPage } from './components/pages/OverviewPage';
import { BrandsPage } from './components/pages/BrandsPage';
import { IntelligencePage } from './components/pages/IntelligencePage';
import { CampaignsPage } from './components/pages/CampaignsPage';
import { IdeaLabPage } from './components/pages/IdeaLabPage';
import { CreativeStudioPage } from './components/pages/CreativeStudioPage';
import { CalendarPage } from './components/pages/CalendarPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { PublishingPage } from './components/pages/PublishingPage';
import { CompetitorsPage } from './components/pages/CompetitorsPage';
import { IntegrationsPage } from './components/pages/IntegrationsPage';
import { SettingsPage } from './components/pages/SettingsPage';

const WorkspaceShell: React.FC = () => {
  const {
    activePage,
    toastMessage,
    isScheduleModalOpen,
    closeScheduleModal,
    scheduleModalContentId
  } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'brands':
        return <BrandsPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'ideas':
        return <IdeaLabPage />;
      case 'creative':
        return <CreativeStudioPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'publishing':
        return <PublishingPage />;
      case 'competitors':
        return <CompetitorsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F7F4] dark:bg-[#111318] text-[#17191F] dark:text-[#E9EBF0] font-sans antialiased">
      {/* 1. Desktop Persistent Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* 2. Mobile Drawer Navigation */}
      <MobileDrawer />

      {/* 3. Main Application Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header (hidden on desktop) */}
        <MobileHeader />

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto pb-24 sm:pb-16">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* 4. Floating Gooey Quick Access & AI Assistant */}
      <GooeyQuickAccess />
      <AIAssistantDrawer />

      {/* 5. Global Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={closeScheduleModal}
        defaultContentId={scheduleModalContentId}
      />

      {/* 6. Non-blocking System Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 bg-[#17191F] dark:bg-[#292E38] text-white text-xs font-medium rounded-full shadow-lg border border-neutral-700 max-w-md text-center">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <WorkspaceShell />
    </AppProvider>
  );
}
