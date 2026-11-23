import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'smartscheduler-api' });
});

app.get('/api/catalog', (_request, response) => {
  response.json({
    subjects: 8,
    faculty: 7,
    classrooms: 9,
    note: 'Static academic catalog is intentionally kept in the client until persistence is required.',
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

export default app;
