import type { Node, NodeProps } from '@xyflow/react';

export type BaseNodeData = {
  label: string;
  [key: string]: any;
};

export type CustomNode = Node<BaseNodeData>;
export type CustomNodeProps = NodeProps<CustomNode>;
