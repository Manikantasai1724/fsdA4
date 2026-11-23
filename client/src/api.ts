import type { Classroom, Faculty, Subject, TimetableCell } from './data';

const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export interface CatalogResponse {
  subjects: Subject[];
  faculty: Array<Faculty & { department?: string }>;
  classrooms: Classroom[];
  source: 'mongodb' | 'static';
}

export interface TimetableResponse {
  schedule: Array<Array<TimetableCell | null>>;
  conflicts: number;
  generatedAt: string;
}

export async function getCatalog(): Promise<CatalogResponse | null> {
  try {
    const response = await fetch(`${apiBase}/api/catalog`);
    if (!response.ok) return null;
    return await response.json() as CatalogResponse;
  } catch {
    return null;
  }
}

export async function generateTimetable(options: {
  department: string;
  semester: string;
  section: string;
}): Promise<TimetableResponse | null> {
  try {
    const response = await fetch(`${apiBase}/api/timetable/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    if (!response.ok) return null;
    return await response.json() as TimetableResponse;
  } catch {
    return null;
  }
}
