"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consistent_hashing_1 = require("./lib/consistent-hashing");
const app = (0, express_1.default)();
const port = 3000;
// Initialize the Ring with 3 Nodes
const ring = new consistent_hashing_1.ConsistentHashRing(50); // 50 virtual nodes per real node
ring.addNode('worker-01');
ring.addNode('worker-02');
ring.addNode('worker-03');
app.use(express_1.default.static('public'));
app.get('/route', (req, res) => {
    const key = req.query.key;
    if (!key) {
        return res.status(400).json({ error: "Missing 'key' query parameter" });
    }
    const targetNode = ring.getNode(key);
    res.json({
        key: key,
        routed_to: targetNode,
        timestamp: new Date().toISOString()
    });
});
app.post('/nodes/:id', (req, res) => {
    const nodeId = req.params.id;
    ring.addNode(nodeId);
    res.json({ message: `Node ${nodeId} added to the ring.` });
});
app.delete('/nodes/:id', (req, res) => {
    const nodeId = req.params.id;
    ring.removeNode(nodeId);
    res.json({ message: `Node ${nodeId} removed from the ring.` });
});
app.listen(port, () => {
    console.log(`🚀 RingRoute Load Balancer running on http://localhost:${port}`);
    console.log(`   Try: http://localhost:${port}/route?key=user123`);
});
