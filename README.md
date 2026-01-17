# 🔄 RingRoute (Project #36)

![RingRoute Dashboard](docs/assets/dashboard-preview.png)

> **High-Performance Distributed Request Router.**  
> Implements **Consistent Hashing** to route stateful requests to worker nodes with minimal rebalancing.

![Status](https://img.shields.io/badge/Status-Active_Development-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Overview

**RingRoute** is a specialized Load Balancer designed for distributed systems where "State" matters. Unlike traditional Round-Robin balancers, it ensures that requests for the same entity (User, Device, or Session) consistently land on the same worker node—even as the cluster scales up or down.

### 🚀 Key Features
- **Consistent Hashing Ring**: Logic that minimizes key redistribution during scaling events.
- **Virtual Nodes (vNodes)**: Probabilistically balanced load distribution across heterogeneous physical hardware.
- **Node Management**: Dynamic REST API to add/remove worker nodes on the fly.
- **Real-time Topology**: Live inspection of the ring's logical structure and hash distribution.
- **Vignette Routing**: Optimized for systems like Gaming Servers or Notification Hubs.

---

## 🏗️ Architecture

![Architecture](docs/assets/architecture.png)

The system works on a **Logical Ring** representing a 32-bit hash space.
1.  **Node Mapping**: Physical nodes are hashed multiple times (Virtual Nodes) to ensure uniform coverage.
2.  **Key Lookup**: Incoming request keys are hashed and mapped to the "closest" node on the ring clockwise.
3.  **Stability**: Adding a new node only requires re-mapping ~`1/N` of keys, compared to `(N-1)/N` in standard modulo hashing.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Backend Engine** | Node.js (TypeScript) | Core routing and algorithm implementation. |
| **API Layer** | Express.js | Management API for node orchestration. |
| **Frontend** | Next.js 14+ | Real-time visual topology dashboard. |
| **Hashing** | DJB2 / xxHash | High-speed, low-collision distribution. |

---

## 🚥 Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Route a Request
```bash
curl "http://localhost:3001/api/route?key=user123"
```

### 3. Manage Nodes
```bash
# Add a new node
curl -X POST "http://localhost:3001/api/nodes/worker-99"

# View Ring Topology
curl "http://localhost:3001/api/topology"
```

---

## 💎 Senior Signal
**"Why does this matter?"**
In stateful systems (like a chat application where users are connected via WebSockets), if a load balancer moves a user to a different server, the connection breaks. **RingRoute** provides "Sticky Routing" without the overhead of central session stores, enabling massive horizontal scalability with minimal disruption.

---

## 👤 Author
**Harshan Aiyappa** - *Senior Hybrid Cloud Engineer*  
[GitHub](https://github.com/Kimosabey) | [LinkedIn](https://linkedin.com/in/harshan-aiyappa)
