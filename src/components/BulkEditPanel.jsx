import React from 'react';
import { useMultiSelect } from '../store/MultiSelectContext';
import { useTimetableStore } from '../store/useTimetableStore';
import { X, Check, Users } from 'lucide-react';
import './BulkEditPanel.css';

export default function BulkEditPanel() {
    const { selectedCells, clearSelection, isEnabled } = useMultiSelect();
    const { teachers, assignCell, overrideCell } = useTimetableStore();
    const [editTeacher, setEditTeacher] = React.useState('');
    const [editSubject, setEditSubject] = React.useState('');
    const [isOverrideMode, setIsOverrideMode] = React.useState(false);

    const selectedTeacherObj = teachers.find(t => t.id === editTeacher);

    const handleApply = () => {
        if (!editTeacher) return;
        
        selectedCells.forEach(cellId => {
            if (isOverrideMode) {
                overrideCell(cellId, editTeacher, editSubject);
            } else {
                assignCell(cellId, editTeacher, editSubject);
            }
        });
        
        // Reset and close
        setEditTeacher('');
        setEditSubject('');
        clearSelection();
    };

    const handleClose = () => {
        setEditTeacher('');
        setEditSubject('');
        clearSelection();
    };

    if (!isEnabled || selectedCells.length === 0) return null;

    return (
        <div className="bulk-edit-panel glass-strong">
            <div className="bulk-edit-header">
                <div className="bulk-edit-title">
                    <Users size={18} />
                    <span>Bulk Edit - {selectedCells.length} cell{selectedCells.length > 1 ? 's' : ''}</span>
                </div>
                <button className="bulk-edit-close" onClick={handleClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="bulk-edit-content">
                <div className="bulk-edit-field">
                    <label className="field-label">Teacher</label>
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
                        className="bulk-select"
                        placeholder="Select teacher"
                    >
                        <option value="">-- Select Teacher --</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} ({t.allowedSubjects.join(', ')})
                            </option>
                        ))}
                    </select>
                </div>

                {editTeacher && selectedTeacherObj && (
                    <div className="bulk-edit-field">
                        <label className="field-label">Subject</label>
                        <select
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="bulk-select"
                        >
                            {selectedTeacherObj.allowedSubjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="bulk-edit-options">
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={isOverrideMode} 
                            onChange={(e) => setIsOverrideMode(e.target.checked)} 
                        />
                        <span>Override existing assignments</span>
                    </label>
                </div>

                <div className="bulk-edit-actions">
                    <button className="btn btn-secondary btn-sm" onClick={handleClose}>
                        Cancel
                    </button>
                    <button 
                        className="btn btn-primary btn-sm" 
                        onClick={handleApply}
                        disabled={!editTeacher}
                    >
                        <Check size={16} />
                        Apply to All ({selectedCells.length})
                    </button>
                </div>
            </div>
        </div>
    );
}
