import React, { useState } from 'react';
import { CustomNode } from '../../../types/nodeTypes';
import { mockRunApi } from '../../../lib/api';

interface ApiNodePanelProps {
  node: CustomNode;
}

export function ApiNodePanel({ node }: ApiNodePanelProps) {
  const [endpoint, setEndpoint] = useState(node.data.endpoint || '/api/v1/resource');
  const [method, setMethod] = useState(node.data.method || 'POST');
  const [body, setBody] = useState(node.data.body || '{\n  "key": "value"\n}');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await mockRunApi(endpoint, method, body);
      setResponse(JSON.stringify(res, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: "Something went wrong" }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-50 border p-4 rounded-md">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Endpoint</label>
        <input 
          type="text" 
          value={endpoint} 
          onChange={(e) => setEndpoint(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Method</label>
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Request Body (JSON)</label>
        <textarea 
          value={body} 
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="px-3 py-2 border rounded-md text-sm font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
        />
      </div>
      
      <button 
        onClick={handleRun}
        disabled={isLoading}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Running...' : 'Run'}
      </button>

      {response && (
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Response</label>
          <pre className="bg-slate-900 text-slate-50 p-3 rounded-md text-xs overflow-auto max-h-[250px]">
            <code>{response}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
