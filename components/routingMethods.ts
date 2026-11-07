export type RoutingMethod = "round" | "aware" | "ml" | "weighted" | "connections" | "latency" | "hash" | "two";

export const routingMethods: { id: RoutingMethod; name: string; rule: string; formula: string; tradeoff: string }[] = [
  { id: "round", name: "Round Robin", rule: "Keep a pointer to the next server. Send a request there, then advance the pointer and wrap back to the first server.", formula: "server = request index mod 3", tradeoff: "Simple rotation gives similar request counts. Requests may take different amounts of work." },
  { id: "aware", name: "Aware", rule: "Read resource signals and score each server. This example gives CPU and RAM equal weight, then chooses the lowest score.", formula: "score = 0.5 × CPU% + 0.5 × RAM%", tradeoff: "The inputs and weights matter. This is one illustrative resource-aware rule, with a fixed CPU/RAM snapshot." },
  { id: "ml", name: "Machine learning", rule: "Build features from the workload and server state. A model can estimate a routing cost for each server, and a policy can choose the lowest estimate.", formula: "choose the lowest predicted completion cost", tradeoff: "This example uses supplied mock predictions. Research would need a trained model, evaluation, and consideration of inference overhead." },
  { id: "weighted", name: "Weighted Round Robin", rule: "Give servers different shares of a cycle. With weights A=1, B=2, C=1, this grouped example repeats A → B → B → C.", formula: "cycle = [A, B, B, C]", tradeoff: "Weights express intended capacity. The exact ordering varies by implementation, including smooth weighted variants." },
  { id: "connections", name: "Least connections", rule: "Count each server’s active connections and choose the smallest count. The example adds a connection after every decision.", formula: "choose min(active connections)", tradeoff: "A connection count gives a load signal, but connections can have different costs. Ties here use server order." },
  { id: "latency", name: "Least response time", rule: "Use recent response-time observations to prefer a faster server. This simplified example chooses the lowest observed time.", formula: "choose min(observed response time)", tradeoff: "Observations can be stale. Practical variants may combine response time with active connections." },
  { id: "hash", name: "IP / key hash", rule: "Hash a request key and map it to a server. This example uses a visitor key so you can see the same key return to the same target.", formula: "server = hash(visitor key) mod 3", tradeoff: "Useful for affinity. Uneven keys can concentrate traffic, and changing the pool can change the mapping." },
  { id: "two", name: "Power of two choices", rule: "Sample two distinct servers and choose the one with fewer active connections. The example replays pairs A/C, A/B, then B/C.", formula: "sample two → compare connections → choose", tradeoff: "It compares a small candidate set. A lightly loaded server outside the sampled pair may be skipped." },
];

export const sampleServers = [
  { name: "A", active: 9, weight: 1, cpu: 80, ram: 65, response: 80, prediction: 40 },
  { name: "B", active: 2, weight: 2, cpu: 35, ram: 75, response: 45, prediction: 18 },
  { name: "C", active: 5, weight: 1, cpu: 55, ram: 30, response: 60, prediction: 27 },
];

function minimum(values: number[], candidates = [0, 1, 2]) {
  return candidates.reduce((best, candidate) => values[candidate] < values[best] ? candidate : best);
}

function keyHash(value: string) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash;
}

export function routingDecision(method: RoutingMethod, request: number, visitor: string) {
  const connections = sampleServers.map(server => server.active);
  const resourceScores = sampleServers.map(server => (server.cpu + server.ram) / 2);
  const pairs = [[0, 2], [0, 1], [1, 2]];
  const cycle = [0, 1, 1, 2];
  function choose(index: number) {
    switch (method) {
      case "round": return index % 3;
      case "weighted": return cycle[index % cycle.length];
      case "connections": return minimum(connections);
      case "latency": return minimum(sampleServers.map(server => server.response));
      case "aware": return minimum(resourceScores);
      case "ml": return minimum(sampleServers.map(server => server.prediction));
      case "hash": return keyHash(visitor) % 3;
      case "two": return minimum(connections, pairs[index % pairs.length]);
    }
  }
  // Earlier requests remain connected throughout this short, replayable example.
  for (let index = 0; index < request; index++) connections[choose(index)]++;
  const target = choose(request);
  const candidates = method === "two" ? pairs[request % pairs.length] : [0, 1, 2];
  const name = sampleServers[target].name;
  let reason = "";
  switch (method) {
    case "round": reason = "The rotating pointer is at server " + name + "."; break;
    case "weighted": reason = "Position " + (request % 4 + 1) + " in the A → B → B → C cycle selects " + name + "."; break;
    case "connections": reason = name + " has the lowest active count, " + connections[target] + ". Ties use server order."; break;
    case "latency": reason = name + " has the lowest example response time, " + sampleServers[target].response + " ms."; break;
    case "aware": reason = name + " has the lowest CPU/RAM score, " + resourceScores[target] + "."; break;
    case "ml": reason = name + " has the lowest mock predicted cost, " + sampleServers[target].prediction + " ms."; break;
    case "hash": reason = "The example hash of “" + visitor + "” maps to server " + name + " in this fixed pool."; break;
    case "two": reason = "The sampled pair is " + candidates.map(index => sampleServers[index].name).join(" / ") + ". " + name + " has the lower count within that pair."; break;
  }
  return { target, candidates, connections, resourceScores, reason };
}
