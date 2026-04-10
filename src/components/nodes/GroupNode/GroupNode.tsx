import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from '../../../types/nodeTypes';
import { useGraphStore } from '../../../store/graphStore';

export function GroupNode({ id, data, selected }: CustomNodeProps) {
  const { toggleGroup, collapsedGroups } = useGraphStore();
  
  // Safely grab children from data if they exist
  // const children = Array.isArray(data.children) ? data.children : []; // removed unused
  
  // Natively sync React Flow Group State through Zustand tracker
  const isCollapsed = collapsedGroups.has(id);

  if (!isCollapsed) {
    // Render Expanded State (Large background box bounding children)
    return (
      <div 
        className={`w-full h-full border-2 border-dashed rounded-lg bg-blue-50/50 flex flex-col items-center pt-2 cursor-pointer transition-all ${selected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-blue-300 hover:bg-blue-50/80 hover:border-blue-400'}`}
        onClick={() => toggleGroup(id)}
      />
    );
  }

  // Render Collapsed State
  return (
    <div 
      className={`w-full h-full min-w-[220px] bg-blue-100 border border-blue-300 rounded-md shadow-sm flex items-center justify-center cursor-pointer transition-all relative group hover:bg-blue-200 ${selected ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
      onClick={() => toggleGroup(id)}
    >
      <Handle type="target" position={Position.Left} className="opacity-0 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className="font-semibold text-base tracking-wide text-blue-900">
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
    </div>
  );
}
