import React from 'react';
import { useUIStore } from '../../store/uiStore';

interface NodeAddNodeButtonProps {
  nodeId: string;
}

export function NodeAddNodeButton({ nodeId }: NodeAddNodeButtonProps) {
  const { openAddNodeModal } = useUIStore();

  return (
    <button
      className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:shadow transition-all text-xs font-bold nodrag z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        // Since we are adding a child to this node, this node is the SOURCE.
        openAddNodeModal(nodeId, null);
      }}
    >
      +
    </button>
  );
}
