# 🔄 RingRoute

> **High-Performance Distributed Request Router.**  
> Implements **Consistent Hashing** to route stateful requests to worker nodes with minimal rebalancing.

![Project Status](https://img.shields.io/badge/Status-Initializing-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Overview

**RingRoute** is a specialized Load Balancer written in **Go**. Unlike traditional Round-Robin LBs, it uses a **Consistent Hashing Ring** (with virtual nodes) to ensure that requests for the same "Key" (e.g., UserID, GameSessionID) always land on the same worker node, even as nodes are added or removed.

### 🚀 Key Features (Planned)
- **Consistent Hashing Ring**: Minimal key redistribution during scaling events.
- **Virtual Nodes**: Balanced load distribution across physical nodes.
- **Go Concurrency**: High-throughput non-blocking request handling.
- **Health Checking**: Automatic node removal and ring rebalancing upon failure.
- **Visualizer**: Real-time dashboard showing key distribution across the ring.

---

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Router Engine** | **Go (Golang 1.22)** | High-Perf HTTP/gRPC Handling |
| **Algorithm** | **Consistent Hashing** | State Awareness |
| **State Store** | **Redis** | Node Registry & Health Status |
| **Protocol** | **gRPC / HTTP2** | Inter-node Communication |
| **Visualization** | **React / Next.js** | Live Ring Topology View |

---

## 🏗️ Architecture

*(Architecture Diagram Coming Soon)*

---

## 👤 Author

**Harshan Aiyappa**  
[GitHub](https://github.com/Kimosabey) | [LinkedIn](https://linkedin.com/in/harshan-aiyappa) | [X](https://x.com/harshan_aiyappa)
