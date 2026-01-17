import express from 'express';
import routerRoutes from './routes/router.routes';

const app = express();
const PORT = process.env.PORT || 3001; // Backend on 3001 to avoid React 3000 collision

app.use(express.json());
app.use('/api', routerRoutes);

app.get('/health', (req, res) => res.send('RingRoute Backend is Healthy'));

app.listen(PORT, () => {
    console.log(`🚀 RingRoute Backend running on http://localhost:${PORT}`);
});
