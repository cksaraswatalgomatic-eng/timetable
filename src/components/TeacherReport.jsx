import React from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { CheckCircle2, AlertTriangle, UserX } from 'lucide-react';
import './TeacherReport.css';

export default function TeacherReport() {
    const { teachers, getTeacherLoad, timetable } = useTimetableStore();

    const getLoadStatus = (assigned, max) => {
        const ratio = assigned / max;
        if (assigned === 0) return { label: 'Empty Load', color: 'danger', status: 'empty', icon: <UserX size={16} /> };
        if (ratio < 0.4) return { label: 'Underutilized', color: 'warning', status: 'warning', icon: <AlertTriangle size={16} /> };
        if (ratio > 0.95) return { label: 'Overloaded', color: 'danger', status: 'danger', icon: <AlertTriangle size={16} /> };
        return { label: 'Optimum', color: 'success', status: 'optimum', icon: <CheckCircle2 size={16} /> };
    };

    // Find empty periods across the whole school (missing teachers)
    const emptyPeriods = Object.values(timetable).filter(c => !c.teacherId).length;
    const totalPeriods = Object.values(timetable).length;
    const fillRate = totalPeriods ? ((totalPeriods - emptyPeriods) / totalPeriods * 100).toFixed(1) : 0;

    return (
        <div className="teacher-report flex-col gap-4">
            <div className="summary-cards">
                <div className="summary-card">
                    <h3 className="text-muted">Total Teachers</h3>
                    <div className="summary-val">{teachers.length}</div>
                </div>
                <div className="summary-card">
                    <h3 className="text-muted">Empty Slot Alerts</h3>
                    <div className={`summary-val ${emptyPeriods > 0 ? 'text-danger' : 'text-success'}`}>{emptyPeriods}</div>
                </div>
                <div className="summary-card">
                    <h3 className="text-muted">School Fill Rate</h3>
                    <div className="summary-val">{fillRate}%</div>
                </div>
            </div>

            <div className="glass p-6">
                <h2>Teacher Utilization Dashboard</h2>
                <p className="text-muted mb-4">Review and optimize teacher loading. Colors indicate optimum utilization or risks.</p>

                <div className="teacher-list">
                    {teachers.map(teacher => {
                        const assigned = getTeacherLoad(teacher.id);
                        const status = getLoadStatus(assigned, teacher.maxPeriods);
                        const percent = Math.min((assigned / teacher.maxPeriods) * 100, 100);

                        return (
                            <div 
                                key={teacher.id} 
                                className="teacher-load-card"
                                data-status={status.status}
                            >
                                <div className="teacher-info justify-between items-center flex">
                                    <div>
                                        <h3>{teacher.name}</h3>
                                        <span className="text-muted">Subjects: {teacher.allowedSubjects.join(', ')}</span>
                                    </div>
                                    <div className={`status-badge bg-${status.color}`}>
                                        {status.icon} {status.label}
                                    </div>
                                </div>

                                <div className="load-bar-container">
                                    <div className="justify-between flex items-center">
                                        <span>Periods Assigned: <strong>{assigned}</strong></span>
                                        <span>Max: {teacher.maxPeriods}</span>
                                    </div>
                                    <div className="progress-bg">
                                        <div
                                            className={`progress-fill fill-${status.color}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
