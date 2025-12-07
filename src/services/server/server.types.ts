export interface NodeStatus {
  public_ip: string;
  score: number;
}

export interface ServerServiceStatus {
  nodes: NodeStatus[];
  connection_percent: number;
}
