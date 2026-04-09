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
  addEdgeNode: (sourceId: string | null, targetId: string | null, nodeType: string, data: any, groupId?: string | null, wrapInGroup?: boolean) => Promise<void>;
  editNodeDocs: (nodeId: string, docsContent: string) => void;
  updateNodeData: (nodeId: string, data: any) => void;
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

  updateNodeData: (nodeId: string, data: any) => set((state) => {
    return {
      fullNodes: state.fullNodes.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              ...data
            }
          };
        }
        return n;
      })
    };
  }),

  editNodeDocs: (nodeId: string, docsContent: string) => set((state) => {
    return {
      fullNodes: state.fullNodes.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              docs: docsContent
            }
          };
        }
        return n;
      })
    };
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

    const getHighestCollapsedAncestor = (nodeId: string): string | null => {
      let currentId = nodeId;
      let highestCollapsed: string | null = null;
      while (childToGroup[currentId]) {
        currentId = childToGroup[currentId];
        if (collapsedGroups.has(currentId)) {
          highestCollapsed = currentId;
        }
      }
      return highestCollapsed;
    };

    const visibleNodes: Node[] = fullNodes.filter(node => {
        // If ANY ancestor is collapsed, hide this node.
        if (getHighestCollapsedAncestor(node.id)) {
            return false;
        }
        return true;
    });

    const visibleEdges: Edge[] = [];
    const edgeSet = new Set<string>(); // prevent dupes logically

    fullEdges.forEach(edge => {
        // Find effective source/target based on collapse state
        let effectiveSource = edge.source;
        const highestCollapsedSource = getHighestCollapsedAncestor(edge.source);
        if (highestCollapsedSource) {
            effectiveSource = highestCollapsedSource;
        }

        let effectiveTarget = edge.target;
        const highestCollapsedTarget = getHighestCollapsedAncestor(edge.target);
        if (highestCollapsedTarget) {
            effectiveTarget = highestCollapsedTarget;
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

  addEdgeNode: async (sourceId: string | null, targetId: string | null, nodeType: string, data: any, groupId?: string | null, wrapInGroup?: boolean) => {
    // Generate IDs early for payload processing
    const newNodeId = `node-${Date.now()}`;
    const newGroupNodeId = `group-${Date.now()}`;

    // Create the actual new node
    const newNode = {
      id: newNodeId,
      type: nodeType,
      position: { x: 0, y: 0 },
      data: { ...data, label: data.label || `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}` }
    };
    
    // Create an optional wrapping group
    const newGroupNode = wrapInGroup ? {
      id: newGroupNodeId,
      type: 'group',
      position: { x: 0, y: 0 },
      data: { label: `${newNode.data.label} Group`, children: [newNodeId] }
    } : null;

    // Determine the ID to connect edges to
    // If we wrap it, edges point to the new node still (true Airflow group style where edges enter children)
    // Wait, in this logic, if we wrap it, we still connect edges directly to the new node, and the Group wraps the node visually.
    const addedEdges: Edge[] = [];
    if (sourceId) {
      addedEdges.push({ id: `e-${sourceId}-${newNodeId}`, source: sourceId, target: newNodeId, type: 'airflow' });
    }
    if (targetId) {
      addedEdges.push({ id: `e-${newNodeId}-${targetId}`, source: newNodeId, target: targetId, type: 'airflow' });
    }

    // --- Backend Integration Stub ---
    try {
      console.log('Sending structured payload to backend...', { newNode, newGroupNode, edges: addedEdges });
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Payload successfully saved to backend!');
    } catch (error) {
      console.error('Failed to sync graph state to the backend database:', error);
      return; 
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
      
      if (newGroupNode) {
        newNodes.push(newGroupNode as Node);
      }

      if (groupId) {
        newNodes = newNodes.map(n => {
          if (n.id === groupId) {
            return {
              ...n,
              data: {
                ...n.data,
                // Add either the group ID or the node ID depending on what we created
                children: [...((n.data.children as string[]) || []), wrapInGroup ? newGroupNodeId : newNodeId]
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
