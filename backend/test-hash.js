function hashString(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) + hash) + key.charCodeAt(i);
    }
    return hash >>> 0;
}

console.log("worker-01#0:", hashString("worker-01#0"));
console.log("worker-02#0:", hashString("worker-02#0"));
console.log("worker-03#0:", hashString("worker-03#0"));
console.log("user-1:", hashString("user-1"));
console.log("user-2:", hashString("user-2"));
