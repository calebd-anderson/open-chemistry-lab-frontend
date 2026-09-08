export interface ClusterMapResponse {
  nodes: Node[];
  links: Link[];
}

interface Node {
  id: number;
  group: number;
}

interface Link {
  source: number;
  target: number;
  value: number;
}
