# 🛡️ Failure Scenarios & Resilience: RingRoute

> "In Distributed Systems, nodes die. The Router must survive."

This document details how RingRoute handles node crashes and skewed traffic.

![Workflow](./assets/workflow.png)

---

## 1. Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **Worker Node** | Crash / Network Partition | **Partial**. Keys owned by this node fail. | **Fail-Over**. The Ring wraps traffic to the *next* clockwise node. Only `1/N` users are affected (Minimum Disruption). |
| **Router** | CPU Saturation | **Major**. Routing latency increases. | **Caching**. Frequently accessed keys are cached (`Map<Key, Node>`) to bypass the Binary Search step. |
| **Topology** | Hotspot (Skewed Keys) | **Performance**. One node gets 90% traffic. | **vNode Expansion**. We dynamically increase the Virtual Node count for the empty nodes to steal traffic from the hotspot. |

---

## 2. Deep Dive: The "Thundering Herd"

### The Scenario
`Worker-A` crashes. It was holding 1 million active sessions.
All 1 million user requests instantly shift to `Worker-B`.
`Worker-B`, unable to handle double load, also crashes.
Traffic shifts to `Worker-C`.
**Result**: Cascade Failure (Ring of Death).

### The Solution: Virtual Nodes
Because `Worker-A`'s load was split across 100 vNodes distributed randomly, when it crashes, its load doesn't go to *one* neighbor. It is scattered across `Worker-B, C, D... Z`.
*   **Result**: Each survivor takes a 1-2% load increase, rather than 100%. The cluster survives.

---

## 3. Resilience Testing

### Test 1: The "Chaos Monkey"
1.  Start the Visualizer.
2.  flood the system with 1000 keys.
3.  Randomly delete 1 Node every 5 seconds.
4.  **Expectation**: The Ring visualization should update instantly. Keys previously on red nodes should turn to the color of their new owners. No global reshuffle should occur.
