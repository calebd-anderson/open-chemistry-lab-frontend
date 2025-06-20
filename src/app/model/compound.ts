export interface Reaction {
  elements: Map<string, number>;
  formula: string;
  title: string;
  firstDiscoveredWhen: string
  firstDiscoveredBy: string
  lastDiscoveredWhen: string
  lastDiscoveredBy: string
  discoveryCount: number
}

export interface UserReaction {
  userDiscoveredReaction: Reaction;
  userDiscoveredWhen: string
  userLastDiscoveredWhen: string
  userDiscoveryCount: number
}
