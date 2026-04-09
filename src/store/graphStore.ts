import { create } from 'zustand';
import { Edge, Node } from '@xyflow/react';
import graphData from '../mock/graphData.json';
import { getLayoutedElements } from '../lib/graphUtils';

interface GraphState {
  fullNodes: Node[];
  fullEdges: Edge[];
  collapsedGroups: Set<string>;
  toggleGroup: (groupId: string) => void;
  getVisibleGraph: () => { nodes: Node[], edges: Edge[] };
  addEdgeNode: (sourceId: string | null, targetId: string | null, nodeType: string, data: any, groupId?: string | null) => Promise<void>;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  fullNodes: graphData.nodes as Node[],
  fullEdges: graphData.edges as Edge[],
  collapsedGroups: new Set(['group1']), // Start collapsed for demo

  toggleGroup: (groupId: string) => set((state) => {
    const newCollapsed = new Set(state.collapsedGroups);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    return { collapsedGroups: newCollapsed };
  }),

  // Returns the computed sub-graph for React Flow natively dynamically reconnecting dagre edges
  getVisibleGraph: () => {
    const { fullNodes, fullEdges, collapsedGroups } = get();

    // Map each child node to its parent group ID
    const childToGroup: Record<string, string> = {};
    const groupNodes = fullNodes.filter(n => n.type === 'group');

    groupNodes.forEach(group => {
      const children = (group.data.children as string[]) || [];
      children.forEach(childId => {
        childToGroup[childId] = group.id;
      });
    });

    const visibleNodes: Node[] = fullNodes.filter(node => {
        // If a node is a child, it is ONLY visible if its parent group is NOT collapsed
        const groupId = childToGroup[node.id];
        if (groupId && collapsedGroups.has(groupId)) {
            return false; 
        }

        // We ALWAY render the node.type === 'group'. Its bounding box rendering will react to collapsedGroup states internally.
        return true;
    });

    const visibleEdges: Edge[] = [];
    const edgeSet = new Set<string>(); // prevent dupes logically

    fullEdges.forEach(edge => {
        // Find effective source/target based on collapse state
        let effectiveSource = edge.source;
        const sourceGroup = childToGroup[edge.source];
        if (sourceGroup && collapsedGroups.has(sourceGroup)) {
            effectiveSource = sourceGroup;
        }

        let effectiveTarget = edge.target;
        const targetGroup = childToGroup[edge.target];
        if (targetGroup && collapsedGroups.has(targetGroup)) {
            effectiveTarget = targetGroup;
        }

        // Internal edge hidden within collapsed group
        if (effectiveSource === effectiveTarget) {
            return;
        }

        const edgeId = `e-${effectiveSource}-${effectiveTarget}`;
        if (!edgeSet.has(edgeId)) {
            edgeSet.add(edgeId);
            visibleEdges.push({
                ...edge,
                id: edgeId,
                source: effectiveSource,
                target: effectiveTarget,
                data: {
                    ...edge.data,
                    originalSource: edge.source,
                    originalTarget: edge.target
                }
            });
        }
    });

    // Run determinist dagre layout upon our flattened logically visible node graph
  // Feeding the mapping configurations accurately
    return getLayoutedElements(visibleNodes, visibleEdges, 'LR', collapsedGroups, childToGroup);
  },

  addEdgeNode: async (sourceId: string | null, targetId: string | null, nodeType: string, data: any, groupId?: string | null) => {
    // Generate IDs early for payload processing
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: nodeType,
      position: { x: 0, y: 0 },
      data: { ...data, label: data.label || `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}` }
    };
    
    const addedEdges: Edge[] = [];
    if (sourceId) {
      addedEdges.push({ id: `e-${sourceId}-${newNodeId}`, source: sourceId, target: newNodeId, type: 'airflow' });
    }
    if (targetId) {
      addedEdges.push({ id: `e-${newNodeId}-${targetId}`, source: newNodeId, target: targetId, type: 'airflow' });
    }

    // --- Backend Integration Stub ---
    // Simulate sending an API request to a backend endpoint and waiting for it to be structurally saved.
    // Replace this block with your actual `axios.post` or `fetch` logic.
    try {
      console.log('Sending structured payload to backend...', { newNode, edges: addedEdges });
      
      // Simulating a 500ms network delay for processing...
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Payload successfully saved to backend!');
    } catch (error) {
      console.error('Failed to sync graph state to the backend database:', error);
      return; // Do not apply local state updates if backend fails
    }
    // --------------------------------

    // If backend succeeds, process state locally to recalculate UI instantly without waiting on a full refetch
    set((state) => {
      let newEdges = [...state.fullEdges];
      // If inserting between two nodes, remove the old edge
      if (sourceId && targetId) {
        newEdges = newEdges.filter(e => !(e.source === sourceId && e.target === targetId));
      }
      
      newEdges.push(...addedEdges);
      
      let newNodes = [...state.fullNodes];
      if (groupId) {
        newNodes = newNodes.map(n => {
          if (n.id === groupId) {
            return {
              ...n,
              data: {
                ...n.data,
                children: [...(n.data.children || []), newNodeId]
              }
            };
          }
          return n;
        });
      }
      
      return {
        fullNodes: [...newNodes, newNode as Node],
        fullEdges: newEdges
      };
    });
  }
}));
