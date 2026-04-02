import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { useMultiSelect } from '../store/MultiSelectContext';
import { AlertTriangle, Edit2 } from 'lucide-react';
import './TimeTableCell.css';

export default function TimeTableCell({ cellId, day, period }) {
    const { timetable, teachers, assignCell, overrideCell, clearCell, getPeriodConflicts } = useTimetableStore();
    const { isEnabled, isSelected, toggleCellSelection, startDrag, updateDrag } = useMultiSelect();
    const [isEditing, setIsEditing] = useState(false);
    const cellRef = useRef(null);

    const cellData = timetable[cellId];
    
    // Initialize state regardless of cellData existence (for hook rules)
    const currentTeacher = cellData ? teachers.find(t => t.id === cellData.teacherId) : null;
    const isEmpty = cellData ? !cellData.teacherId : true;

    // Local state for editing - must be called unconditionally
    const [editTeacher, setEditTeacher] = useState(cellData?.teacherId || '');
    const [editSubject, setEditSubject] = useState(cellData?.subject || '');
    const [isOverrideMode, setIsOverrideMode] = useState(cellData?.isOverride || false);

    // Check conflicts - only if cellData exists
    const conflicts = cellData?.teacherId ? getPeriodConflicts(day, period, cellData.teacherId) : [];
    const hasConflict = conflicts.length > 1;

    const handleSave = useCallback(() => {
        if (!editTeacher) {
            clearCell(cellId);
        } else {
            if (isOverrideMode) {
                overrideCell(cellId, editTeacher, editSubject);
            } else {
                assignCell(cellId, editTeacher, editSubject);
            }
        }
        setIsEditing(false);
    }, [editTeacher, editSubject, isOverrideMode, cellId, clearCell, overrideCell, assignCell]);

    // Keyboard shortcuts for editing mode
    useEffect(() => {
        if (!isEditing) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsEditing(false);
            } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isEditing, handleSave]);

    // Early return for missing cell data (after all hooks)
    if (!cellData) return null;

    const selectedTeacherObj = teachers.find(t => t.id === editTeacher);

    // Handle mouse events for drag selection
    const handleMouseDown = (e) => {
        if (!isEnabled) return;
        e.preventDefault();
        startDrag(cellId, e);
    };

    const handleMouseEnter = () => {
        if (!isEnabled) return;
        updateDrag(cellId);
    };

    // Handle cell click for normal mode
    const handleCellClick = () => {
        if (isEnabled) return; // Don't open edit in multi-select mode
        setIsEditing(true);
    };

    // Handle Ctrl+click for quick toggle
    const handleClick = (e) => {
        if (isEnabled) {
            const isCtrlPressed = e.ctrlKey || e.metaKey;
            if (isCtrlPressed) {
                toggleCellSelection(cellId, true);
            }
        } else {
            handleCellClick();
        }
    };

    if (isEditing) {
        return (
            <div className="timetable-cell editing">
                <select
                    value={editTeacher}
                    onChange={(e) => {
                        setEditTeacher(e.target.value);
                        const tData = teachers.find(t => t.id === e.target.value);
                        if (tData && tData.allowedSubjects.length > 0) {
                            setEditSubject(tData.allowedSubjects[0]);
                        } else {
                            setEditSubject('');
                        }
                    }}
                    className="cell-select teacher-select"
                >
                    <option value="">-- No Teacher --</option>
                    {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>

                {editTeacher && selectedTeacherObj && (
                    <select
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        className="cell-select subject-select"
                    >
                        {selectedTeacherObj.allowedSubjects.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                )}

                <div className="override-toggle">
                    <label>
                        <input type="checkbox" checked={isOverrideMode} onChange={(e) => setIsOverrideMode(e.target.checked)} />
                        Override / Replace
                    </label>
                </div>

                <div className="cell-actions edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                    <button className="btn btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            </div>
        );
    }

    const selected = isSelected(cellId);

    return (
        <div 
            ref={cellRef}
            className={`timetable-cell ${isEmpty ? 'empty-cell' : ''} ${hasConflict ? 'conflict-cell' : ''} ${cellData.isOverride ? 'override-cell' : ''} ${selected ? 'selected-cell' : ''}`}
            data-subject={cellData.subject || ''}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
        >
            {isEmpty ? (
                <div className="empty-state">
                    <span>Empty</span>
                    <Edit2 size={14} />
                </div>
            ) : (
                <div className="assigned-state">
                    <div className="subject-badge" data-subject={cellData.subject}>{cellData.subject}</div>
                    <div className="teacher-name">{currentTeacher?.name || 'Unknown'}</div>

                    <div className="cell-status-icons">
                        {hasConflict && <AlertTriangle size={16} className="text-danger" title="Double booked!" />}
                        {cellData.isOverride && <span className="override-badge" title="Manual Override">OVR</span>}
                        {selected && <span className="selected-badge" title="Selected">✓</span>}
                    </div>
                </div>
            )}
        </div>
    );
}
