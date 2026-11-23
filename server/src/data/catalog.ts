export const subjects = [
  { code: 'CS301', name: 'Data Structures & Algorithms', faculty: 'Dr. Arjun Mehta', credits: 4, colorIdx: 0 },
  { code: 'CS302', name: 'Database Management Systems', faculty: 'Prof. Sunita Rao', credits: 3, colorIdx: 1 },
  { code: 'CS303', name: 'Operating Systems', faculty: 'Dr. Vikram Nair', credits: 4, colorIdx: 2 },
  { code: 'CS304', name: 'Computer Networks', faculty: 'Dr. Priya Sharma', credits: 3, colorIdx: 3 },
  { code: 'CS305', name: 'Software Engineering', faculty: 'Prof. Rajan Pillai', credits: 3, colorIdx: 4 },
  { code: 'MA301', name: 'Discrete Mathematics', faculty: 'Dr. Kavitha Iyer', credits: 3, colorIdx: 5 },
  { code: 'CS306', name: 'Theory of Computation', faculty: 'Dr. Sanjay Gupta', credits: 3, colorIdx: 6 },
  { code: 'CS307', name: 'Machine Learning', faculty: 'Dr. Arjun Mehta', credits: 4, colorIdx: 7 },
];

export const faculty = [
  { name: 'Dr. Arjun Mehta', department: 'Computer Science', subjects: ['CS301', 'CS307'], load: 8, email: 'arjun.mehta@scst.edu', status: 'Active', joined: '2018', colorIdx: 0 },
  { name: 'Prof. Sunita Rao', department: 'Computer Science', subjects: ['CS302'], load: 3, email: 'sunita.rao@scst.edu', status: 'Active', joined: '2016', colorIdx: 1 },
  { name: 'Dr. Vikram Nair', department: 'Systems', subjects: ['CS303'], load: 4, email: 'vikram.nair@scst.edu', status: 'Active', joined: '2020', colorIdx: 2 },
  { name: 'Dr. Priya Sharma', department: 'Networks', subjects: ['CS304'], load: 3, email: 'priya.sharma@scst.edu', status: 'Active', joined: '2019', colorIdx: 3 },
  { name: 'Prof. Rajan Pillai', department: 'Software Eng.', subjects: ['CS305'], load: 3, email: 'rajan.pillai@scst.edu', status: 'On Leave', joined: '2015', colorIdx: 4 },
  { name: 'Dr. Kavitha Iyer', department: 'Mathematics', subjects: ['MA301'], load: 3, email: 'kavitha.iyer@scst.edu', status: 'Active', joined: '2017', colorIdx: 5 },
  { name: 'Dr. Sanjay Gupta', department: 'Computer Science', subjects: ['CS306'], load: 3, email: 'sanjay.gupta@scst.edu', status: 'Active', joined: '2021', colorIdx: 6 },
] as const;

export const classrooms = [
  { code: 'CR-101', type: 'Lecture Hall', capacity: 120, floor: 1, airConditioned: true, projector: true, status: 'Available', occupancy: 78 },
  { code: 'CR-102', type: 'Lecture Hall', capacity: 90, floor: 1, airConditioned: true, projector: true, status: 'Occupied', occupancy: 100 },
  { code: 'CR-201', type: 'Seminar Room', capacity: 60, floor: 2, airConditioned: true, projector: true, status: 'Available', occupancy: 45 },
  { code: 'CR-202', type: 'Seminar Room', capacity: 60, floor: 2, airConditioned: false, projector: true, status: 'Available', occupancy: 0 },
  { code: 'LAB-01', type: 'Computer Lab', capacity: 40, floor: 1, airConditioned: true, projector: false, status: 'Occupied', occupancy: 100 },
  { code: 'LAB-02', type: 'Computer Lab', capacity: 40, floor: 2, airConditioned: true, projector: false, status: 'Available', occupancy: 25 },
  { code: 'CR-301', type: 'Lecture Hall', capacity: 80, floor: 3, airConditioned: true, projector: true, status: 'Maintenance', occupancy: 0 },
  { code: 'LAB-03', type: 'Research Lab', capacity: 20, floor: 3, airConditioned: true, projector: true, status: 'Available', occupancy: 60 },
  { code: 'AUD-01', type: 'Auditorium', capacity: 300, floor: 0, airConditioned: true, projector: true, status: 'Available', occupancy: 30 },
] as const;