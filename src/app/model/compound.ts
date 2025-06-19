export interface Reaction {
  elements: Map<string, number>;
  formula: string;
  title: string;
  discoveredWhen: string
  discoveredBy: string
  lastDiscoveredWhen: string
  lastDiscoveredBy: string
  discoveryCount: number
}

export interface UserReaction {
  userDiscoveredReaction: Reaction;
  firstDiscovered: string
  lastDiscovered: string
}
