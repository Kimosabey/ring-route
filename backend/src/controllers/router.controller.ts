import { Request, Response } from 'express';
import { ConsistentHashRing } from '../core/consistent-hash.ring';

const ring = new ConsistentHashRing(50); // Initialize Ring

// Add some default nodes
ring.addNode('worker-01');
ring.addNode('worker-02');
ring.addNode('worker-03');

export class RouterController {

    static routeRequest(req: Request, res: Response) {
        const key = req.query.key as string;
        if (!key) {
            res.status(400).json({ error: "Missing 'key' query parameter" });
            return;
        }

        const targetNode = ring.getNode(key);
        res.json({
            key,
            routed_to: targetNode,
            timestamp: new Date().toISOString()
        });
    }

    static addNode(req: Request, res: Response) {
        const { id } = req.params;
        ring.addNode(id);
        res.json({ message: `Node ${id} added`, topology_size: ring.getRingTopology().length });
    }

    static removeNode(req: Request, res: Response) {
        const { id } = req.params;
        ring.removeNode(id);
        res.json({ message: `Node ${id} removed` });
    }

    static getTopology(req: Request, res: Response) {
        res.json(ring.getRingTopology());
    }
}
