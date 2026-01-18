const XXH = require('xxhashjs');
const seed = 0xABCD;

function hashString(key) {
    return XXH.h32(key, seed).toNumber();
}

// Mock Ring
const vNodes = 50;
const ring = new Map();
const sortedKeys = [];
['worker-01', 'worker-02', 'worker-03'].forEach(node => {
    for (let i = 0; i < vNodes; i++) {
        const h = hashString(`${node}#${i}`);
        ring.set(h, node);
        sortedKeys.push(h);
    }
});
sortedKeys.sort((a, b) => a - b);

function getNode(key) {
    const h = hashString(key);
    for (const kh of sortedKeys) {
        if (kh >= h) return ring.get(kh);
    }
    return ring.get(sortedKeys[0]);
}

const stats = { 'worker-01': 0, 'worker-02': 0, 'worker-03': 0 };
for (let i = 0; i < 1000; i++) {
    const node = getNode(`user-${i}`);
    stats[node]++;
}

console.log("Distribution of 1000 users:");
console.table(stats);
