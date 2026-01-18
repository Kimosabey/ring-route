# 🎤 Interview Cheat Sheet: RingRoute

## 1. The Elevator Pitch (2 Minutes)

"RingRoute is a **High-Performance Distributed Router** implementing **Consistent Hashing**.
In standard Load Balancing (Round Robin), adding a server breaks 100% of existing caches because `Hash(key) % N` changes for every key.
RingRoute uses a **Hash Ring** topology. When a node is added/removed, only `K/N` keys are remapped (where K is keys, N is nodes).
I implemented **Virtual Nodes** to ensure uniform distribution and prevent 'Hotspots', simulating how systems like DynamoDB or Cassandra route requests."

---

## 2. "Explain Like I'm 5" (The Clock)

"Imagine a Clock Face.
*   **The Servers**: Are markers at 12:00, 3:00, 6:00, and 9:00.
*   **The Users**: Are random minutes on the clock (e.g., 2:15).
*   **The Rule**: Each user goes to the *next* marker clockwise.
*   *2:15 goes to 3:00*. *5:45 goes to 6:00*.
*   **Scaling**: If I add a new marker at 1:00, I only steal users from 12:00 to 1:00. Users at 2:15 are untouched.
*   **Standard Hashing**: Is like reshuffling all the markers randomly every time one changes. Everyone gets lost."

---

## 3. Tough Technical Questions

### Q: Why Virtual Nodes? Why isn't 1 node enough?
**A:** "Uniformity.
Hash functions are random. If you only have 3 nodes, they might land at 1:00, 2:00, and 3:00. The gap from 3:00 to 1:00 (the long way) is huge. One node takes 90% of the traffic.
**Virtual Nodes** split each physical server into 100 small slices scattered around the ring, statistically guaranteeing an even load split."

### Q: What hash function did you use?
**A:** "For a Load Balancer, Cryptographic security (SHA-256) is too slow.
I used **MurmurHash3** (or DJB2). It distributes bits very well (Avalanche Effect) and is extremely fast to compute.
Collisions are theoretically possible but statistically irrelevant in a 32-bit space for routing purposes."

### Q: How do you handle Node Failure?
**A:** "The Ring Topology makes is automatic.
If 'Node B' vanishes, the Lookup Algorithm (Binary Search) simply doesn't find it. It continues searching the array until it finds 'Node C'. The traffic naturally flows to the next available survivor."
