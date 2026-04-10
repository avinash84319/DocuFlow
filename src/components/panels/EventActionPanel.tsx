import { useState } from "react";
import { CustomNode } from '../../types/nodeTypes';

export function EventActionPanel({ node }: { node: CustomNode }) {
  const triggerType = node.data.triggerType as string || 'manual';
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    
    // mock trigger event
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setOutput({
      status: "dispatched",
      eventId: `evt_${Math.random().toString(36).substr(2, 9)}`,
      type: triggerType,
      timestamp: new Date().toISOString()
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Trigger Info */}
      <div className="bg-slate-50 border p-3 rounded-md flex justify-between items-center break-all">
        <span className="font-bold text-slate-500 uppercase text-[10px]">Trigger Source</span>
        <span className="font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded text-xs capitalize whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
          {triggerType}
        </span>
      </div>

      {/* Run Action */}
      <button 
        onClick={handleRun}
        disabled={loading}
        className="w-full py-2 bg-orange-500 text-white rounded-md font-semibold text-sm shadow-sm hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? 'Triggering...' : 'Trigger Event'}
      </button>

      {/* Output Area */}
      {output && (
        <div className="mt-2 border-t pt-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="font-bold text-slate-800 text-sm">Event Log</h3>
             <span className="text-xs px-2 py-0.5 rounded font-bold bg-green-100 text-green-700">Success</span>
           </div>
           <pre className="p-3 bg-slate-800 text-slate-50 rounded-md font-mono text-[10px] overflow-x-auto max-h-[200px]">
             {JSON.stringify(output, null, 2)}
           </pre>
        </div>
      )}
    </div>
  );
}
