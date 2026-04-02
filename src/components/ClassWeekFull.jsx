import React, { useRef, useEffect } from 'react';
import { useMultiSelect } from '../store/MultiSelectContext';
import TimeTableCell from './TimeTableCell';
import BulkEditPanel from './BulkEditPanel';
import { ArrowLeft, Download, Printer, MousePointer2, CheckSquare } from 'lucide-react';
import { useToast } from './index';
import html2pdf from 'html2pdf.js';
import './ClassWeekFull.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ClassWeekFull({ classData, onBack }) {
    const toast = useToast();
    const printRef = useRef(null);
    const { isEnabled, selectedCells, endDrag, clearSelection, toggleEnabled, containerRef } = useMultiSelect();

    // Global mouse up to end drag
    useEffect(() => {
        const handleMouseUp = () => {
            endDrag();
        };

        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [endDrag]);

    const handleDownloadPDF = () => {
        const element = printRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `${classData.name}_Timetable.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            toast.success('PDF downloaded successfully!');
        }).catch(() => {
            toast.error('Failed to download PDF');
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="class-week-full" ref={containerRef}>
            {/* Header - Hidden when printing */}
            <div className="class-week-actions no-print">
                <button className="btn btn-secondary" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Schedule
                </button>
                
                <div className="action-buttons gap-2 flex">
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
                        <span>
                            {isEnabled ? `Selecting (${selectedCells.length})` : 'Multi-Select'}
                        </span>
                    </button>

                    <button className="btn btn-secondary" onClick={handlePrint} title="Print">
                        <Printer size={18} />
                        Print
                    </button>
                    <button className="btn btn-primary" onClick={handleDownloadPDF} title="Download PDF">
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Info bar when multi-select is enabled */}
            {isEnabled && (
                <div className="multi-select-info no-print">
                    <MousePointer2 size={16} />
                    <span>Drag to select multiple cells • Ctrl+Click to toggle • {selectedCells.length} selected</span>
                </div>
            )}

            {/* Printable Content */}
            <div className="class-week-printable" ref={printRef}>
                <div className="class-week-print-header">
                    <div className="print-logo">
                        <div className="logo-square">
                            <span>📅</span>
                        </div>
                        <div>
                            <h1>TimeTable Pro</h1>
                            <p>School Schedule Manager</p>
                        </div>
                    </div>
                    <div className="print-class-info">
                        <h2>{classData.name} - Weekly Timetable</h2>
                        <p>Academic Year 2025-2026</p>
                    </div>
                </div>

                <table className="class-week-table-print">
                    <thead>
                        <tr>
                            <th className="day-col">Day</th>
                            {periods.map((p) => (
                                <th key={p} className="period-col">
                                    <span className="period-label">Period</span>
                                    <span className="period-number">{p}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((day) => (
                            <tr key={day}>
                                <td className="day-cell">
                                    <strong>{day}</strong>
                                </td>
                                {periods.map((p) => {
                                    const cellId = `${day}-${p}-${classData.id}`;
                                    return (
                                        <td key={p} className="week-cell-wrapper-print">
                                            <TimeTableCell
                                                cellId={cellId}
                                                day={day}
                                                period={p}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="print-footer">
                    <p>Generated on {new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                    <p>TimeTable Pro - School Schedule Manager</p>
                </div>
            </div>

            {/* Bulk Edit Panel */}
            <BulkEditPanel />
        </div>
    );
}
