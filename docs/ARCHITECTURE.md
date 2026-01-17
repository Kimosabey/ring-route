# 🏗️ RingRoute Architecture

## High-Level Design (HLD)

RingRoute is a **Layer 7 Load Balancer** that uses **Consistent Hashing** to distribute requests across a dynamic set of worker nodes.

![Architecture Diagram](assets/architecture.png)

### Core Components

1.  **The Ring (Router)**:
    *   Maintains a sorted list of hashes representing the "Ring".
    *   Each physical node (`worker-01`) is mapped to `K` virtual nodes (`worker-01#0`, `worker-01#1`...).
    *   This ensures uniform distribution even with few physical nodes.

2.  **State Store**:
    *   Ideally distributed (like Redis), but for this V1 implementation, the Ring state is in-memory within the Node.js process.

3.  **Worker Nodes**:
    *   The destination services. In a real scenario, these are separate microservices. Here, they are simulated endpoints.

---

## Low-Level Design (LLD)

### Algorithm: Consistent Hashing
We use **DJB2** (or optionally **xxHash**) to map keys to a 32-bit integer space.

```typescript
hash(key) -> [0 ... 2^32 - 1]
```

**Lookup Process:**
1.  Hash the incoming `key` (e.g., `user_id`).
2.  Binary Search (or simple iteration for small N) on the sorted Ring array to find the first node hash `H_node >= H_key`.
3.  If no such node exists (end of array), wrap around to index 0.

### Request Flow
1.  Client sends `GET /route?key=session_882`.
2.  Router hashes `session_882` -> `881923`.
3.  Ring lookup finds `worker-02` owns range `[500000, 900000]`.
4.  Router proxies request or returns `307 Temporary Redirect` to `worker-02`.

---

## Scalability & Performance

*   **Add Node**: Only keys falling into the new node's range are remapped. `1/N` keys move.
*   **Remove Node**: Keys from the removed node spill over to its immediate neighbor.
*   **Virtual Nodes**: We use 100 vNodes per real node to prevent "hot spots" where one node randomly gets a large segment of the ring.

---

## Future Improvements
*   [ ] Use **Redis** to share Ring state across multiple Router instances.
*   [ ] Implement **Gossip Protocol** for decentralized node discovery.
