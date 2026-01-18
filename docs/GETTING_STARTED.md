# 🚀 Getting Started with RingRoute

> **Prerequisites**
> *   **Node.js v18+**
> *   **npm**

## 1. Environment Setup

RingRoute is a monolithic repository containing both the Algorithm (Backend) and Visualizer (Frontend).

### Folder Structure
*   `backend/`: The Node.js Routing Engine.
*   `frontend/`: The Next.js Topology Dashboard.

---

## 2. Installation & Launch

### Step 1: Start the Backend (API)
The backend runs the hashing logic and exposed REST endpoints.
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:3001
```

### Step 2: Start the Frontend (Dashboard)
The frontend visualizes the ring.
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 3. Usage Guide

### A. Routing a Request
To see which node handles a user:

```bash
# Ask the Router: "Where does user-123 go?"
curl "http://localhost:3001/api/route?key=user-123"

# Response:
# { "node": "worker-02", "hash": 39482103 }
```

### B. Dynamic Scaling (Simulating Failure)
You can add or remove nodes while traffic is flowing to see Consistent Hashing in action (minimal disruption).

```bash
# Add a new worker
curl -X POST "http://localhost:3001/api/nodes/add" -d '{"id": "worker-05"}'

# Remove a worker (Crash simulation)
curl -X POST "http://localhost:3001/api/nodes/remove" -d '{"id": "worker-01"}'
```

---

## 4. Running Benchmarks

### Distribution Test
To verify if Virtual Nodes are working (Key distribution should be roughly even):
1.  Run the `scripts/benchmark.ts` (if available).
2.  Or use the Frontend Dashboard's "Simulate Traffic" button.
3.  **Target**: Standard Deviation of key counts across nodes should be < 15%.
