import React from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import './TeacherDetail.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TeacherDetail({ teacherId, onBack }) {
    const { teachers, timetable, classes } = useTimetableStore();
    
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (!teacher) {
        return (
            <div className="teacher-detail-error">
                <h2>Teacher not found</h2>
                <button className="btn btn-primary" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>
        );
    }

    // Get all assignments for this teacher
    const teacherAssignments = Object.values(timetable).filter(cell => cell.teacherId === teacherId);
    const assignedCount = teacherAssignments.length;
    const utilizationRate = Math.round((assignedCount / teacher.maxPeriods) * 100);
    
    // Get utilization status
    const getUtilizationStatus = () => {
        if (assignedCount === 0) return { label: 'No Assignments', color: 'danger', icon: <AlertTriangle size={20} /> };
        if (utilizationRate < 40) return { label: 'Underutilized', color: 'warning', icon: <AlertTriangle size={20} /> };
        if (utilizationRate > 95) return { label: 'Overloaded', color: 'danger', icon: <AlertTriangle size={20} /> };
        return { label: 'Optimum', color: 'success', icon: <CheckCircle2 size={20} /> };
    };

    const status = getUtilizationStatus();

    // Get assignments by day and period
    const getAssignment = (day, period) => {
        return teacherAssignments.find(cell => cell.day === day && cell.period === period);
    };

    // Get unique classes taught
    const classesTaught = [...new Set(teacherAssignments.map(a => a.classId))];
    const classesList = classes.filter(c => classesTaught.includes(c.id));

    // Get unique subjects taught
    const subjectsTaught = [...new Set(teacherAssignments.map(a => a.subject))].filter(Boolean);

    return (
        <div className="teacher-detail-page">
            {/* Header */}
            <div className="teacher-detail-header glass">
                <button className="btn btn-secondary back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Reports
                </button>
                
                <div className="teacher-detail-title">
                    <div className="teacher-avatar">
                        {teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                        <h1>{teacher.name}</h1>
                        <p className="teacher-subjects-list">
                            {teacher.allowedSubjects.join(' • ')}
                        </p>
                    </div>
                </div>

                <div className="teacher-stats-row">
                    <div className="stat-item">
                        <Clock size={20} />
                        <div>
                            <span className="stat-value">{assignedCount}</span>
                            <span className="stat-label">of {teacher.maxPeriods} periods</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <Calendar size={20} />
                        <div>
                            <span className="stat-value">{classesList.length}</span>
                            <span className="stat-label">classes</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className={`status-badge bg-${status.color}`}>
                            {status.icon}
                            {status.label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Utilization Bar */}
            <div className="utilization-bar-container glass">
                <div className="utilization-header">
                    <span>Weekly Utilization</span>
                    <span className="utilization-percent">{utilizationRate}%</span>
                </div>
                <div className="utilization-progress">
                    <div 
                        className={`progress-fill fill-${status.color}`}
                        style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                    />
                </div>
                <div className="utilization-details">
                    <span>{assignedCount} periods assigned</span>
                    <span>{teacher.maxPeriods - assignedCount} periods available</span>
                </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="teacher-weekly-schedule glass">
                <div className="schedule-header">
                    <h2>Weekly Schedule</h2>
                    {subjectsTaught.length > 0 && (
                        <div className="subjects-taught">
                            <span>Teaching:</span>
                            {subjectsTaught.map(subject => (
                                <span key={subject} className="subject-pill">{subject}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="schedule-grid-wrapper">
                    <table className="teacher-schedule-table">
                        <thead>
                            <tr>
                                <th className="day-col">Day</th>
                                {periods.map((p) => (
                                    <th key={p} className="period-col">
                                        <span className="period-label">P</span>
                                        <span className="period-number">{p}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => {
                                const dayAssignments = teacherAssignments.filter(a => a.day === day);
                                const hasClassToday = dayAssignments.length > 0;
                                
                                return (
                                    <tr key={day} className={!hasClassToday ? 'no-class-day' : ''}>
                                        <td className="day-cell">
                                            <strong>{day}</strong>
                                            {hasClassToday && (
                                                <span className="class-count">{dayAssignments.length} periods</span>
                                            )}
                                        </td>
                                        {periods.map((p) => {
                                            const assignment = getAssignment(day, p);
                                            return (
                                                <td key={p} className={`schedule-cell ${assignment ? 'has-assignment' : 'free-period'}`}>
                                                    {assignment ? (
                                                        <div className="assignment-content">
                                                            <span className="assignment-class">{classes.find(c => c.id === assignment.classId)?.name}</span>
                                                            <span className="assignment-subject">{assignment.subject}</span>
                                                            {assignment.isOverride && (
                                                                <span className="override-indicator">OVR</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="free-text">Free</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Classes Summary */}
            {classesList.length > 0 && (
                <div className="teacher-classes-summary glass">
                    <h2>Classes Assigned</h2>
                    <div className="classes-grid">
                        {classesList.map(cls => {
                            const classPeriods = teacherAssignments.filter(a => a.classId === cls.id).length;
                            return (
                                <div key={cls.id} className="class-summary-card">
                                    <div className="class-name">{cls.name}</div>
                                    <div className="class-periods">{classPeriods} periods/week</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
