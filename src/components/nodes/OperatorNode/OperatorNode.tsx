import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from '../../../types/nodeTypes';
import { NodeAddNodeButton } from '../NodeAddNodeButton';

export function OperatorNode({ id, data, selected }: CustomNodeProps) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[150px] text-center relative group ${selected ? 'border-emerald-700' : 'border-emerald-400'}`}>
      <Handle type="target" position={Position.Left} className="opacity-0 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      
      <div className="font-bold text-xs uppercase tracking-wider text-emerald-600 mb-1">Operator</div>
      <div className="text-sm font-medium text-slate-700">{data.label}</div>
      
      <Handle type="source" position={Position.Right} className="opacity-0 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      <NodeAddNodeButton nodeId={id} />
    </div>
  );
}
