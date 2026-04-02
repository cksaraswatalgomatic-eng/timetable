import React from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { Download, FileText, Files } from 'lucide-react';
import { useToast } from './index';
import html2pdf from 'html2pdf.js';
import './ClassSchedulePDF.css';

export default function ClassSchedulePDF({ onClose }) {
    const { classes, activeSegment, timetable } = useTimetableStore();
    const toast = useToast();
    const [selectedClasses, setSelectedClasses] = React.useState([]);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const filteredClasses = classes.filter(c => c.category === activeSegment);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = [1, 2, 3, 4, 5, 6, 7, 8];

    const toggleClass = (classId) => {
        setSelectedClasses(prev =>
            prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    const selectAll = () => {
        setSelectedClasses(filteredClasses.map(c => c.id));
    };

    const deselectAll = () => {
        setSelectedClasses([]);
    };

    const downloadSinglePDF = async (classData) => {
        const element = document.createElement('div');
        element.className = 'pdf-content';
        element.innerHTML = `
            <div class="pdf-header">
                <h1>${classData.name} - Weekly Timetable</h1>
                <p>Academic Year 2025-2026</p>
            </div>
            <table class="pdf-table">
                <thead>
                    <tr>
                        <th class="day-col">Day</th>
                        ${periods.map(p => `<th class="period-col">Period ${p}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${days.map(day => `
                        <tr>
                            <td class="day-cell"><strong>${day}</strong></td>
                            ${periods.map(p => {
            const cellId = `${day}-${p}-${classData.id}`;
            const cell = timetable[cellId];
            const content = cell?.teacherId
                ? `<div class="cell-content">
                                        <span class="subject">${cell.subject || ''}</span>
                                        <span class="teacher">${cell.teacherId ? 'Teacher Assigned' : ''}</span>
                                       </div>`
                : '<span class="empty">Empty</span>';
            return `<td class="pdf-cell">${content}</td>`;
        }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="pdf-footer">
                <p>Generated on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>TimeTable Pro - School Schedule Manager</p>
            </div>
        `;

        document.body.appendChild(element);

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `${classData.name}_Timetable.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            toast.success(`${classData.name} timetable downloaded!`);
        } catch {
            toast.error(`Failed to download ${classData.name} timetable`);
        }

        document.body.removeChild(element);
    };

    const downloadAllPDFs = async () => {
        if (selectedClasses.length === 0) {
            toast.warning('Please select at least one class');
            return;
        }

        setIsDownloading(true);
        const classesToDownload = filteredClasses.filter(c => selectedClasses.includes(c.id));

        for (const classData of classesToDownload) {
            await downloadSinglePDF(classData);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setIsDownloading(false);
        toast.success(`Downloaded ${classesToDownload.length} timetable(s)!`);
        onClose();
    };

    return (
        <div className="pdf-modal-overlay" onClick={onClose}>
            <div className="pdf-modal glass-strong" onClick={(e) => e.stopPropagation()}>
                <div className="pdf-modal-header">
                    <div className="pdf-modal-title">
                        <FileText size={24} />
                        <h2>Download Class Timetables</h2>
                    </div>
                    <button className="pdf-modal-close" onClick={onClose}>
                        <Download size={20} />
                    </button>
                </div>

                <div className="pdf-modal-content">
                    <div className="pdf-actions">
                        <button className="btn btn-sm btn-secondary" onClick={selectAll}>
                            Select All
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={deselectAll}>
                            Deselect All
                        </button>
                    </div>

                    <div className="class-selection-grid">
                        {filteredClasses.map(cls => (
                            <label
                                key={cls.id}
                                className={`class-checkbox-card ${selectedClasses.includes(cls.id) ? 'selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedClasses.includes(cls.id)}
                                    onChange={() => toggleClass(cls.id)}
                                />
                                <div className="checkbox-card-content">
                                    <span className="class-name">{cls.name}</span>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            downloadSinglePDF(cls);
                                        }}
                                        disabled={isDownloading}
                                    >
                                        <Download size={14} />
                                    </button>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="pdf-modal-footer">
                        <div className="selection-info">
                            <Files size={16} />
                            <span>{selectedClasses.length} of {filteredClasses.length} classes selected</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={downloadAllPDFs}
                            disabled={selectedClasses.length === 0 || isDownloading}
                        >
                            {isDownloading ? (
                                <>
                                    <span className="spinner"></span>
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Download Selected ({selectedClasses.length})
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
