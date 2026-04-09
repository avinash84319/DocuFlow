import { create } from 'zustand';
import { CustomNode } from '../types/nodeTypes';

interface UIState {
  isPanelOpen: boolean;
  selectedNode: CustomNode | null;
  addNodeModalOpen: boolean;
  addNodeSourceTarget: { source: string | null, target: string | null } | null;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setSelectedNode: (node: CustomNode | null) => void;
  openAddNodeModal: (source: string | null, target: string | null) => void;
  closeAddNodeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPanelOpen: false,
  selectedNode: null,
  addNodeModalOpen: false,
  addNodeSourceTarget: null,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false, selectedNode: null }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setSelectedNode: (node) => set({ selectedNode: node, isPanelOpen: !!node }),
  openAddNodeModal: (source, target) => set({ addNodeModalOpen: true, addNodeSourceTarget: { source, target } }),
  closeAddNodeModal: () => set({ addNodeModalOpen: false, addNodeSourceTarget: null }),
}));
