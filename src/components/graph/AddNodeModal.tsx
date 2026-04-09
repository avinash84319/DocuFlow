import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';

export function AddNodeModal() {
  const { addNodeModalOpen, closeAddNodeModal, addNodeSourceTarget } = useUIStore();
  const { addEdgeNode, fullNodes } = useGraphStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [nodeType, setNodeType] = useState<'api' | 'function' | 'sql' | 'service' | 'event' | 'external' | 'group'>('api');
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepInGroup, setKeepInGroup] = useState<boolean>(true);
  const [wrapInGroup, setWrapInGroup] = useState<boolean>(false);

  // Reset state when modal opens
  useEffect(() => {
    if (addNodeModalOpen) {
      setKeepInGroup(true);
      setWrapInGroup(false);
    }
  }, [addNodeModalOpen]);

  if (!addNodeModalOpen || !addNodeSourceTarget) return null;

  // Determine group relationships
  const getParentGroup = (nodeId: string) => {
    return fullNodes.find(n => n.type === 'group' && (n.data?.children as string[])?.includes(nodeId));
  };

  const sourceGroup = addNodeSourceTarget.source ? getParentGroup(addNodeSourceTarget.source!) : null;
  const targetGroup = addNodeSourceTarget.target ? getParentGroup(addNodeSourceTarget.target!) : null;

  const isBetweenNodes = !!addNodeSourceTarget.source && !!addNodeSourceTarget.target;
  const isAddChild = !!addNodeSourceTarget.source && !addNodeSourceTarget.target;

  let finalGroupId: string | null = null;
  if (isBetweenNodes) {
    if (sourceGroup && targetGroup && sourceGroup.id === targetGroup.id) {
      finalGroupId = sourceGroup.id;
    }
  } else if (isAddChild) {
    if (sourceGroup) {
      // If we keep in the direct parent group
      if (keepInGroup) {
        finalGroupId = sourceGroup.id;
      } else {
        // If we don't keep in the direct parent group, we still need to be in the grandparent group (if any)!
        const grandparentGroup = getParentGroup(sourceGroup.id);
        finalGroupId = grandparentGroup ? grandparentGroup.id : null;
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addEdgeNode(addNodeSourceTarget.source, addNodeSourceTarget.target, nodeType, formData, finalGroupId, wrapInGroup);
    
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setNodeType('api');
    setFormData({});
    closeAddNodeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-[450px] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {step === 1 ? 'Select Node Type' : `Configure ${nodeType.toUpperCase()} Node`}
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {['api', 'function', 'sql', 'service', 'event', 'external', 'group'].map((type) => (
                <button
                  key={type}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${nodeType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'}`}
                  onClick={() => setNodeType(type as any)}
                >
                  <div className="font-semibold capitalize">{type}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <form id="add-node-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder={`E.g., New ${nodeType}`}
                />
              </div>

              {nodeType !== 'group' && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-md">
                  <input
                    type="checkbox"
                    id="wrapInGroup"
                    checked={wrapInGroup}
                    onChange={(e) => setWrapInGroup(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <label htmlFor="wrapInGroup" className="text-sm font-medium text-emerald-900">
                    Make this a grouped node (Creates a new Group wrapper)
                  </label>
                </div>
              )}

              {isAddChild && sourceGroup && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <input
                    type="checkbox"
                    id="keepInGroup"
                    checked={keepInGroup}
                    onChange={(e) => setKeepInGroup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="keepInGroup" className="text-sm font-medium text-blue-900">
                    Keep new node inside group: <span className="font-bold">{sourceGroup.data.label as string}</span>
                  </label>
                </div>
              )}

              {nodeType === 'api' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Endpoint (URL)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.endpoint || ''}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    placeholder="/api/v1/resource"
                  />
                </div>
              )}

              {nodeType === 'function' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.language || 'typescript'}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              )}

              {nodeType === 'sql' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Query</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.query || ''}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    placeholder="SELECT * FROM table"
                  />
                </div>
              )}

              {nodeType === 'service' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.serviceName || ''}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="e.g., User Service"
                  />
                </div>
              )}

              {nodeType === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.topic || ''}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., user.created"
                  />
                </div>
              )}

              {nodeType === 'external' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">System Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.systemName || ''}
                    onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                    placeholder="e.g., Salesforce, Stripe"
                  />
                </div>
              )}
            </form>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {step === 1 ? (
            <>
              <button
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-50"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                form="add-node-form"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Insert Node'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
