import React, { useEffect } from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { useMultiSelect } from '../store/MultiSelectContext';
import TimeTableCell from './TimeTableCell';
import BulkEditPanel from './BulkEditPanel';
import { ChevronRight, MousePointer2, CheckSquare } from 'lucide-react';
import './TimeTableGrid.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 'BREAK', 5, 6, 7, 8];

export default function TimeTableGrid({ onClassClick }) {
    const { classes, activeSegment, setActiveSegment } = useTimetableStore();
    const [selectedDay, setSelectedDay] = React.useState('Monday');
    const { isEnabled, selectedCells, endDrag, clearSelection, toggleEnabled, containerRef } = useMultiSelect();

    const filteredClasses = classes.filter(c => (c.category || 'secondary') === activeSegment);

    // Global mouse up to end drag
    useEffect(() => {
        const handleMouseUp = () => {
            endDrag();
        };

        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [endDrag]);

    return (
        <div className="timetable-container glass flex-col" ref={containerRef}>
            <div className="timetable-header items-center justify-between p-4 flex">
                <div>
                    <h2 style={{ margin: 0 }}>Class Schedule Editor</h2>
                    <p className="text-muted text-sm mt-2" style={{ margin: 0 }}>
                        {isEnabled
                            ? `Drag to select multiple cells • Ctrl+Click to toggle • ${selectedCells.length} selected`
                            : 'Click on a class name to view full week timetable'}
                    </p>
                </div>

                <div className="header-actions items-center gap-2 flex">
                    <div className="segment-toggle flex gap-2 mr-2">
                        <button
                            className={`btn btn-sm ${activeSegment === 'primary' ? 'btn-primary' : 'btn-secondary'} glass`}
                            onClick={() => setActiveSegment('primary')}
                        >
                            Primary
                        </button>
                        <button
                            className={`btn btn-sm ${activeSegment === 'secondary' ? 'btn-primary' : 'btn-secondary'} glass`}
                            onClick={() => setActiveSegment('secondary')}
                        >
                            Secondary
                        </button>
                    </div>

                    {/* Multi-select toggle */}
                    <button
                        className={`btn btn-sm ${isEnabled ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => {
                            clearSelection();
                            toggleEnabled();
                        }}
                        title="Enable multi-select mode"
                    >
                        {isEnabled ? <CheckSquare size={16} /> : <MousePointer2 size={16} />}
                        <span className="hidden-mobile">
                            {isEnabled ? `Selecting (${selectedCells.length})` : 'Multi-Select'}
                        </span>
                    </button>

                    <div className="day-selector flex gap-2">
                        {days.map(day => (
                            <button
                                key={day}
                                className={`btn ${selectedDay === day ? 'btn-primary' : ''} glass`}
                                onClick={() => setSelectedDay(day)}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="timetable">
                    <thead>
                        <tr>
                            <th className="class-col-header">Class</th>
                            {periods.map((p, i) => (
                                <th key={i} className={p === 'BREAK' ? 'break-col' : ''}>
                                    {p === 'BREAK' ? 'LUNCH BREAK' : `Period ${p}`}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.map(cls => (
                            <tr key={cls.id}>
                                <td
                                    className="class-name-cell class-name-cell-clickable"
                                    onClick={() => onClassClick && onClassClick(cls)}
                                    title={`Click to view ${cls.name} weekly timetable`}
                                >
                                    <div className="class-name-content">
                                        <strong>{cls.name}</strong>
                                        <ChevronRight size={18} />
                                    </div>
                                </td>
                                {periods.map((p, i) => {
                                    if (p === 'BREAK') {
                                        if (cls.id === filteredClasses[0].id) {
                                            return (
                                                <td key={i} className="break-cell" rowSpan={filteredClasses.length}>
                                                    <div className="break-text">B R E A K</div>
                                                </td>
                                            );
                                        }
                                        return null;
                                    }

                                    const cellId = `${selectedDay}-${p}-${cls.id}`;
                                    return (
                                        <td key={i} className="timetable-cell-wrapper">
                                            <TimeTableCell cellId={cellId} day={selectedDay} period={p} />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bulk Edit Panel */}
            <BulkEditPanel />
        </div>
    );
}
