import { Node, NodeProps } from '@xyflow/react';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  docs?: {
    md: string;
    editable: boolean;
  };
}

export interface ApiNodeData extends BaseNodeData {
  method?: string;
  endpoint?: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface FunctionNodeData extends BaseNodeData {
  language?: string;
  code?: string;
  codeRef?: string;
  schema?: Record<string, string>;
}

export interface SqlNodeData extends BaseNodeData {
  query?: string;
  database?: string;
}

export interface ServiceNodeData extends BaseNodeData {
  serviceName?: string;
  version?: string;
}

export interface EventNodeData extends BaseNodeData {
  eventName?: string;
  topic?: string;
  triggerType?: 'cron' | 'kafka' | 'webhook';
}

export interface ExternalNodeData extends BaseNodeData {
  systemName?: string;
  connectionType?: string;
}

export interface GroupNodeData extends BaseNodeData {
  children?: string[];
}

export type CustomNodeData = 
  | ApiNodeData 
  | FunctionNodeData 
  | SqlNodeData 
  | ServiceNodeData 
  | EventNodeData 
  | ExternalNodeData 
  | GroupNodeData;

export type CustomNode = Node<CustomNodeData>;
export type CustomNodeProps = NodeProps<CustomNode>;
