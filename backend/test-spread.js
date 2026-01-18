function hashString(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) + hash) + key.charCodeAt(i);
    }
    return hash >>> 0;
}

const nodes = ['worker-01', 'worker-02', 'worker-03'];
const hashes = [];
nodes.forEach(node => {
    for (let i = 0; i < 50; i++) {
        hashes.push({ node, hash: hashString(`${node}#${i}`) });
    }
});
hashes.sort((a, b) => a.hash - b.hash);

// Check if nodes are interleaved
let lastNode = null;
let switches = 0;
hashes.forEach(item => {
    if (item.node !== lastNode) {
        switches++;
        lastNode = item.node;
    }
});

console.log("Total Virtual Nodes:", hashes.length);
console.log("Node Switches (spread metric):", switches);
console.log("First 10:", hashes.slice(0, 10));
