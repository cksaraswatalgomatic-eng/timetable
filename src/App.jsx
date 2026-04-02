import React, { useState } from 'react';
import { useTimetableStore } from './store/useTimetableStore';
import { MultiSelectProvider } from './store/MultiSelectContext';
import TimeTableGrid from './components/TimeTableGrid';
import TeacherReport from './components/TeacherReport';
import ClassWeekFull from './components/ClassWeekFull';
import { ToastProvider } from './components/ToastProvider';
import { useToast } from './components';
import { Calendar, Users, LayoutDashboard, Sun, Moon, Download, Upload, Trash2 } from 'lucide-react';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('timetable');
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme === 'dark';
  });
  const [selectedClass, setSelectedClass] = useState(null);
  
  const { clearTimetable, timetable } = useTimetableStore();
  const toast = useToast();

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  // Export data
  const exportData = () => {
    const data = localStorage.getItem('timetable-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetable-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Timetable exported successfully!');
    }
  };

  // Import data
  const importData = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          JSON.parse(e.target?.result);
          localStorage.setItem('timetable-storage', e.target?.result);
          window.location.reload();
        } catch {
          toast.error('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Clear timetable with confirmation
  const handleClearTimetable = () => {
    if (window.confirm('Are you sure you want to reset the entire timetable? This action cannot be undone.')) {
      clearTimetable();
      toast.success('Timetable has been reset');
    }
  };

  // Quick stats
  const totalPeriods = Object.values(timetable).length;
  const filledPeriods = Object.values(timetable).filter(c => c.teacherId).length;
  const fillRate = totalPeriods ? Math.round((filledPeriods / totalPeriods) * 100) : 0;

  // If a class is selected for full view, show that
  if (selectedClass) {
    return (
      <ClassWeekFull 
        classData={selectedClass} 
        onBack={() => setSelectedClass(null)} 
      />
    );
  }

  return (
    <div className="app-container flex">
      <aside className="sidebar glass-strong">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Calendar size={28} className="text-primary" />
          </div>
          <div>
            <h2>TimeTable Pro</h2>
            <span className="sidebar-subtitle">School Scheduler</span>
          </div>
        </div>

        <nav className="sidebar-nav flex-col gap-2 mt-6">
          <button
            className={`nav-btn ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            <LayoutDashboard size={20} />
            <span>Schedule</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            <Users size={20} />
            <span>Teacher Loads</span>
          </button>
        </nav>

        {/* Quick Stats Widget */}
        <div className="quick-stats glass mt-6">
          <h4 className="stats-title">Today's Overview</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value text-primary">{filledPeriods}</span>
              <span className="stat-label">Filled</span>
            </div>
            <div className="stat-item">
              <span className="stat-value text-muted">{totalPeriods - filledPeriods}</span>
              <span className="stat-label">Empty</span>
            </div>
            <div className="stat-item full-width">
              <span className={`stat-value ${fillRate >= 80 ? 'text-success' : fillRate >= 50 ? 'text-warning' : 'text-danger'}`}>
                {fillRate}%
              </span>
              <span className="stat-label">Fill Rate</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer mt-auto">
          <p className="text-xs text-muted">Data persists locally automatically.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header glass">
          <div className="header-left items-center gap-4 flex">
            <h1>{activeTab === 'timetable' ? 'Class Schedules' : 'Teacher Utilization'}</h1>
          </div>
          
          <div className="header-right items-center gap-2 flex">
            {/* Import/Export */}
            <label className="btn btn-secondary btn-sm" title="Import data">
              <Upload size={16} />
              <span className="hidden-mobile">Import</span>
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-secondary btn-sm" onClick={exportData} title="Export data">
              <Download size={16} />
              <span className="hidden-mobile">Export</span>
            </button>
            
            {/* Theme Toggle */}
            <button className="btn btn-secondary btn-sm theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            {/* Clear Timetable */}
            <button className="btn btn-danger btn-sm" onClick={handleClearTimetable} title="Reset timetable">
              <Trash2 size={16} />
              <span className="hidden-mobile">Reset</span>
            </button>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'timetable' ? (
            <TimeTableGrid onClassClick={setSelectedClass} />
          ) : (
            <TeacherReport />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <MultiSelectProvider>
        <AppContent />
      </MultiSelectProvider>
    </ToastProvider>
  );
}

export default App;
