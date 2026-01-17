import { Router } from 'express';
import { RouterController } from '../controllers/router.controller';

const router = Router();

router.get('/route', RouterController.routeRequest);
router.post('/nodes/:id', RouterController.addNode);
router.delete('/nodes/:id', RouterController.removeNode);
router.get('/topology', RouterController.getTopology);

export default router;
