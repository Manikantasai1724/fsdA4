import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classrooms, faculty, subjects } from './data/catalog.js';
import { Classroom } from './models/Classroom.js';
import { Faculty } from './models/Faculty.js';
import { Subject } from './models/Subject.js';

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'smartscheduler-api',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'fallback',
  });
});

async function getCatalog<T>(model: { countDocuments(): Promise<number>; find(): { lean(): { exec(): Promise<T[]> } } }, fallback: readonly T[]): Promise<{ source: 'mongodb' | 'static'; items: T[] }> {
  if (mongoose.connection.readyState !== 1) return { source: 'static', items: [...fallback] };
  if (await model.countDocuments() === 0) return { source: 'static', items: [...fallback] };
  return { source: 'mongodb', items: await model.find().lean().exec() };
}

app.get('/api/catalog', async (_request, response, next) => {
  try {
    const [subjectData, facultyData, classroomData] = await Promise.all([
      getCatalog(Subject, subjects),
      getCatalog(Faculty, faculty),
      getCatalog(Classroom, classrooms),
    ]);
    response.json({ subjects: subjectData.items, faculty: facultyData.items, classrooms: classroomData.items, source: subjectData.source });
  } catch (error) {
    next(error);
  }
});

const timetableSchema = z.object({
  department: z.string().trim().min(1).max(80).optional().default('Computer Science'),
  semester: z.string().trim().min(1).max(40).optional().default('Semester 5'),
  section: z.string().trim().min(1).max(20).optional().default('Section A'),
});

app.post('/api/timetable/generate', async (request, response, next) => {
  const parsed = timetableSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid timetable options', details: parsed.error.flatten() });
    return;
  }

  try {
    const subjectData = await getCatalog(Subject, subjects);
    const classroomData = await getCatalog(Classroom, classrooms);
    const roomList = (classroomData.items as Array<{ code?: string; status?: string }>).filter(
      (room) => room.status !== 'Maintenance',
    );
    const schedule: Array<Array<{ subject: (typeof subjects)[number]; room: string } | null>> =
      Array.from({ length: 5 }, () => Array.from({ length: 8 }, () => null));

    let roomCursor = 0;
    subjectData.items.forEach((subject) => {
      let assigned = 0;
      for (let day = 0; day < 5 && assigned < subject.credits; day += 1) {
        for (let slot = 0; slot < 8 && assigned < subject.credits; slot += 1) {
          if (slot === 3 || schedule[day][slot]) continue;
          const room = roomList[roomCursor % roomList.length];
          const roomCode = room.code ?? 'TBD';
          schedule[day][slot] = { subject: subject as (typeof subjects)[number], room: roomCode };
          roomCursor += 1;
          assigned += 1;
        }
      }
    });

    response.json({ schedule, options: parsed.data, generatedAt: new Date().toISOString(), conflicts: 0 });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', (request, response) => {
  const login = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(request.body);
  if (!login.success) {
    response.status(400).json({ error: 'Invalid login request' });
    return;
  }
  response.json({ user: { name: 'Aryan Kumar', email: login.data.email, role: 'Administrator' } });
});

const clientDist = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/')) {
      next();
      return;
    }
    response.sendFile(resolve(clientDist, 'index.html'));
  });
}

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'An unexpected server error occurred' });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

export default app;
