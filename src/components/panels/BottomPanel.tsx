import { CustomNode } from "../../types/nodeTypes";
import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';
import { ApiActionPanel } from './ApiActionPanel';
import { FunctionActionPanel } from './FunctionActionPanel';
import { EventActionPanel } from './EventActionPanel';
import ReactMarkdown from 'react-markdown';

export function BottomPanel() {
  const { bottomPanelOpen, setBottomPanelOpen, activeBottomTab, setActiveBottomTab } = useUIStore();
  const selectedNodeId = useUIStore((state) => state.selectedNode?.id);
  const fullNodes = useGraphStore((state) => state.fullNodes);
  const selectedNode = fullNodes.find(n => n.id === selectedNodeId) as CustomNode | undefined;
  
  const [lastNode, setLastNode] = useState<CustomNode | undefined>(selectedNode);

  useEffect(() => {
    if (selectedNode) setLastNode(selectedNode);
  }, [selectedNode]);

  const displayNode = selectedNode || lastNode;
  const showPanel = bottomPanelOpen && !!selectedNode;

  const [height, setHeight] = useState(320);
  const [docViewMode, setDocViewMode] = useState<'view' | 'edit'>('view');
  const updateNodeData = useGraphStore((state) => state.updateNodeData);

  if (!displayNode) return null;

  const handleDataChange = (key: string, value: any) => {
    if (displayNode) {
      updateNodeData(displayNode.id, { [key]: value });
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(100, Math.min(startHeight + deltaY, window.innerHeight * 0.8));
      setHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      style={{ height: `${height}px` }}
      className={`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl flex flex-col z-30 transition duration-300 ease-in-out ${
        showPanel ? 'translate-y-0 opacity-100' : 'translate-y-[100%] opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className="h-1.5 w-full cursor-row-resize bg-slate-100 hover:bg-indigo-300 transition-colors flex justify-center items-center"
        onMouseDown={handleDragStart}
      >
        <div className="w-8 h-0.5 bg-slate-300 rounded" />
      </div>

      <div className="flex items-center justify-between px-4 border-b border-slate-200 bg-slate-50 shrink-0 h-10">
        <div className="flex space-x-1 h-full">
          {(['docs', 'run', 'logs', 'io'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveBottomTab(tab)}
              className={`px-4 h-full text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeBottomTab === tab
                  ? 'border-indigo-500 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab === 'io' ? 'Inputs/Outputs' : tab}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setBottomPanelOpen(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white p-4">
        {activeBottomTab === 'docs' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Documentation</span>
              <div className="bg-slate-100 p-0.5 rounded flex gap-1">
                <button 
                  onClick={() => setDocViewMode('view')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${docViewMode === 'view' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >View</button>
                <button 
                  onClick={() => setDocViewMode('edit')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${docViewMode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >Edit</button>
              </div>
            </div>
            
            {docViewMode === 'edit' ? (
              <textarea
                value={displayNode.data.docs?.md || ''}
                onChange={(e) => handleDataChange('docs', { ...displayNode.data.docs, md: e.target.value })}
                className="flex-1 w-full px-3 py-2 text-sm font-mono text-slate-700 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors resize-none"
                placeholder="# Markdown Documentation\n\nAdd technical specs here..."
              />
            ) : (
              <div className="flex-1 border rounded-md p-4 bg-white overflow-y-auto prose prose-sm prose-slate max-w-none">
                {displayNode.data.docs?.md ? (
                  <ReactMarkdown>{displayNode.data.docs.md}</ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic">No documentation provided.</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeBottomTab === 'run' && (
          <div className="h-full">
            {displayNode.type === 'api' && <ApiActionPanel key={displayNode.id} node={displayNode} />}
            {displayNode.type === 'function' && <FunctionActionPanel key={displayNode.id} node={displayNode} />}
            {displayNode.type === 'event' && <EventActionPanel key={displayNode.id} node={displayNode} />}
            {displayNode.type === 'sql' && (
              <div className="flex flex-col h-full gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SQL Query</label>
                    <textarea 
                      value={displayNode.data.query as string || ''}
                      onChange={(e) => handleDataChange('query', e.target.value)}
                      className="w-full font-mono text-sm border rounded p-2 focus:ring-1 outline-none h-32"
                      placeholder="SELECT * FROM table"
                    />
                 </div>
                 <button className="self-start px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700">Run Query</button>
              </div>
            )}
            {!['api', 'function', 'event', 'sql'].includes(displayNode.type || '') && (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                No execution options available for {displayNode.type} nodes.
              </div>
            )}
          </div>
        )}

        {activeBottomTab === 'logs' && (
          <div className="flex h-full flex-col font-mono text-sm bg-slate-900 text-green-400 p-4 rounded-md overflow-y-auto">
            <div className="mb-2">[{new Date().toISOString()}] Ready to execute.</div>
            <div className="text-slate-500">No logs available yet. Run the node to see execution logs.</div>
          </div>
        )}

        {activeBottomTab === 'io' && (
          <div className="flex h-full gap-6">
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Input Schema (JSON)</label>
              <textarea 
                readOnly
                value={JSON.stringify(displayNode.data.schema || { type: "object" }, null, 2)}
                className="flex-1 w-full bg-slate-50 border rounded p-3 font-mono text-sm text-slate-700 resize-none outline-none"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Example Output (JSON)</label>
              <textarea 
                readOnly
                value="{}"
                className="flex-1 w-full bg-slate-50 border rounded p-3 font-mono text-sm text-slate-700 resize-none outline-none" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
