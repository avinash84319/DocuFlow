import { useState } from "react";
import { CustomNode } from '../../types/nodeTypes';

export function FunctionActionPanel({ node }: { node: CustomNode }) {
  const schema = node.data.schema as Record<string, string> || { input: 'string' };
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    
    // mock executeFunction
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setOutput({
      status: "success",
      executedRef: node.data.codeRef as string || 'inline_code',
      result: {
        processedInput: formValues,
        timestamp: new Date().toISOString()
      }
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Code Ref Info */}
      {node.data.codeRef && (
        <div className="bg-slate-50 border p-3 rounded-md flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Code Ref</span>
          <span className="font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-xs break-all">
            {node.data.codeRef as string}
          </span>
        </div>
      )}

      {/* Dynamic Inputs */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Input Arguments</label>
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(schema).map(([key, type], idx) => (
            <div key={`input-${idx}`} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600 flex justify-between">
                <span>{key}</span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{type}</span>
              </label>
              <input 
                type="text" 
                value={formValues[key] || ''} 
                onChange={e => setFormValues({...formValues, [key]: e.target.value})} 
                className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-purple-500 outline-none" 
                placeholder={`Enter ${key}...`} 
              />
            </div>
          ))}
          {Object.keys(schema).length === 0 && <span className="text-xs text-slate-400 italic">No schema defined</span>}
        </div>
      </div>

      {/* Run Action */}
      <button 
        onClick={handleRun}
        disabled={loading}
        className="w-full py-2 bg-purple-600 text-white rounded-md font-semibold text-sm shadow-sm hover:bg-purple-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? 'Executing...' : 'Run Function'}
      </button>

      {/* Output Area */}
      {output && (
        <div className="mt-2 border-t pt-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="font-bold text-slate-800 text-sm">Output</h3>
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
