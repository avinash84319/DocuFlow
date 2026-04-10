import { create } from 'zustand';
import { CustomNode } from '../types/nodeTypes';

export type BottomPanelTab = 'docs' | 'run' | 'logs' | 'io';

interface UIState {
  isPanelOpen: boolean;
  selectedNode: CustomNode | null;
  addNodeModalOpen: boolean;
  addNodeSourceTarget: { source: string | null, target: string | null } | null;
  bottomPanelOpen: boolean;
  activeBottomTab: BottomPanelTab;
  selectedGroupId: string | null;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setSelectedNode: (node: CustomNode | null) => void;
  openAddNodeModal: (source: string | null, target: string | null) => void;
  closeAddNodeModal: () => void;
  setBottomPanelOpen: (isOpen: boolean) => void;
  setActiveBottomTab: (tab: BottomPanelTab) => void;
  setSelectedGroupId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPanelOpen: false,
  selectedNode: null,
  addNodeModalOpen: false,
  addNodeSourceTarget: null,
  bottomPanelOpen: false,
  activeBottomTab: 'docs',
  selectedGroupId: null,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false, selectedNode: null, bottomPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setSelectedNode: (node) => {
    set({ 
      selectedNode: node, 
      isPanelOpen: !!node, 
      bottomPanelOpen: !!node,
      selectedGroupId: null
    });
  },
  openAddNodeModal: (source, target) => set({ addNodeModalOpen: true, addNodeSourceTarget: { source, target } }),
  closeAddNodeModal: () => set({ addNodeModalOpen: false, addNodeSourceTarget: null }),
  setBottomPanelOpen: (isOpen) => set({ bottomPanelOpen: isOpen }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),
  setSelectedGroupId: (id) => set({ selectedGroupId: id, selectedNode: null, isPanelOpen: false, bottomPanelOpen: false }),
}));
