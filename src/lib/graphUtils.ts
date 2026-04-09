import dagre from 'dagre';
import { Edge, Node } from '@xyflow/react';

const nodeWidth = 180;
const nodeHeight = 80;
const groupCollapsedWidth = 220;
const groupCollapsedHeight = 80;

export const getLayoutedElements = (
  nodes: Node[], 
  edges: Edge[], 
  direction = 'LR',
  collapsedGroups: Set<string> = new Set(),
  childToGroup: Record<string, string> = {}
) => {
  // Use compound: true so Dagre treats groups as parent containers wrapping their children
  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 60 });

  nodes.forEach((node) => {
    if (node.type === 'group') {
      if (collapsedGroups.has(node.id)) {
        dagreGraph.setNode(node.id, { width: groupCollapsedWidth, height: groupCollapsedHeight });
      } else {
        // Provide padding so children aren't hugging the edge of the expanded group bounding box
        dagreGraph.setNode(node.id, { paddingTop: 60, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 });
      }
    } else {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
  });

  // Assign parents to establish compound hierarchy
  nodes.forEach((node) => {
    const parentId = childToGroup[node.id];
    if (parentId && !collapsedGroups.has(parentId)) {
      if (dagreGraph.hasNode(node.id) && dagreGraph.hasNode(parentId)) {
        dagreGraph.setParent(node.id, parentId);
      }
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = { ...node };

    newNode.position = {
      // dagre anchor is center center, shift to top left
      x: nodeWithPosition.x - nodeWithPosition.width / 2,
      y: nodeWithPosition.y - nodeWithPosition.height / 2,
    };

    if (node.type === 'group') {
      newNode.style = {
        ...newNode.style,
        width: nodeWithPosition.width,
        height: nodeWithPosition.height,
      };
      
      if (!collapsedGroups.has(node.id)) {
        newNode.zIndex = -10; // ensure box remains behind nested children
      }
    }

    newNode.draggable = false; 

    return newNode;
  });

  return { nodes: newNodes, edges };
};
