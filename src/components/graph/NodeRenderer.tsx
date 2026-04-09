import { NodeTypes } from '@xyflow/react';
import { ApiNode, FunctionNode, SqlNode, ServiceNode, EventNode, ExternalNode } from '../nodes/actionNodes';
import { GroupNode } from '../nodes/GroupNode/GroupNode';

// Registry pattern mapping node type strings to actual React components
export const nodeTypes: NodeTypes = {
  api: ApiNode,
  function: FunctionNode,
  sql: SqlNode,
  service: ServiceNode,
  event: EventNode,
  external: ExternalNode,
  group: GroupNode,
};
