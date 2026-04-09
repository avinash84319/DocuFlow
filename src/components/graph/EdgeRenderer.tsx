import React, { useState } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import { useUIStore } from '../../store/uiStore';

export function AirflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { openAddNodeModal } = useUIStore();
  const [isHovered, setIsHovered] = useState(false);

  const originalSource = (data?.originalSource as string) || source;
  const originalTarget = (data?.originalTarget as string) || target;

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: isHovered ? 4 : 2,
          stroke: isHovered ? '#94a3b8' : '#cbd5e1', // subtle gray tone to match the sleek airflow style
        }} 
      />
      {/* Invisible thicker path to make hovering easier */}
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:shadow transition-all text-xs font-bold"
              onClick={(e) => {
                e.stopPropagation();
                openAddNodeModal(originalSource, originalTarget);
              }}
            >
              +
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const edgeTypes = {
  airflow: AirflowEdge,
};
