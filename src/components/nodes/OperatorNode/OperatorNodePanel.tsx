import React, { useState } from 'react';
import { CustomNode } from '../../../types/nodeTypes';

interface OperatorNodePanelProps {
  node: CustomNode;
}

export function OperatorNodePanel({ node }: OperatorNodePanelProps) {
  // If schema doesn't exist, provide a basic fallback mock schema for the form
  const inputSchema = node.data.inputSchema || [
    { key: "transformType", type: "string", label: "Transform Type", default: "uppercase" },
    { key: "filterEmpty", type: "boolean", label: "Filter Empty Values", default: true },
    { key: "retryCount", type: "number", label: "Retry Count", default: 3 }
  ];

  const defaultValues = inputSchema.reduce((acc: any, field: any) => {
    acc[field.key] = field.default;
    return acc;
  }, {});

  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-5 bg-slate-50 border p-4 rounded-md">
      
      {/* Description Block */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
        <div className="prose prose-sm text-slate-700 bg-white p-3 rounded border">
          {node.data.description || "Transforms incoming structured data into a specific payload configuration before passing it along."}
        </div>
      </div>

      {/* Auto-Generated Form Inputs based on Schema */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-500 uppercase border-b pb-1">Input Configuration</label>
        
        {inputSchema.map((field: any) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">{field.label}</label>
            
            {field.type === 'string' && (
              <input 
                type="text" 
                value={formValues[field.key] || ''} 
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}

            {field.type === 'number' && (
              <input 
                type="number" 
                value={formValues[field.key] || 0} 
                onChange={(e) => handleInputChange(field.key, Number(e.target.value))}
                className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}

            {field.type === 'boolean' && (
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!formValues[field.key]} 
                  onChange={(e) => handleInputChange(field.key, e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                />
                Enabled
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <label className="text-xs font-semibold text-slate-500 uppercase border-b pb-1">Outputs</label>
        <div className="bg-slate-900 border text-slate-300 p-3 rounded-md font-mono text-xs">
          {node.data.outputs || "{ transformedPayload: object }"}
        </div>
      </div>

    </div>
  );
}
