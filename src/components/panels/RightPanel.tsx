import { CustomNode } from "../../types/nodeTypes";
import { useGraphStore } from '../../store/graphStore';
import { useUIStore } from '../../store/uiStore';
import { useState, useEffect } from 'react';

export function RightPanel() {
  const { isPanelOpen } = useUIStore();
  const selectedNodeId = useUIStore((state) => state.selectedNode?.id);
  const fullNodes = useGraphStore((state) => state.fullNodes);
  const selectedNode = fullNodes.find(n => n.id === selectedNodeId) as CustomNode | undefined;
  const updateNodeData = useGraphStore((state) => state.updateNodeData);

  const [lastNode, setLastNode] = useState<CustomNode | undefined>(selectedNode);

  useEffect(() => {
    if (selectedNode) setLastNode(selectedNode);
  }, [selectedNode]);

  const displayNode = selectedNode || lastNode;
  const showPanel = isPanelOpen && !!selectedNode;

  const handleDataChange = (key: string, value: any) => {
    if (displayNode) {
      updateNodeData(displayNode.id, { [key]: value });
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'group': return 'bg-slate-100';
      case 'api': return 'bg-blue-50';
      case 'function': return 'bg-purple-50';
      case 'sql': return 'bg-emerald-50';
      case 'event': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'group': return 'border-slate-200';
      case 'api': return 'border-blue-200';
      case 'function': return 'border-purple-200';
      case 'sql': return 'border-emerald-200';
      case 'event': return 'border-orange-200';
      default: return 'border-gray-200';
    }
  };

  if (!displayNode) return null;

  return (
    <div 
      className={`bg-white border-l shadow-xl flex flex-col z-20 h-full overflow-hidden transition-[width,min-width,max-width,opacity] duration-300 ease-in-out shrink-0 ${
        showPanel ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-80 h-full flex flex-col shrink-0">
        <div className="p-4 border-b bg-slate-50 flex items-center shadow-sm relative z-10 shrink-0">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Properties</h2>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="flex flex-col h-full w-full">
            <div className={`p-5 border-b ${getBackgroundColor(displayNode.type || '')} ${getBorderColor(displayNode.type || '')}`}>
              <div className="flex items-center justify-between mb-3 border-b-2 border-white/40 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {displayNode.type || 'unknown'} Node
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/60 px-2 py-0.5 rounded shadow-sm">
                  {displayNode.id}
                </span>
              </div>
              <input
                type="text"
                value={displayNode.data.label as string || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                className="w-full font-bold text-lg text-slate-800 bg-transparent border-none focus:ring-0 p-0 placeholder-slate-400 outline-none"
                placeholder="Node Name"
              />
            </div>

            <div className="p-5 flex flex-col gap-6 bg-white w-full">
              <div>
                <label className="block w-full text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <textarea
                  value={displayNode.data.description as string || ''}
                  onChange={(e) => handleDataChange('description', e.target.value)}
                  className="w-full px-3 py-2 text-sm text-slate-700 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors min-h-[100px] resize-y"
                  placeholder="Add a brief description..."
                />
              </div>

              {displayNode.type === 'group' && (
                <div className="bg-slate-50 border p-4 rounded-md flex px-2 items-center justify-between w-full">
                   <span className="font-semibold text-slate-600 text-sm">Theme Color</span>
                   <input
                      type="color"
                      value={displayNode.data.color as string || '#f8fafc'}
                      onChange={(e) => handleDataChange('color', e.target.value)}
                      className="h-8 w-14 rounded cursor-pointer border-0 p-0"
                    />
                </div>
              )}

              {!!displayNode.data.group && (
                <div className="bg-slate-50 w-full border border-slate-200 p-3 rounded-md flex px-2 items-center justify-between">
                   <span className="text-xs font-bold text-slate-500 uppercase">Parent Group</span>
                   <span className="font-mono text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded shadow-sm">{displayNode.parentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
