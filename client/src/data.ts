export type Status = 'Available' | 'Occupied' | 'Maintenance';

export interface Subject {
  code: string;
  name: string;
  faculty: string;
  credits: number;
  colorIdx: number;
}

export interface Faculty {
  id: number;
  name: string;
  dept: string;
  subjects: string[];
  load: number;
  email: string;
  status: 'Active' | 'On Leave';
  joined: string;
  colorIdx: number;
}

export interface Classroom {
  id: string;
  type: string;
  capacity: number;
  floor: number;
  ac: boolean;
  projector: boolean;
  status: Status;
  occupancy: number;
}

export interface TimetableCell {
  subject: Subject;
  room: string;
}

const subjectRows: Array<[string, string, string, number]> = [
  ['CS301', 'Data Structures & Algorithms', 'Dr. Arjun Mehta', 4],
  ['CS302', 'Database Management Systems', 'Prof. Sunita Rao', 3],
  ['CS303', 'Operating Systems', 'Dr. Vikram Nair', 4],
  ['CS304', 'Computer Networks', 'Dr. Priya Sharma', 3],
  ['CS305', 'Software Engineering', 'Prof. Rajan Pillai', 3],
  ['MA301', 'Discrete Mathematics', 'Dr. Kavitha Iyer', 3],
  ['CS306', 'Theory of Computation', 'Dr. Sanjay Gupta', 3],
  ['CS307', 'Machine Learning', 'Dr. Arjun Mehta', 4],
];
export const subjects: Subject[] = subjectRows.map(([code, name, faculty, credits], colorIdx) => ({
  code,
  name,
  faculty,
  credits: Number(credits),
  colorIdx,
}));

const facultyRows: Array<[string, string, string[], number, string, Faculty['status'], string]> = [
  ['Dr. Arjun Mehta', 'Computer Science', ['CS301', 'CS307'], 8, 'arjun.mehta@scst.edu', 'Active', '2018'],
  ['Prof. Sunita Rao', 'Computer Science', ['CS302'], 3, 'sunita.rao@scst.edu', 'Active', '2016'],
  ['Dr. Vikram Nair', 'Systems', ['CS303'], 4, 'vikram.nair@scst.edu', 'Active', '2020'],
  ['Dr. Priya Sharma', 'Networks', ['CS304'], 3, 'priya.sharma@scst.edu', 'Active', '2019'],
  ['Prof. Rajan Pillai', 'Software Eng.', ['CS305'], 3, 'rajan.pillai@scst.edu', 'On Leave', '2015'],
  ['Dr. Kavitha Iyer', 'Mathematics', ['MA301'], 3, 'kavitha.iyer@scst.edu', 'Active', '2017'],
  ['Dr. Sanjay Gupta', 'Computer Science', ['CS306'], 3, 'sanjay.gupta@scst.edu', 'Active', '2021'],
];
export const faculty: Faculty[] = facultyRows.map(([name, dept, subjectCodes, load, email, status, joined], index) => ({
  id: index + 1,
  name,
  dept,
  subjects: subjectCodes as string[],
  load: Number(load),
  email,
  status: status as Faculty['status'],
  joined,
  colorIdx: index,
}));

const classroomRows: Array<[string, string, number, number, boolean, boolean, Status, number]> = [
  ['CR-101', 'Lecture Hall', 120, 1, true, true, 'Available', 78],
  ['CR-102', 'Lecture Hall', 90, 1, true, true, 'Occupied', 100],
  ['CR-201', 'Seminar Room', 60, 2, true, true, 'Available', 45],
  ['CR-202', 'Seminar Room', 60, 2, false, true, 'Available', 0],
  ['LAB-01', 'Computer Lab', 40, 1, true, false, 'Occupied', 100],
  ['LAB-02', 'Computer Lab', 40, 2, true, false, 'Available', 25],
  ['CR-301', 'Lecture Hall', 80, 3, true, true, 'Maintenance', 0],
  ['LAB-03', 'Research Lab', 20, 3, true, true, 'Available', 60],
  ['AUD-01', 'Auditorium', 300, 0, true, true, 'Available', 30],
];
export const classrooms: Classroom[] = classroomRows.map(([id, type, capacity, floor, ac, projector, status, occupancy]) => ({
  id,
  type,
  capacity: Number(capacity),
  floor: Number(floor),
  ac: Boolean(ac),
  projector: Boolean(projector),
  status: status as Status,
  occupancy: Number(occupancy),
}));

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const timeSlots = ['9:00–9:55', '10:00–10:55', '11:00–11:55', '12:00–12:55', '1:00–1:55', '2:00–2:55', '3:00–3:55', '4:00–4:55'];
export const breakSlots = [3];
