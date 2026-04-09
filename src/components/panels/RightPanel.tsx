import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { ApiNodePanel } from '../nodes/ApiNode/ApiNodePanel';
import { OperatorNodePanel } from '../nodes/OperatorNode/OperatorNodePanel';

export function RightPanel() {
  const { isPanelOpen, closePanel, selectedNode } = useUIStore();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white border-l shadow-xl transition-transform duration-300 ease-in-out z-20 flex flex-col ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {selectedNode ? selectedNode.data.label : 'Properties'}
        </h2>
        <button
          onClick={closePanel}
          className="p-2 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
        >
          ✕
        </button>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        {!selectedNode ? (
          <p className="text-sm text-slate-600">Select a node or edge to edit its properties here.</p>
        ) : (
          <div className="flex flex-col gap-4 text-sm text-slate-700">
            <div className="uppercase tracking-wider text-xs font-bold text-slate-400">
              Type: {selectedNode.type}
            </div>

            {selectedNode.type === 'api' && (
              <ApiNodePanel node={selectedNode} />
            )}

            {selectedNode.type === 'operator' && (
              <OperatorNodePanel node={selectedNode} />
            )}

            {selectedNode.type === 'group' && (
              <div className="bg-slate-50 border p-3 rounded-md flex flex-col gap-2">
                <div><strong>Description:</strong> {selectedNode.data.description || 'A group of tasks.'}</div>
                <div><strong>Children:</strong> {Array.isArray(selectedNode.data.children) ? selectedNode.data.children.length : 0} items</div>
              </div>
            )}

            {selectedNode.type === 'doc' && (
              <div className="bg-slate-50 border p-3 rounded-md prose prose-sm text-slate-800">
                {selectedNode.data.markdown || '### Documentation\n\nNo description provided.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
