import React, { useState } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { useUIStore } from '../../store/uiStore';
import { ApiActionPanel } from './ApiActionPanel';
import { FunctionActionPanel } from './FunctionActionPanel';
import { EventActionPanel } from './EventActionPanel';
import ReactMarkdown from 'react-markdown';
import { CustomNode } from '../../types/nodeTypes';

export function RightPanel() {
  const isRightPanelOpen = useUIStore((state) => state.isPanelOpen);
  const selectedNodeId = useUIStore((state) => state.selectedNode?.id);
  const fullNodes = useGraphStore((state) => state.fullNodes);
  const selectedNode = fullNodes.find(n => n.id === selectedNodeId) as CustomNode | undefined;
  const updateNodeData = useGraphStore((state) => state.updateNodeData);

  const [activeTab, setActiveTab] = useState<'overview' | 'action' | 'docs'>('overview');
  const [docViewMode, setDocViewMode] = useState<'view' | 'edit'>('view');

  if (!isRightPanelOpen) return null;

  const handleDataChange = (key: string, value: any) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { [key]: value });
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'group': return 'bg-slate-100';
      case 'api': return 'bg-blue-50';
      case 'function': return 'bg-purple-50';
      case 'db': return 'bg-emerald-50';
      case 'event': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'group': return 'border-slate-200';
      case 'api': return 'border-blue-200';
      case 'function': return 'border-purple-200';
      case 'db': return 'border-emerald-200';
      case 'event': return 'border-orange-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="w-80 bg-white border-l shadow-xl flex flex-col z-20 h-full overflow-hidden">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between shadow-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Properties</h2>
        {!selectedNode && <span className="text-xs text-slate-400 font-medium">No Selection</span>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedNode ? (
          <div className="flex flex-col h-full">
            {/* Header Area */}
            <div className={`p-5 border-b ${getBackgroundColor(selectedNode.type || '')} ${getBorderColor(selectedNode.type || '')}`}>
              <div className="flex items-center justify-between mb-3 border-b-2 border-white/40 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {selectedNode.type || 'unknown'} Node
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/60 px-2 py-0.5 rounded shadow-sm">
                  {selectedNode.id}
                </span>
              </div>
              <input
                type="text"
                value={selectedNode.data.label as string || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                className="w-full font-bold text-lg text-slate-800 bg-transparent border-none focus:ring-0 p-0 placeholder-slate-400 outline-none"
                placeholder="Node Name"
              />
            </div>

            {/* Tabs */}
            <div className="flex border-b bg-slate-50 text-xs font-semibold text-slate-500">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-700 bg-white' : 'border-transparent hover:bg-slate-100 hover:text-slate-700'}`}
              >
                Overview
              </button>
              {(selectedNode.type === 'api' || selectedNode.type === 'function' || selectedNode.type === 'event') && (
                <button 
                  onClick={() => setActiveTab('action')}
                  className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'action' ? 'border-indigo-500 text-indigo-700 bg-white' : 'border-transparent hover:bg-slate-100 hover:text-slate-700'}`}
                >
                  Action
                </button>
              )}
              <button 
                onClick={() => setActiveTab('docs')}
                className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'docs' ? 'border-indigo-500 text-indigo-700 bg-white' : 'border-transparent hover:bg-slate-100 hover:text-slate-700'}`}
              >
                Docs
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5 flex-1 bg-white">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                    <textarea
                      value={selectedNode.data.description as string || ''}
                      onChange={(e) => handleDataChange('description', e.target.value)}
                      className="w-full px-3 py-2 text-sm text-slate-700 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors min-h-[100px] resize-y"
                      placeholder="Add a brief description..."
                    />
                  </div>

                  {selectedNode.type === 'group' && (
                    <div className="bg-slate-50 border p-4 rounded-md flex items-center justify-between">
                       <span className="font-semibold text-slate-600 text-sm">Color Theme</span>
                       <input
                          type="color"
                          value={selectedNode.data.color as string || '#f8fafc'}
                          onChange={(e) => handleDataChange('color', e.target.value)}
                          className="h-8 w-14 rounded cursor-pointer border-0 p-0"
                        />
                    </div>
                  )}

                  {!!selectedNode.data.group && (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-md flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-500 uppercase">Parent Group</span>
                       <span className="font-mono text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded shadow-sm">{selectedNode.parentId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Tab */}
              {activeTab === 'action' && selectedNode.type === 'api' && (
                <ApiActionPanel node={selectedNode} />
              )}
              {activeTab === 'action' && selectedNode.type === 'function' && (
                <FunctionActionPanel node={selectedNode} />
              )}
              {activeTab === 'action' && selectedNode.type === 'event' && (
                <EventActionPanel node={selectedNode} />
              )}

              {/* Docs Tab */}
              {activeTab === 'docs' && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Documentation</label>
                    <div className="bg-slate-100 p-0.5 rounded flex gap-1">
                      <button 
                        onClick={() => setDocViewMode('view')}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${docViewMode === 'view' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => setDocViewMode('edit')}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${docViewMode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  {docViewMode === 'edit' ? (
                    <textarea
                      value={selectedNode.data.docs?.md || ''}
                      onChange={(e) => handleDataChange('docs', { ...selectedNode.data.docs, md: e.target.value })}
                      className="flex-1 w-full px-3 py-2 text-sm font-mono text-slate-700 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors min-h-[300px] resize-y"
                      placeholder="# Markdown Documentation\n\nAdd technical specs here..."
                    />
                  ) : (
                    <div className="flex-1 border rounded-md p-4 bg-white overflow-y-auto prose prose-sm prose-slate max-w-none">
                      {selectedNode.data.docs?.md ? (
                        <ReactMarkdown>{selectedNode.data.docs.md}</ReactMarkdown>
                      ) : (
                        <p className="text-slate-400 italic">No documentation provided.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
             <svg className="w-12 h-12 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
             <p className="text-sm font-medium">Select a node or group on the canvas to view and edit its properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}
