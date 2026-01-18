const XXH = require('xxhashjs');
const seed = 0xABCD;

function hashString(key) {
    return XXH.h32(key, seed).toNumber();
}

const nodes = ['worker-01', 'worker-02', 'worker-03'];
const hashes = [];
nodes.forEach(node => {
    for (let i = 0; i < 50; i++) {
        hashes.push({ node, hash: hashString(`${node}#${i}`) });
    }
});
hashes.sort((a, b) => a.hash - b.hash);

let lastNode = null;
let switches = 0;
hashes.forEach(item => {
    if (item.node !== lastNode) {
        switches++;
        lastNode = item.node;
    }
});

console.log("Total Virtual Nodes:", hashes.length);
console.log("Node Switches (Spread Metric):", switches);
console.log("First 10 Hashes:");
console.table(hashes.slice(0, 10));
