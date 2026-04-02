import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default mock data based on images
const initialTeachers = [
  { id: 't1', name: 'Kamal Sharma', allowedSubjects: ['Science', 'Maths'], maxPeriods: 36 },
  { id: 't2', name: 'Sushma Verma', allowedSubjects: ['Comp'], maxPeriods: 36 },
  { id: 't3', name: 'Devanand Sharma', allowedSubjects: ['Maths', 'Phy'], maxPeriods: 36 },
  { id: 't4', name: 'Anil Kumar', allowedSubjects: ['Hindi'], maxPeriods: 36 },
  { id: 't5', name: 'Maladeep Rawat', allowedSubjects: ['Eng', 'Hindi', 'Skill'], maxPeriods: 36 },
  { id: 't6', name: 'Priyanka', allowedSubjects: ['Sci.', 'G.K', 'Skill', 'Art'], maxPeriods: 36 },
  { id: 't7', name: 'Sumedha', allowedSubjects: ['S.St', 'Maths'], maxPeriods: 36 },
  { id: 't8', name: 'Vandana Kashyap', allowedSubjects: ['Eng'], maxPeriods: 36 },
  { id: 't9', name: 'Triveni Dutt Sharma', allowedSubjects: ['Game', 'Skt', 'M.P.T'], maxPeriods: 36 },
];

const initialClasses = [
  { id: 'c1', name: '6th' },
  { id: 'c2', name: '7th' },
  { id: 'c3', name: '8th' },
  { id: 'c4', name: '9th A' },
  { id: 'c5', name: '9th B' },
  { id: 'c6', name: '10th' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 'BREAK', 5, 6, 7, 8];

const generateEmptyGrid = () => {
  const grid = {};
  days.forEach(day => {
    periods.forEach(p => {
      if (p !== 'BREAK') {
        initialClasses.forEach(c => {
          grid[`${day}-${p}-${c.id}`] = {
            id: `${day}-${p}-${c.id}`,
            day,
            period: p,
            classId: c.id,
            teacherId: null,
            subject: null,
            isOverride: false
          };
        });
      }
    });
  });
  return grid;
};

export const useTimetableStore = create(
  persist(
    (set, get) => ({
      teachers: initialTeachers,
      classes: initialClasses,
      timetable: generateEmptyGrid(),
      
      assignCell: (cellId, teacherId, subject) => set((state) => {
        const newTimetable = { ...state.timetable };
        if (newTimetable[cellId]) {
          newTimetable[cellId] = {
            ...newTimetable[cellId],
            teacherId,
            subject,
            isOverride: false // Standard assignment resets override flag
          };
        }
        return { timetable: newTimetable };
      }),

      overrideCell: (cellId, teacherId, subject) => set((state) => {
        const newTimetable = { ...state.timetable };
        if (newTimetable[cellId]) {
          newTimetable[cellId] = {
            ...newTimetable[cellId],
            teacherId,
            subject,
            isOverride: true
          };
        }
        return { timetable: newTimetable };
      }),
      
      clearCell: (cellId) => set((state) => {
        const newTimetable = { ...state.timetable };
        if (newTimetable[cellId]) {
          newTimetable[cellId] = {
            ...newTimetable[cellId],
            teacherId: null,
            subject: null,
            isOverride: false
          };
        }
        return { timetable: newTimetable };
      }),
      
      // Selectors / Helpers accessible via get() but typically used inside React components
      getTeacherLoad: (teacherId) => {
        const { timetable } = get();
        return Object.values(timetable).filter(c => c.teacherId === teacherId).length;
      },
      
      getPeriodConflicts: (day, periodIndex, teacherId) => {
        const { timetable } = get();
        // Check if teacher is already assigned in another class during this exact time
        return Object.values(timetable).filter(
          c => c.day === day && c.period === periodIndex && c.teacherId === teacherId
        );
      },

      clearTimetable: () => set({ timetable: generateEmptyGrid() }),
      
      addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, { ...teacher, id: 't' + Date.now() }] })),
      removeTeacher: (id) => set((state) => ({ teachers: state.teachers.filter(t => t.id !== id) })),
      
      addClass: (cls) => set((state) => ({ classes: [...state.classes, { ...cls, id: 'c' + Date.now() }] })),
      removeClass: (id) => set((state) => ({ classes: state.classes.filter(c => c.id !== id) }))
    }),
    {
      name: 'timetable-storage', // localstorage key
    }
  )
);
