# 🏗️ System Architecture

## 1. High-Level Design (HLD)

RingRoute is a **Layer 7 Application Router** designed for stateful distributed systems. It acts as a "Smart Load Balancer" that guarantees **Sticky Sessions** via **Consistent Hashing**, ensuring that requests for a specific entity (e.g., User ID, Game Session) always land on the same worker node, even as the cluster scales.

```mermaid
graph TD
    User([👤 User Request]) -->|key: 'user-123'| Router[🔄 RingRoute Balancer]
    
    subgraph "Consistent Hash Ring"
        Router -->|Hash(key) -> 0x4F2A| RingLogic[Virtual Ring Topology]
        RingLogic -->|Lookup| N1[Worker Node 1]
        RingLogic -->|Lookup| N2[Worker Node 2]
        RingLogic -->|Lookup| N3[Worker Node 3]
    end
    
    N2 -->|Process Request| User
```

### Core Components
1.  **Hash Ring Manager**: The central brain. It maintains a sorted list of hashes representing the cluster topology.
2.  **Virtual Nodes (vNodes)**: To prevent data hotspots, each Physical Node (`Worker-A`) is hashed `K` times (e.g., `Worker-A#1`, `Worker-A#2`...) and placed at different points on the ring.
3.  **Visualizer (Frontend)**: A real-time D3.js/Canvas dashboard that renders the ring state, showing exactly where keys land.

---

## 2. Low-Level Design (LLD)

### The Algorithm
We strictly adhere to the **Consistent Hashing** principles:
1.  **Ring Space**: A 32-bit integer circle (`0` to `2^32 - 1`).
2.  **Hashing Function**: `MurmurHash3` or `DJB2` (Non-cryptographic, high-speed).
3.  **Lookup (Routing)**:
    *   Hash the `Incoming Key` -> `H(k)`.
    *   Perform **Binary Search** on the sorted Ring Array to find the first Node Hash `H(n) >= H(k)`.
    *   If end of array is reached, wrap around to Index 0.

### Data Schema (Topology Snapshot)
```typescript
interface RingTopology {
  ringSpace: number; // 2^32
  nodes: {
    id: string; // "worker-01"
    vNodes: number[]; // [hash1, hash2, hash3...]
  }[];
  activeKeys: {
    key: string;
    hash: number;
    assignedNode: string;
  }[];
}
```

---

## 3. Decision Log

| Decision | Alternative | Reason for Choice |
| :--- | :--- | :--- |
| **Virtual Nodes** | Simple Nodes | **Load Balancing**. Without vNodes, if Node A goes down, its neighbor Node B takes *all* its load (doubling load). With vNodes, the load is scattered across *all* remaining nodes. |
| **Binary Search** | Linear Search | **Performance**. For `N` nodes, lookup is `O(log N)` vs `O(N)`. Essential when running 1000s of vNodes. |
| **TypeScript** | Python | **Speed**. Node.js JIT optimization handles high-throughput hash calculations efficiently. |

---

## 4. Key Patterns

### "The Hotspot Problem"
If one popular user (e.g., "Justin Bieber") generates 1000x traffic, one node might melt.
*   **RingRoute Solution**: While not fully implemented in V1, the architecture supports "Bounded Load". If a node exceeds capacity, the ring can "skip" to the next neighbor for that specific key.

### Node Flapping Protection
Rapidly adding/removing nodes causes "Hash Churn".
*   **Stability**: The Ring only re-calculates the sorted array on explicit topology change events, not per request.
