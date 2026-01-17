"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsistentHashRing = void 0;
class ConsistentHashRing {
    constructor(virtualNodes = 100) {
        this.virtualNodeCount = virtualNodes;
        this.ring = new Map();
        this.sortedKeys = [];
    }
    // Use a simple hash function (DJB2) or xxhash for consistency
    hashString(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) + hash) + key.charCodeAt(i);
        }
        return hash >>> 0; // Ensure unsigned 32-bit integer
    }
    addNode(node) {
        for (let i = 0; i < this.virtualNodeCount; i++) {
            const virtualNodeKey = `${node}#${i}`;
            const hash = this.hashString(virtualNodeKey);
            this.ring.set(hash, node);
            this.sortedKeys.push(hash);
        }
        this.sortedKeys.sort((a, b) => a - b);
        console.log(`[Ring] Added node: ${node} (${this.virtualNodeCount} v-nodes)`);
    }
    removeNode(node) {
        for (let i = 0; i < this.virtualNodeCount; i++) {
            const virtualNodeKey = `${node}#${i}`;
            const hash = this.hashString(virtualNodeKey);
            this.ring.delete(hash);
            const index = this.sortedKeys.indexOf(hash);
            if (index > -1) {
                this.sortedKeys.splice(index, 1);
            }
        }
        console.log(`[Ring] Removed node: ${node}`);
    }
    getNode(key) {
        if (this.ring.size === 0)
            return null;
        const hash = this.hashString(key);
        // Find the first node on the ring with hash >= key hash
        // (Simulating the clockwise traversal)
        for (const nodeHash of this.sortedKeys) {
            if (nodeHash >= hash) {
                return this.ring.get(nodeHash) || null;
            }
        }
        // Wrap around to the first node
        return this.ring.get(this.sortedKeys[0]) || null;
    }
}
exports.ConsistentHashRing = ConsistentHashRing;
