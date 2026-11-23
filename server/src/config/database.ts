import mongoose from 'mongoose';
import { classrooms, faculty, subjects } from '../data/catalog.js';
import { Classroom } from '../models/Classroom.js';
import { Faculty } from '../models/Faculty.js';
import { Subject } from '../models/Subject.js';

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.warn('MONGODB_URI is not configured; using static catalog fallback.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    await Promise.all([
      Subject.countDocuments().then((count) => count === 0 ? Subject.insertMany(subjects) : undefined),
      Faculty.countDocuments().then((count) => count === 0 ? Faculty.insertMany(faculty) : undefined),
      Classroom.countDocuments().then((count) => count === 0 ? Classroom.insertMany(classrooms) : undefined),
    ]);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed; using static catalog fallback.', error instanceof Error ? error.message : error);
    return false;
  }
}