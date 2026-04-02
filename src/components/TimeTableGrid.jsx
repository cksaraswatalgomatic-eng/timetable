import React, { useState } from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import TimeTableCell from './TimeTableCell';
import { ChevronDown } from 'lucide-react';
import './TimeTableGrid.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 'BREAK', 5, 6, 7, 8];

export default function TimeTableGrid() {
    const { classes } = useTimetableStore();
    const [selectedDay, setSelectedDay] = useState('Monday');

    return (
        <div className="timetable-container glass flex-col">
            <div className="timetable-header items-center justify-between p-4 flex">
                <h2 style={{ margin: 0 }}>Class Schedule Editor</h2>

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
                        {classes.map(cls => (
                            <tr key={cls.id}>
                                <td className="class-name-cell">
                                    <strong>{cls.name}</strong>
                                </td>
                                {periods.map((p, i) => {
                                    if (p === 'BREAK') {
                                        if (cls.id === classes[0].id) {
                                            return (
                                                <td key={i} className="break-cell" rowSpan={classes.length}>
                                                    <div className="break-text">B R E A K</div>
                                                </td>
                                            );
                                        }
                                        return null;
                                    }

                                    const cellId = `${selectedDay}-${p}-${cls.id}`;
                                    return (
                                        <td key={i} className="timetable-cell-wrapper">
                                            <TimeTableCell cellId={cellId} day={selectedDay} period={p} classId={cls.id} />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
