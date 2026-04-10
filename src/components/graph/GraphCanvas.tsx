import { useCallback, MouseEvent, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls,
  addEdge,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './NodeRenderer';
import { edgeTypes } from './EdgeRenderer';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';
import { CustomNode } from '../../types/nodeTypes';

const defaultEdgeOptions = {
  type: 'airflow',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: '#cbd5e1',
  },
};

export function GraphCanvas() {
  const { setSelectedNode } = useUIStore();
  const { getVisibleGraph, collapsedGroups, fullNodes, fullEdges } = useGraphStore();
  
  // Calculate visual graph boundaries natively
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);

  // Recalculate deterministic dagre boundaries anytime a group is structurally toggled or full items change
  useEffect(() => {
    const { nodes: computedNodes, edges: computedEdges } = getVisibleGraph();
    setNodes(computedNodes);
    setEdges(computedEdges);
  }, [collapsedGroups, fullNodes, fullEdges, getVisibleGraph, setNodes, setEdges]);


  // Hook up edges connection handling natively
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((_event: MouseEvent, node: ReactFlowNode) => {
    setSelectedNode(node as CustomNode);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="relative flex-1 w-full h-full bg-slate-50">
      
      {/* Initialize React Flow */}
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        panOnScroll={false} 
        panOnDrag={true} 
        zoomOnScroll={true}
        elementsSelectable={true}
        nodesDraggable={false} 
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
