import XXH from 'xxhashjs';

export class ConsistentHashRing {
    private readonly virtualNodeCount: number;
    private readonly ring: Map<number, string>;
    private sortedKeys: number[];
    private readonly seed = 0xABCD;

    constructor(virtualNodes: number = 100) {
        this.virtualNodeCount = virtualNodes;
        this.ring = new Map();
        this.sortedKeys = [];
    }

    private hashString(key: string): number {
        return XXH.h32(key, this.seed).toNumber();
    }

    public addNode(node: string): void {
        for (let i = 0; i < this.virtualNodeCount; i++) {
            const virtualNodeKey = `${node}#${i}`;
            const hash = this.hashString(virtualNodeKey);
            this.ring.set(hash, node);
            this.sortedKeys.push(hash);
        }
        this.sortedKeys.sort((a, b) => a - b);
    }

    public removeNode(node: string): void {
        for (let i = 0; i < this.virtualNodeCount; i++) {
            const virtualNodeKey = `${node}#${i}`;
            const hash = this.hashString(virtualNodeKey);
            this.ring.delete(hash);

            const index = this.sortedKeys.indexOf(hash);
            if (index > -1) {
                this.sortedKeys.splice(index, 1);
            }
        }
    }

    public getNode(key: string): string | null {
        if (this.ring.size === 0) return null;
        const hash = this.hashString(key);
        for (const nodeHash of this.sortedKeys) {
            if (nodeHash >= hash) return this.ring.get(nodeHash) || null;
        }
        return this.ring.get(this.sortedKeys[0]) || null;
    }

    public getRingTopology() {
        return this.sortedKeys.map(hash => ({
            hash,
            node: this.ring.get(hash)
        }));
    }
}
