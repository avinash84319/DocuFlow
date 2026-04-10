import { useState } from "react";
import { CustomNode } from '../../types/nodeTypes';

export function ApiActionPanel({ node }: { node: CustomNode }) {
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('{\n  "example": "data"\n}');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ status: number; data: any } | null>(null);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const updateHeader = (index: number, field: 'key' | 'value', val: string) => {
    const newH = [...headers];
    newH[index][field] = val;
    setHeaders(newH);
  };
  const removeHeader = (index: number) => {
    const newH = [...headers];
    newH.splice(index, 1);
    setHeaders(newH);
  };

  const addParam = () => setQueryParams([...queryParams, { key: '', value: '' }]);
  const updateParam = (index: number, field: 'key' | 'value', val: string) => {
    const newP = [...queryParams];
    newP[index][field] = val;
    setQueryParams(newP);
  };
  const removeParam = (index: number) => {
    const newP = [...queryParams];
    newP.splice(index, 1);
    setQueryParams(newP);
  };

  const handleRun = async () => {
    setLoading(true);
    setResponse(null);
    
    // mock executeApi
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setResponse({
      status: 200,
      data: {
        message: "Mock API execution successful",
        timestamp: new Date().toISOString(),
        requestParams: queryParams.filter(p => p.key).reduce((acc, p) => ({...acc, [p.key]: p.value}), {})
      }
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Endpoint Info */}
      <div className="bg-slate-50 border p-3 rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-xs">
            {(node.data.method as string) || 'GET'}
          </span>
          <span className="font-mono text-slate-700 break-all text-xs">
            {(node.data.endpoint as string) || 'https://api.example.com/v1/resource'}
          </span>
        </div>
      </div>

      {/* Headers */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Headers</label>
          <button onClick={addHeader} className="text-xs text-blue-600 hover:text-blue-800">+ Add</button>
        </div>
        <div className="flex flex-col gap-1">
          {headers.map((h, i) => (
            <div key={`header-${i}`} className="flex gap-1 items-center">
              <input type="text" placeholder="Key" value={h.key} onChange={e => updateHeader(i, 'key', e.target.value)} className="w-1/2 px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Value" value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)} className="w-1/2 px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              <button onClick={() => removeHeader(i)} className="text-slate-400 hover:text-red-500 px-1">✕</button>
            </div>
          ))}
          {headers.length === 0 && <span className="text-xs text-slate-400 italic">No headers</span>}
        </div>
      </div>

      {/* Query Params */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Query Params</label>
          <button onClick={addParam} className="text-xs text-blue-600 hover:text-blue-800">+ Add</button>
        </div>
        <div className="flex flex-col gap-1">
          {queryParams.map((p, i) => (
            <div key={`param-${i}`} className="flex gap-1 items-center">
              <input type="text" placeholder="Key" value={p.key} onChange={e => updateParam(i, 'key', e.target.value)} className="w-1/2 px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Value" value={p.value} onChange={e => updateParam(i, 'value', e.target.value)} className="w-1/2 px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              <button onClick={() => removeParam(i)} className="text-slate-400 hover:text-red-500 px-1">✕</button>
            </div>
          ))}
          {queryParams.length === 0 && <span className="text-xs text-slate-400 italic">No query params</span>}
        </div>
      </div>

      {/* JSON Body */}
      <div>
         <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">JSON Body</label>
         <textarea 
           className="w-full h-24 p-2 border rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
           value={body}
           onChange={e => setBody(e.target.value)}
           placeholder="{\n}"
         />
      </div>

      {/* Run Action */}
      <button 
        onClick={handleRun}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-sm shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Executing...
          </>
        ) : 'Run Request'}
      </button>

      {/* Response Area */}
      {response && (
        <div className="mt-2 border-t pt-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="font-bold text-slate-800 text-sm">Response</h3>
             <span className={`text-xs px-2 py-0.5 rounded font-bold ${response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {response.status}
             </span>
           </div>
           <pre className="p-3 bg-slate-800 text-slate-50 rounded-md font-mono text-[10px] overflow-x-auto max-h-[200px]">
             {JSON.stringify(response.data, null, 2)}
           </pre>
        </div>
      )}
    </div>
  );
}
