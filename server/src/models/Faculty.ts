import mongoose from 'mongoose';

export interface FacultyDocument {
  name: string;
  department: string;
  subjects: string[];
  load: number;
  email: string;
  status: 'Active' | 'On Leave';
  joined: string;
  colorIdx: number;
}

const facultySchema = new mongoose.Schema<FacultyDocument>(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    subjects: [{ type: String, required: true }],
    load: { type: Number, required: true, min: 0 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ['Active', 'On Leave'], default: 'Active' },
    joined: { type: String, required: true },
    colorIdx: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Faculty = mongoose.models.Faculty || mongoose.model<FacultyDocument>('Faculty', facultySchema);