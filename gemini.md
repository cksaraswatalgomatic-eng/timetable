# TimeTable Pro - Project Documentation

## Overview
**TimeTable Pro** is a modern, responsive web application designed for school administrators to dynamically manage and plan class schedules, assign teachers, and monitor teacher utilization. It incorporates a premium glassmorphism user interface with robust offline-first functionality.

## Tech Stack
* **Framework:** React + Vite
* **State Management:** Zustand (with Local Storage Persistence)
* **Styling:** Vanilla CSS (employing CSS Variables, Glassmorphism, CSS Grid/Flexbox)
* **Icons:** `lucide-react`

## Core Features
1. **Interactive Schedule Editor:**
   * View the schedule for all classes simultaneously or click into a specific class for a weekly view using `ClassWeekFull`.
   * Click any cell to assign/reassign a teacher and subject. 
   * Provides visual warnings for teacher clashes (double-bookings).
   * **Keyboard Shortcuts:** Press `Enter` to quickly save an edited cell or `Escape` to cancel.
   
2. **Dynamic Teacher Utilization Dashboard:**
   * Tracks assigned periods vs. maximum allowed periods for each teacher.
   * Auto-categorizes teachers into states: *Empty Load*, *Underutilized*, *Optimum*, and *Overloaded*.
   * Visual progress bars map the specific load ratio dynamically.

3. **Data Management:**
   * Context state fully persists in browser Local Storage.
   * Built-in functionality to **Import** and **Export** the JSON state to/from a local file, allowing admins to safely backup or share timetables.
   * Capability to completely reset the timetable state securely.

4. **Premium UI/UX System:**
   * Dynamic **Light/Dark Mode** toggling via CSS variable cascading (`data-theme="dark"`).
   * Subject-specific color coding allowing administrators to visually distinguish subjects instantly (e.g., Science is Green, Maths is Blue, English is Orange).
   * Animated transitions, hover states, shimmer effects on empty periods, and responsive grid reflows for mobile/tablet.

## Architecture & Components
* `App.jsx` - Main application shell, handling Sidebar, Header (theme, import/export), and rendering the active tab (Schedule vs Teachers).
* `store/useTimetableStore.js` - Zustand store containing the source of truth for Teachers, Classes, the generated TimeTable grid, and conflict validation logic.
* **Key Components:**
  * `TimeTableGrid`: Main dashboard displaying all classes and periods.
  * `TimeTableCell`: Individual, interactive blocks within the grid handling their own active editing state and dropdown configurations.
  * `TeacherReport`: Separate view visualizing data aggregates on teacher workloads.
  * `ClassWeekFull`: Deep-dive view replacing the main grid for a focused class schedule.
  * `ToastProvider`: App-level context for firing success and error notifications.

## Future Extensibility
The application's data boundaries are cleanly separated within Zustand, allowing straightforward migration from `localStorage` to a backend database (e.g., Firebase, Supabase) in the future without disrupting the UI layer.
