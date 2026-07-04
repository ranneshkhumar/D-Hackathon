'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrgManager } from '@/services/org-manager';
import { Organization } from '@/types';
import Sidebar from '@/components/Sidebar';
import EmptyState from '@/components/EmptyState';
import CreateOrgModal from '@/components/CreateOrgModal';
import { Loader2 } from 'lucide-react';
import { AegisProvider } from '@/context/AegisContext';
import DashboardView from '@/components/DashboardView';
import DiscoveryView from '@/components/DiscoveryView';
import BoardroomView from '@/components/BoardroomView';
import ArchitectureView from '@/components/ArchitectureView';
import ChatWorkspace from '@/components/ChatWorkspace';

function WorkspaceContent() {
  const router = useRouter();
  
  // State management for multi-organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Sync state from localStorage on client-side mount
  const refreshState = () => {
    const orgs = OrgManager.getOrganizations();
    const active = OrgManager.getActiveOrganization();
    setOrganizations(orgs);
    setActiveOrg(active);
  };

  useEffect(() => {
    refreshState();
    setIsMounted(true);
  }, []);

  // Switch organizations inside the workspace
  const handleSelectOrg = (id: string) => {
    OrgManager.setActiveOrganization(id);
    refreshState();
  };

  // Triggers the simulated workspace initialization
  const handleCreateOrg = (name: string) => {
    setIsModalOpen(false);
    // Route to initializing sequence with name parameter
    router.push(`/initializing?name=${encodeURIComponent(name)}`);
  };

  // Reset the demo workspace helper (clears localStorage so user can re-test empty state)
  const handleResetWorkspace = () => {
    OrgManager.clearAll();
    refreshState();
  };

  // Simple loader to prevent hydration flickering on first paint
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  // Render Empty State if no organizations exist yet
  if (!activeOrg) {
    return (
      <>
        <EmptyState onCreateClick={() => setIsModalOpen(true)} />
        <CreateOrgModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrg}
        />
      </>
    );
  }

  // Choose which operational view to render
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'discovery':
        return <DiscoveryView onSuccessRedirect={() => setActiveView('dashboard')} />;
      case 'boardroom':
        return <BoardroomView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'chat':
        return <ChatWorkspace activeOrg={activeOrg} />;
      default:
        return <DashboardView />;
    }
  };

  // Render Dashboard Workspace once active organization is created/selected
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50">
      <Sidebar
        organizations={organizations}
        activeOrg={activeOrg}
        onSelectOrg={handleSelectOrg}
        onCreateOrgClick={() => setIsModalOpen(true)}
        onResetWorkspace={handleResetWorkspace}
        activeView={activeView}
        onSelectView={setActiveView}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 overflow-hidden">
        {renderActiveView()}
      </div>
      <CreateOrgModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrg}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <AegisProvider>
      <WorkspaceContent />
    </AegisProvider>
  );
}
