import React, { useState } from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { useTimetableStore as store } from '../store/useTimetableStore';
import { Target } from 'lucide-react';
import './SubjectRequirements.css';

export default function SubjectRequirements() {
    const { classes, setSubjectRequirement, getClassRequirements, getSubjectActualPeriods } = useTimetableStore();
    const [selectedSegment, setSelectedSegment] = useState('secondary');

    const segmentClasses = classes.filter(c => (c.category || 'secondary') === selectedSegment);

    // Collect all subjects
    const allSubjects = new Set();
    segmentClasses.forEach(cls => {
        const reqs = getClassRequirements(cls.id);
        Object.keys(reqs).forEach(s => allSubjects.add(s));

        Object.values(store.getState().timetable)
            .filter(cell => cell.classId === cls.id && cell.subject)
            .forEach(cell => allSubjects.add(cell.subject));
    });

    const subjects = Array.from(allSubjects).sort();

    return (
        <div className="subject-requirements-page">
            <div className="page-header glass">
                <div className="header-content">
                    <div className="header-icon">
                        <Target size={32} />
                    </div>
                    <div>
                        <h1>Subject Requirements</h1>
                        <p>Configure minimum periods per week for each subject across all classes</p>
                    </div>
                </div>
            </div>

            {/* Segment Selector */}
            <div className="segment-selector-bar glass">
                <button
                    className={`segment-tab ${selectedSegment === 'primary' ? 'active' : ''}`}
                    onClick={() => setSelectedSegment('primary')}
                >
                    <span className="segment-label">Primary</span>
                    <span className="segment-range">Nursery - 5th</span>
                </button>
                <button
                    className={`segment-tab ${selectedSegment === 'secondary' ? 'active' : ''}`}
                    onClick={() => setSelectedSegment('secondary')}
                >
                    <span className="segment-label">Secondary</span>
                    <span className="segment-range">6th - 10th</span>
                </button>
            </div>

            {/* Matrix Table */}
            <div className="matrix-container glass">
                <div className="matrix-header-bar">
                    <h2>
                        {selectedSegment === 'primary' ? 'Primary' : 'Secondary'} Classes - Requirements Matrix
                    </h2>
                    <div className="matrix-legend">
                        <span className="legend-item met">
                            <span className="legend-dot"></span>
                            Met
                        </span>
                        <span className="legend-item deficit">
                            <span className="legend-dot"></span>
                            Deficit
                        </span>
                        <span className="legend-item no-req">
                            <span className="legend-dot"></span>
                            Not Set
                        </span>
                    </div>
                </div>

                <div className="matrix-scroll-wrapper">
                    <table className="requirements-matrix">
                        <thead>
                            <tr>
                                <th className="sticky-subject-col">Subject</th>
                                {segmentClasses.map(cls => (
                                    <th key={cls.id} className="class-header-col">
                                        {cls.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => (
                                <tr key={subject}>
                                    <td className="sticky-subject-cell subject-name">
                                        {subject}
                                    </td>
                                    {segmentClasses.map(cls => {
                                        const required = getClassRequirements(cls.id)[subject] || 0;
                                        const actual = getSubjectActualPeriods(cls.id, subject);
                                        const isMet = required === 0 || actual >= required;
                                        const hasRequirement = required > 0;

                                        return (
                                            <td
                                                key={cls.id}
                                                className={`matrix-cell 
                                                    ${!hasRequirement ? 'state-no-req' : ''} 
                                                    ${hasRequirement && !isMet ? 'state-deficit' : ''} 
                                                    ${hasRequirement && isMet ? 'state-met' : ''}`}
                                            >
                                                <div className="cell-inner">
                                                    <div className="cell-requirement">
                                                        <label>Req:</label>
                                                        <input
                                                            type="number"
                                                            value={required || ''}
                                                            onChange={(e) => setSubjectRequirement(
                                                                cls.id,
                                                                subject,
                                                                parseInt(e.target.value) || 0
                                                            )}
                                                            min="0"
                                                            max="40"
                                                            className="req-input"
                                                            placeholder="-"
                                                        />
                                                    </div>
                                                    <div className="cell-actual">
                                                        <span className={`actual-number ${hasRequirement && !isMet ? 'is-deficit' : ''}`}>
                                                            {actual}
                                                        </span>
                                                        <span className="actual-text">actual</span>
                                                    </div>
                                                    {hasRequirement && !isMet && (
                                                        <div className="status-indicator deficit-indicator">
                                                            -{required - actual}
                                                        </div>
                                                    )}
                                                    {hasRequirement && isMet && (
                                                        <div className="status-indicator met-indicator">
                                                            ✓
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
