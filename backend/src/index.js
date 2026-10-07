import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { initDb } from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
// CSV & Google Sheets Integration Ready

// API Endpoints
app.use('/api', apiRoutes);

// Healthcheck & Root Route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SIGAP ASET Backend API Server Running', health: '/health', api: '/api' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SIGAP ASET Backend API (PostgreSQL)', timestamp: new Date() });
});

// Init DB lalu start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server Express SIGAP ASET berjalan di http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('DB Init Error:', err);
  app.listen(PORT, () => {
    console.log(`🚀 Server Express SIGAP ASET (fallback mode) di http://localhost:${PORT}`);
  });
});
