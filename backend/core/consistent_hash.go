package core

import (
	"fmt"
	"sort"
	"sync"

	"github.com/cespare/xxhash/v2"
)

// ConsistentHashRing handles the mapping of keys to nodes using consistent hashing.
type ConsistentHashRing struct {
	virtualNodes int
	ring         map[uint32]string
	sortedKeys    []uint32
	mu           sync.RWMutex
}

// NewConsistentHashRing creates a new instance of the ring.
func NewConsistentHashRing(virtualNodes int) *ConsistentHashRing {
	return &ConsistentHashRing{
		virtualNodes: virtualNodes,
		ring:         make(map[uint32]string),
		sortedKeys:    []uint32{},
	}
}

// hashString returns a 32-bit hash for the given string using xxHash.
func (c *ConsistentHashRing) hashString(key string) uint32 {
	return uint32(xxhash.Sum64([]byte(key)))
}

// AddNode adds a physical node to the ring by creating multiple virtual nodes.
func (c *ConsistentHashRing) AddNode(node string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for i := 0; i < c.virtualNodes; i++ {
		virtualKey := fmt.Sprintf("%s#%d", node, i)
		h := c.hashString(virtualKey)
		c.ring[h] = node
		c.sortedKeys = append(c.sortedKeys, h)
	}
	sort.Slice(c.sortedKeys, func(i, j int) bool {
		return c.sortedKeys[i] < c.sortedKeys[j]
	})
}

// RemoveNode removes a physical node and its virtual nodes from the ring.
func (c *ConsistentHashRing) RemoveNode(node string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for i := 0; i < c.virtualNodes; i++ {
		virtualKey := fmt.Sprintf("%s#%d", node, i)
		h := c.hashString(virtualKey)
		delete(c.ring, h)
	}

	// Rebuild sorted keys
	newSortedKeys := make([]uint32, 0, len(c.ring))
	for k := range c.ring {
		newSortedKeys = append(newSortedKeys, k)
	}
	sort.Slice(newSortedKeys, func(i, j int) bool {
		return newSortedKeys[i] < newSortedKeys[j]
	})
	c.sortedKeys = newSortedKeys
}

// GetNode finds the appropriate node for a given key.
func (c *ConsistentHashRing) GetNode(key string) string {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if len(c.sortedKeys) == 0 {
		return ""
	}

	h := c.hashString(key)
	
	// Binary search for the first hash >= h
	idx := sort.Search(len(c.sortedKeys), func(i int) bool {
		return c.sortedKeys[i] >= h
	})

	// If idx == len(c.sortedKeys), cycle back to the first node
	if idx == len(c.sortedKeys) {
		idx = 0
	}

	return c.ring[c.sortedKeys[idx]]
}

// Topology returns the current state of the ring.
type NodePoint struct {
	Hash uint32 `json:"hash"`
	Node string `json:"node"`
}

func (c *ConsistentHashRing) GetTopology() []NodePoint {
	c.mu.RLock()
	defer c.mu.RUnlock()

	topology := make([]NodePoint, len(c.sortedKeys))
	for i, h := range c.sortedKeys {
		topology[i] = NodePoint{
			Hash: h,
			Node: c.ring[h],
		}
	}
	return topology
}
