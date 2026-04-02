# School Time Table Web Application - Implementation Plan

## Goal Description
Create a dynamic web application to plan and manage school timetables for classes ranging from KG1 to 10th grade. The app will allow administrators to manage teachers, subjects, and class schedules through an intuitive, interactive drag-and-drop interface. It will also track teacher workloads and class subject distributions to ensure constraints are met.

## Key Requirements Extracted
Based on the provided details and images, the platform needs:
1. **Grades/Classes**: KG1, KG2, 1st to 10th (with sections like A and B for certain classes, e.g., 9th A, 9th B).
2. **Time Grid**: 8 periods per day, with a break after the 4th period.
3. **Core Inputs**:
   - **Teachers**: Name, subjects they can teach, max periods per week.
   - **Classes**: Allowed maximum periods per subject per week (e.g., Math 6 periods/week).
4. **Dynamic Engine & UI**:
   - For each cell, there should be an editable state with relevant dropdowns to assign/reassign teachers and subjects dynamically. It should be possible to override cells or replace a teacher allocation (e.g., if a teacher is absent/sick).
   - A dedicated report for tracking the loading of teachers. The system should highlight and design the optimum loading and best utilization per teacher and for the class.
   - Empty periods must be clearly highlighted.
   - The UI/UX should be built to a top-level, premium standard.
   - Use Local Storage to keep the context and persist data context locally.
   - Prevent conflicts (e.g., a teacher cannot be assigned to two classes simultaneously, unless explicitly overridden).

## Technical Stack
- **Framework**: Frontend framework (React via Vite) for building the interactive UI and managing complex state.
- **Styling**: Vanilla CSS with modern features (CSS variables, flexbox, grid, glassmorphism) to create a premium, responsive aesthetic as per the guidelines. No Tailwind unless explicitly requested.
- **Drag & Drop**: `@hello-pangea/dnd` for fluid and accessible drag-and-drop interactions.
- **State Management**: `zustand` to easily manage and share the complex state of the timetable, teacher loads, and validations without boilerplate.

## Data Model (Proposed)
```javascript
// Example Teacher Entity
{
  id: 't1',
  name: 'Kamal Sharma',
  allowedSubjects: ['Maths'],
  maxPeriodsPerWeek: 35,
  assignedPeriods: 0, // Calculated dynamically
}

// Example Class Entity
{
  id: 'class_9A',
  name: '9th (A)',
  subjectLimits: { 'Maths': 6, 'Science': 6, 'English': 5 /* ... */ }
}

// Example TimeTable Cell Entity
{
  id: 'period_1_monday_class_9A',
  classId: 'class_9A',
  day: 'Monday',
  periodIndex: 1, // 1 to 8
  subject: 'Maths',
  teacherId: 't1' // Kamal Sharma
}
```

## User Review Required
> [!IMPORTANT]
> **Days of the Week:** Should we implement a 6-day week (Mon-Sat) based on standard Indian school systems?

## Proposed Changes and Development Phases

### Phase 1: Setup & Design System
- Initialize Vite React project.
- Implement global CSS, typography, and color palette (premium aesthetic, dark/light capability).
- Build base UI components (Cards, Modals, Buttons).

### Phase 2: Core Data & State Management
- Setup global state store for Teachers, Classes, Subjects, and the Timetable schedule.
- Implement logic for calculating teacher workload (`assignedPeriods` vs `maxPeriodsPerWeek`).
- Implement logic for class subject tracking.

### Phase 3: Main UI Views
- **Teacher Management View**: Add/edit teachers, specify subjects, view current loading.
- **Class Configuration View**: Define subject quotas for each class.
- **Timetable Grid View (The Core)**: Render the grid (Periods vs Classes).

### Phase 4: Drag & Drop Interaction
- Make periods draggable.
- Implement drop validation (check for double booking, max periods limit).
- Update loading graphs and indicators on drop.

### Phase 5: Polish & Analytics
- Add premium micro-animations to UI elements.
- Create dashboard widgets showing "Underloaded Teachers" or "Missing Subjects".

## Verification Plan
### Manual Verification
- Will add initial teachers matching the images and test drag-drop constraints.
