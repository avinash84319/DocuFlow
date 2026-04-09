import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from '../../types/nodeTypes';
import { NodeAddNodeButton } from './NodeAddNodeButton';

interface ActionNodeConfig {
  typeLabel: string;
  borderColor: string;
  textColor: string;
  selectedColor: string;
}

function createActionNode(config: ActionNodeConfig) {
  return function ActionNode({ id, data, selected }: CustomNodeProps) {
    return (
      <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[150px] text-center relative group ${selected ? config.selectedColor : config.borderColor}`}>
        <Handle type="target" position={Position.Left} className="opacity-0 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        
        <div className={`font-bold text-xs uppercase tracking-wider mb-1 ${config.textColor}`}>
          {config.typeLabel}
        </div>
        <div className="text-sm font-medium text-slate-700">{data.label}</div>
        
        <Handle type="source" position={Position.Right} className="opacity-0 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        <NodeAddNodeButton nodeId={id} />
      </div>
    );
  };
}

export const ApiNode = createActionNode({ typeLabel: 'API', borderColor: 'border-blue-400', textColor: 'text-blue-600', selectedColor: 'border-blue-700 ring-2 ring-blue-200' });
export const FunctionNode = createActionNode({ typeLabel: 'Function', borderColor: 'border-purple-400', textColor: 'text-purple-600', selectedColor: 'border-purple-700 ring-2 ring-purple-200' });
export const SqlNode = createActionNode({ typeLabel: 'SQL', borderColor: 'border-orange-400', textColor: 'text-orange-600', selectedColor: 'border-orange-700 ring-2 ring-orange-200' });
export const ServiceNode = createActionNode({ typeLabel: 'Service', borderColor: 'border-teal-400', textColor: 'text-teal-600', selectedColor: 'border-teal-700 ring-2 ring-teal-200' });
export const EventNode = createActionNode({ typeLabel: 'Event', borderColor: 'border-pink-400', textColor: 'text-pink-600', selectedColor: 'border-pink-700 ring-2 ring-pink-200' });
export const ExternalNode = createActionNode({ typeLabel: 'External', borderColor: 'border-slate-400', textColor: 'text-slate-600', selectedColor: 'border-slate-700 ring-2 ring-slate-200' });
