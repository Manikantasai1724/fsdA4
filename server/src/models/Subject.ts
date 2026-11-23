import mongoose from 'mongoose';

export interface SubjectDocument {
  code: string;
  name: string;
  faculty: string;
  credits: number;
  colorIdx: number;
}

const subjectSchema = new mongoose.Schema<SubjectDocument>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    faculty: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 8 },
    colorIdx: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Subject = mongoose.models.Subject || mongoose.model<SubjectDocument>('Subject', subjectSchema);