import { NodeTypes } from '@xyflow/react';
import { ApiNode } from '../nodes/ApiNode/ApiNode';
import { OperatorNode } from '../nodes/OperatorNode/OperatorNode';
import { GroupNode } from '../nodes/GroupNode/GroupNode';

// Registry pattern mapping node type strings to actual React components
export const nodeTypes: NodeTypes = {
  api: ApiNode,
  operator: OperatorNode,
  group: GroupNode,
};
