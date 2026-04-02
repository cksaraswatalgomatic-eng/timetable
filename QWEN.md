# School Timetable Web Application

## Project Overview

A dynamic web application for planning and managing school timetables for classes ranging from KG1 to 10th grade. Built with **React 19** and **Vite**, it provides an intuitive interface for administrators to manage teachers, subjects, and class schedules with real-time validation and conflict detection.

### Key Features

- **Interactive Timetable Grid**: Drag-and-drop interface for assigning teachers/subjects to class periods
- **Teacher Management**: Track teacher workloads, allowed subjects, and max periods per week
- **Class Configuration**: Define classes with subject quotas and period distributions
- **Conflict Detection**: Prevents double-booking teachers across simultaneous periods
- **Override Mode**: Allows manual replacement of teacher allocations (e.g., for absences)
- **Teacher Utilization Report**: Dashboard showing workload status (Underutilized/Optimum/Overloaded)
- **Local Persistence**: All data persists automatically via localStorage using Zustand
- **Premium UI**: Glassmorphism design with dark/light theme support

### Technical Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2.4 |
| Build Tool | Vite 8.0.1 |
| State Management | Zustand 5.0.12 (with persist middleware) |
| Drag & Drop | @hello-pangea/dnd 18.0.1 |
| Icons | Lucide React 1.7.0 |
| Utilities | clsx 2.1.1 |
| Styling | Vanilla CSS (CSS variables, flexbox, grid, glassmorphism) |
| Linting | ESLint 9 with react-hooks and react-refresh plugins |

## Project Structure

```
D:\Project\Timetable\
├── src/
│   ├── components/
│   │   ├── TimeTableGrid.jsx    # Main grid view (days × periods × classes)
│   │   ├── TimeTableCell.jsx    # Individual cell with edit/override modes
│   │   ├── TeacherReport.jsx    # Teacher utilization dashboard
│   │   └── *.css                # Component styles
│   ├── store/
│   │   └── useTimetableStore.js # Zustand store with persistence
│   ├── App.jsx                  # Main app with sidebar navigation
│   ├── App.css                  # Layout styles
│   ├── index.css                # Global styles, CSS variables, theme
│   └── main.jsx                 # Entry point
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── docs/
│   └── implementation_plan.md   # Detailed requirements and roadmap
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Building and Running

### Development

```bash
npm run dev
```
Starts Vite dev server with HMR (Hot Module Replacement).

### Production Build

```bash
npm run build
```
Creates optimized production bundle in `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Data Model

### Teacher Entity
```javascript
{
  id: 't1',
  name: 'Kamal Sharma',
  allowedSubjects: ['Science', 'Maths'],
  maxPeriods: 36  // Max periods per week
}
```

### Class Entity
```javascript
{
  id: 'c1',
  name: '6th'
}
```

### Timetable Cell Entity
```javascript
{
  id: 'Monday-1-c1',
  day: 'Monday',
  period: 1,
  classId: 'c1',
  teacherId: 't1',
  subject: 'Maths',
  isOverride: false
}
```

## State Management (Zustand Store)

The store (`src/store/useTimetableStore.js`) provides:

### Actions
- `assignCell(cellId, teacherId, subject)` - Standard assignment
- `overrideCell(cellId, teacherId, subject)` - Override mode (replaces without conflict warning)
- `clearCell(cellId)` - Clear a cell
- `getTeacherLoad(teacherId)` - Get assigned periods count for a teacher
- `getPeriodConflicts(day, periodIndex, teacherId)` - Check for double-booking
- `clearTimetable()` - Reset entire grid
- `addTeacher(teacher)` / `removeTeacher(id)` - Teacher CRUD
- `addClass(cls)` / `removeClass(id)` - Class CRUD

### Persistence
Data is automatically saved to localStorage under the key `timetable-storage`.

## Development Conventions

### Code Style
- **ESLint**: Configured with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Exports**: Default exports for components, named exports for utilities
- **CSS**: Utility classes (`.flex`, `.gap-2`, etc.) combined with component-specific styles

### Component Patterns
- Custom hooks/store accessed at top of component
- Local state for UI interactions (editing modes)
- Glassmorphism utility class for consistent card styling
- Lucide icons for visual indicators

### Testing Practices
- No test framework currently configured
- Manual verification via UI recommended
- Implementation plan mentions testing drag-drop constraints

## UI/UX Features

### Design System
- **Font**: Inter (Google Fonts)
- **Color Palette**: Indigo primary, semantic colors for status (danger/warning/success)
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
- **Responsive**: Sidebar layout with scrollable content area

### Visual Indicators
- **Empty cells**: Red background with dashed border
- **Conflict cells**: Yellow border with warning icon
- **Override cells**: Dashed yellow border with "OVR" badge
- **Teacher load bars**: Color-coded progress (green=optimum, yellow=underutilized, red=overloaded/empty)

## Known Configuration

### Default Data (Mock)
- **Teachers**: 9 pre-configured teachers with subjects and 36 max periods
- **Classes**: 6th, 7th, 8th, 9th A, 9th B, 10th
- **Days**: Monday to Saturday (6-day week)
- **Periods**: 8 per day with break after period 4

### Pending Decisions (from implementation_plan.md)
- 6-day week implementation based on Indian school systems (currently implemented)

## Useful Commands Summary

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## LocalStorage Key

Data persists under: `timetable-storage`

To clear all data manually in browser console:
```javascript
localStorage.removeItem('timetable-storage')
```
