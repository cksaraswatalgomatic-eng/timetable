import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default mock data based on images
const initialTeachers = [
  { id: 't1', name: 'Kamal Sharma', allowedSubjects: ['Science', 'Maths'], maxPeriods: 36, category: 'secondary' },
  { id: 't2', name: 'Sushma Verma', allowedSubjects: ['Comp'], maxPeriods: 36, category: 'secondary' },
  { id: 't3', name: 'Devanand Sharma', allowedSubjects: ['Maths', 'Phy'], maxPeriods: 36, category: 'secondary' },
  { id: 't4', name: 'Anil Kumar', allowedSubjects: ['Hindi'], maxPeriods: 36, category: 'secondary' },
  { id: 't5', name: 'Maladeep Rawat', allowedSubjects: ['Eng', 'Hindi', 'Skill'], maxPeriods: 36, category: 'secondary' },
  { id: 't6', name: 'Priyanka', allowedSubjects: ['Sci.', 'G.K', 'Skill', 'Art'], maxPeriods: 36, category: 'secondary' },
  { id: 't7', name: 'Sumedha', allowedSubjects: ['S.St', 'Maths'], maxPeriods: 36, category: 'secondary' },
  { id: 't8', name: 'Vandana Kashyap', allowedSubjects: ['Eng'], maxPeriods: 36, category: 'secondary' },
  { id: 't9', name: 'Triveni Dutt Sharma', allowedSubjects: ['Game', 'Skt', 'M.P.T'], maxPeriods: 36, category: 'secondary' },
  // Primary Teachers
  { id: 'tp1', name: 'Shruti', allowedSubjects: ['Eng', 'Activity', 'Hindi', 'Rhyme', 'Conv.', 'Art', 'Game'], maxPeriods: 36, category: 'primary' },
  { id: 'tp2', name: 'Arti', allowedSubjects: ['Maths', 'Art', 'Game', 'Conv.', 'Rhyme', 'G.K', 'Activity'], maxPeriods: 36, category: 'primary' },
  { id: 'tp3', name: 'Gaurav', allowedSubjects: ['Conv.', 'EVS', 'Comp.', 'Game', 'Maths', 'G.K', 'V.Math', 'Skt'], maxPeriods: 36, category: 'primary' },
  { id: 'tp4', name: 'Sonia', allowedSubjects: ['EVS', 'Eng', 'Hindi'], maxPeriods: 36, category: 'primary' },
  { id: 'tp5', name: 'Preeti', allowedSubjects: ['Maths', 'Hindi'], maxPeriods: 36, category: 'primary' },
  { id: 'tp6', name: 'Anu', allowedSubjects: ['Science', 'Comp.', 'Conv.', 'G.K', 'Art', 'Game', 'S.St'], maxPeriods: 36, category: 'primary' },
  { id: 'tp7', name: 'L.S', allowedSubjects: ['Hindi', 'Game', 'Skt', 'Art'], maxPeriods: 36, category: 'primary' },
  { id: 'tp8', name: 'P.K', allowedSubjects: ['Skt'], maxPeriods: 36, category: 'primary' },
  { id: 'tp9', name: 'V.K', allowedSubjects: ['Eng'], maxPeriods: 36, category: 'primary' },
  { id: 'tp10', name: 'T.D', allowedSubjects: ['Hindi', 'Maths', 'Skt'], maxPeriods: 36, category: 'primary' },
  { id: 'tp11', name: 'P.T', allowedSubjects: ['S.St'], maxPeriods: 36, category: 'primary' },
  { id: 'tp12', name: 'J.K', allowedSubjects: ['V.M'], maxPeriods: 36, category: 'primary' },
];

const initialClasses = [
  // Primary (KG to 5th)
  { id: 'cp1', name: 'NURSERY+LKG', category: 'primary' },
  { id: 'cp2', name: 'U.K.G.', category: 'primary' },
  { id: 'cp3', name: '1ST', category: 'primary' },
  { id: 'cp4', name: '2ND', category: 'primary' },
  { id: 'cp5', name: '3RD', category: 'primary' },
  { id: 'cp6', name: '4TH', category: 'primary' },
  { id: 'cp7', name: '5TH', category: 'primary' },

  // Secondary (6th to 10th)
  { id: 'c1', name: '6th', category: 'secondary' },
  { id: 'c2', name: '7th', category: 'secondary' },
  { id: 'c3', name: '8th', category: 'secondary' },
  { id: 'c4', name: '9th A', category: 'secondary' },
  { id: 'c5', name: '9th B', category: 'secondary' },
  { id: 'c6', name: '10th', category: 'secondary' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 'BREAK', 5, 6, 7, 8];

const generateEmptyGrid = () => {
  const grid = {};

  // Primary prepopulation mapping based on attached images
  const pMap = {
    'cp1': { // NURSERY+LKG
      1: { s: 'Eng', t: 'tp1' }, 2: { s: 'Maths', t: 'tp2' }, 3: { s: 'Activity', t: 'tp1' },
      4: { s: 'Art', t: 'tp2', w: { Wednesday: { s: 'Game', t: 'tp2' }, Thursday: { s: 'Game', t: 'tp1' }, Friday: { s: 'Game', t: 'tp1' } } },
      5: { s: 'Hindi', t: 'tp1' }, 6: { s: 'Conv.', t: 'tp3', w: { Wednesday: { s: 'Rhyme', t: 'tp2' }, Thursday: { s: 'Rhyme', t: 'tp1' }, Friday: { s: 'Rhyme', t: 'tp1' } } }
    },
    'cp2': { // U.K.G.
      1: { s: 'Maths', t: 'tp2' }, 2: { s: 'Eng', t: 'tp1' }, 3: { s: 'Hindi', t: 'tp5' },
      4: { s: 'Activity', t: 'tp2' }, 5: { s: 'Conv.', t: 'tp3', w: { Wednesday: { s: 'G.K', t: 'tp2' }, Thursday: { s: 'Art', t: 'tp1' }, Friday: { s: 'Art', t: 'tp1' } } },
      6: { s: 'Hindi', t: 'tp5' }
    },
    'cp3': { // 1ST
      1: { s: 'EVS', t: 'tp4' }, 2: { s: 'Hindi', t: 'tp1' }, 3: { s: 'Maths', t: 'tp5', w: { Monday: { s: 'Hindi', t: 'tp5' } } },
      4: { s: 'Maths', t: 'tp5' }, 5: { s: 'Art', t: 'tp2', w: { Wednesday: { s: 'Game', t: 'tp3' }, Thursday: { s: 'Game', t: 'tp3' }, Friday: { s: 'Game', t: 'tp3' } } },
      6: { s: 'Eng', t: 'tp4' }, 7: { s: 'Conv.', t: 'tp1', w: { Thursday: { s: 'Rhyme', t: 'tp1' }, Friday: { s: 'Rhyme', t: 'tp1' } } }
    },
    'cp4': { // 2ND
      1: { s: 'Maths', t: 'tp5' }, 2: { s: 'G.K', t: 'tp6', w: { Tuesday: { s: 'Art', t: 'tp6' }, Wednesday: { s: 'Art', t: 'tp6' }, Thursday: { s: 'Game', t: 'tp6' }, Friday: { s: 'Game', t: 'tp6' } } },
      3: { s: 'Eng', t: 'tp4' }, 4: { s: 'Hindi', t: 'tp5' }, 5: { s: 'Comp.', t: 'tp6', w: { Thursday: { s: 'Hindi', t: 'tp5' }, Friday: { s: 'Eng', t: 'tp4' } } },
      6: { s: 'Conv.', t: 'tp6', w: { Wednesday: { s: 'Comp.', t: 'tp6' }, Thursday: { s: 'Comp.', t: 'tp6' }, Friday: { s: 'Comp.', t: 'tp6' } } }, 7: { s: 'EVS', t: 'tp4' }
    },
    'cp5': { // 3RD
      1: { s: 'Hindi', t: 'tp7' }, 2: { s: 'Eng', t: 'tp4' }, 3: { s: 'Comp.', t: 'tp3', w: { Thursday: { s: 'Art', t: 'tp2' }, Friday: { s: 'Art', t: 'tp2' } } },
      4: { s: 'EVS', t: 'tp4' }, 5: { s: 'Maths', t: 'tp5' }, 6: { s: 'Conv.', t: 'tp3', w: { Wednesday: { s: 'G.K', t: 'tp3' }, Thursday: { s: 'Game', t: 'tp3' }, Friday: { s: 'Game', t: 'tp3' } } }
    },
    'cp6': { // 4TH
      1: { s: 'Eng', t: 'tp4' }, 2: { s: 'Maths', t: 'tp3' }, 3: { s: 'Science', t: 'tp6' },
      4: { s: 'Hindi', t: 'tp7' }, 5: { s: 'Skt.', t: 'tp8', w: { Wednesday: { s: 'Comp.', t: 'tp3' }, Thursday: { s: 'Comp.', t: 'tp3' }, Friday: { s: 'Comp.', t: 'tp3' } } },
      6: { s: 'Art', t: 'tp2' }, 7: { s: 'S.St', t: 'tp6' }
    },
    'cp7': { // 5TH
      1: { s: 'Science', t: 'tp6' }, 2: { s: 'Eng', t: 'tp9' }, 3: { s: 'Skt.', t: 'tp7', w: { Wednesday: { s: 'Comp.', t: 'tp3' }, Thursday: { s: 'Comp.', t: 'tp3' }, Friday: { s: 'Comp.', t: 'tp3' } } },
      4: { s: 'S.St', t: 'tp11' }, 5: { s: 'Hindi', t: 'tp10' }, 6: { s: 'Maths', t: 'tp10' }, 7: { s: 'Hindi', t: 'tp7', w: { Wednesday: { s: 'Skt.', t: 'tp10' }, Thursday: { s: 'Skt.', t: 'tp10' }, Friday: { s: 'Skt.', t: 'tp10' } } }
    }
  };

  days.forEach(day => {
    periods.forEach(p => {
      if (p !== 'BREAK') {
        initialClasses.forEach(c => {
          let tId = null;
          let sub = null;

          if (c.category === 'primary' && day !== 'Saturday' && pMap[c.id] && pMap[c.id][p]) {
            const base = pMap[c.id][p];
            if (base.w && base.w[day]) {
              tId = base.w[day].t;
              sub = base.w[day].s;
            } else {
              tId = base.t;
              sub = base.s;
            }
          }

          grid[`${day}-${p}-${c.id}`] = {
            id: `${day}-${p}-${c.id}`,
            day,
            period: p,
            classId: c.id,
            teacherId: tId,
            subject: sub,
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
      activeSegment: 'secondary',
      // Subject period requirements: { classId: { subject: minPeriodsPerWeek } }
      subjectRequirements: {},
      setActiveSegment: (segment) => set({ activeSegment: segment }),

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

      migratePrimaryData: () => set((state) => {
        const newTimetable = { ...state.timetable };
        const missingGridElements = generateEmptyGrid();
        let changed = false;
        Object.keys(missingGridElements).forEach(k => {
          if (!newTimetable[k]) {
            newTimetable[k] = missingGridElements[k];
            changed = true;
          }
        });

        let newClasses = [...state.classes];
        initialClasses.forEach(ic => {
          if (!newClasses.find(c => c.id === ic.id)) {
            newClasses.push(ic);
            changed = true;
          }
        });

        let newTeachers = [...state.teachers];
        initialTeachers.forEach(it => {
          if (!newTeachers.find(t => t.id === it.id)) {
            newTeachers.push(it);
            changed = true;
          }
        });

        if (changed) {
          return { timetable: newTimetable, classes: newClasses, teachers: newTeachers };
        }
        return state;
      }),

      addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, { ...teacher, id: 't' + Date.now() }] })),
      removeTeacher: (id) => set((state) => ({ teachers: state.teachers.filter(t => t.id !== id) })),

      addClass: (cls) => set((state) => ({ classes: [...state.classes, { ...cls, id: 'c' + Date.now() }] })),
      removeClass: (id) => set((state) => ({ classes: state.classes.filter(c => c.id !== id) })),

      // Subject requirements management
      setSubjectRequirement: (classId, subject, minPeriods) => set((state) => {
        const newReqs = { ...state.subjectRequirements };
        if (!newReqs[classId]) {
          newReqs[classId] = {};
        }
        if (minPeriods <= 0) {
          delete newReqs[classId][subject];
          if (Object.keys(newReqs[classId]).length === 0) {
            delete newReqs[classId];
          }
        } else {
          newReqs[classId][subject] = minPeriods;
        }
        return { subjectRequirements: newReqs };
      }),

      getSubjectRequirement: (classId, subject) => {
        const { subjectRequirements } = get();
        return subjectRequirements[classId]?.[subject] || 0;
      },

      getClassRequirements: (classId) => {
        const { subjectRequirements } = get();
        return subjectRequirements[classId] || {};
      },

      getSubjectActualPeriods: (classId, subject) => {
        const { timetable } = get();
        return Object.values(timetable).filter(
          cell => cell.classId === classId && cell.subject === subject
        ).length;
      }
    }),
    {
      name: 'timetable-storage', // localstorage key
    }
  )
);
