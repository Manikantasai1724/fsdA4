import mongoose from 'mongoose';

export interface ClassroomDocument {
  code: string;
  type: string;
  capacity: number;
  floor: number;
  airConditioned: boolean;
  projector: boolean;
  status: 'Available' | 'Occupied' | 'Maintenance';
  occupancy: number;
}

const classroomSchema = new mongoose.Schema<ClassroomDocument>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    floor: { type: Number, required: true, min: 0 },
    airConditioned: { type: Boolean, default: false },
    projector: { type: Boolean, default: false },
    status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
    occupancy: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true },
);

export const Classroom = mongoose.models.Classroom || mongoose.model<ClassroomDocument>('Classroom', classroomSchema);