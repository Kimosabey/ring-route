function hashString(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) + hash) + key.charCodeAt(i);
    }
    return hash >>> 0;
}

const hashes = [];
for (let i = 0; i < 50; i++) {
    hashes.push({ label: `worker-01#${i}`, hash: hashString(`worker-01#${i}`) });
}
hashes.sort((a, b) => a.hash - b.hash);
console.log(hashes.slice(0, 5));
console.log(hashes.slice(-5));
