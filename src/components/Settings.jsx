import React, { useState } from 'react';
import { useTimetableStore } from '../store/useTimetableStore';
import { Plus, Edit2, Trash2, Save, X, Users, BookOpen, Clock, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import './Settings.css';

// Import store for accessing timetable state
import { useTimetableStore as store } from '../store/useTimetableStore';

export default function Settings() {
    const { teachers, classes, addTeacher, removeTeacher, addClass, removeClass, 
            setSubjectRequirement, getClassRequirements, getSubjectActualPeriods } = useTimetableStore();
    const [activeTab, setActiveTab] = useState('teachers');
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [editingClass, setEditingClass] = useState(null);
    const [selectedClassForReqs] = useState(classes[0]?.id || ''); // eslint-disable-line no-unused-vars
    const [selectedSegment, setSelectedSegment] = useState('secondary');
    
    // Teacher form state
    const [teacherForm, setTeacherForm] = useState({
        name: '',
        allowedSubjects: [],
        maxPeriods: 36
    });
    const [newSubject, setNewSubject] = useState('');

    // Class form state
    const [classForm, setClassForm] = useState({
        name: ''
    });

    // Teacher CRUD
    const handleAddTeacher = () => {
        if (!teacherForm.name.trim()) return;
        addTeacher({
            name: teacherForm.name,
            allowedSubjects: teacherForm.allowedSubjects,
            maxPeriods: parseInt(teacherForm.maxPeriods) || 36,
            category: teacherForm.category || selectedSegment
        });
        resetTeacherForm();
    };

    const handleUpdateTeacher = () => {
        if (!editingTeacher || !teacherForm.name.trim()) return;
        // Remove old teacher and add updated one
        removeTeacher(editingTeacher.id);
        addTeacher({
            id: editingTeacher.id,
            name: teacherForm.name,
            allowedSubjects: teacherForm.allowedSubjects,
            maxPeriods: parseInt(teacherForm.maxPeriods) || 36,
            category: teacherForm.category || selectedSegment
        });
        resetTeacherForm();
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
        setTeacherForm({
            name: teacher.name,
            allowedSubjects: [...teacher.allowedSubjects],
            maxPeriods: teacher.maxPeriods
        });
    };

    const resetTeacherForm = () => {
        setEditingTeacher(null);
        setTeacherForm({ name: '', allowedSubjects: [], maxPeriods: 36 });
        setNewSubject('');
    };

    const handleAddSubject = () => {
        if (!newSubject.trim() || teacherForm.allowedSubjects.includes(newSubject.trim())) return;
        setTeacherForm(prev => ({
            ...prev,
            allowedSubjects: [...prev.allowedSubjects, newSubject.trim()]
        }));
        setNewSubject('');
    };

    const handleRemoveSubject = (subject) => {
        setTeacherForm(prev => ({
            ...prev,
            allowedSubjects: prev.allowedSubjects.filter(s => s !== subject)
        }));
    };

    // Class CRUD
    const handleAddClass = () => {
        if (!classForm.name.trim()) return;
        addClass({ name: classForm.name });
        setClassForm({ name: '' });
    };

    const handleEditClass = (cls) => {
        setEditingClass(cls);
        setClassForm({ name: cls.name });
    };

    const handleUpdateClass = () => {
        if (!editingClass || !classForm.name.trim()) return;
        removeClass(editingClass.id);
        addClass({
            id: editingClass.id,
            name: classForm.name
        });
        setEditingClass(null);
        setClassForm({ name: '' });
    };

    return (
        <div className="settings-container">
            <div className="settings-header glass">
                <h1>Settings & Configuration</h1>
                <p>Manage teachers, subjects, and classes</p>
            </div>

            <div className="settings-tabs glass">
                <div className="segment-tabs">
                    <button 
                        className={`segment-tab-settings ${selectedSegment === 'primary' ? 'active' : ''}`}
                        onClick={() => setSelectedSegment('primary')}
                    >
                        Primary (Nursery - 5th)
                    </button>
                    <button 
                        className={`segment-tab-settings ${selectedSegment === 'secondary' ? 'active' : ''}`}
                        onClick={() => setSelectedSegment('secondary')}
                    >
                        Secondary (6th - 10th)
                    </button>
                </div>
                
                <button 
                    className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('teachers')}
                >
                    <Users size={20} />
                    Teachers
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('classes')}
                >
                    <BookOpen size={20} />
                    Classes
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requirements')}
                >
                    <Target size={20} />
                    Subject Requirements
                </button>
            </div>

            <div className="settings-content">
                {activeTab === 'teachers' && (
                    <div className="settings-section">
                        {/* Add/Edit Teacher Form */}
                        <div className="form-card glass">
                            <div className="form-header">
                                <h2>
                                    {editingTeacher ? <Edit2 size={20} /> : <Plus size={20} />}
                                    {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                                </h2>
                                {editingTeacher && (
                                    <button className="btn btn-sm btn-secondary" onClick={resetTeacherForm}>
                                        <X size={16} />
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="form-grid">
                                <div className="form-field full-width">
                                    <label>Teacher Name</label>
                                    <input
                                        type="text"
                                        value={teacherForm.name}
                                        onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Kamal Sharma"
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Segment</label>
                                    <select
                                        value={teacherForm.category || selectedSegment}
                                        onChange={(e) => setTeacherForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="input-field"
                                    >
                                        <option value="primary">Primary</option>
                                        <option value="secondary">Secondary</option>
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Max Periods/Week</label>
                                    <input
                                        type="number"
                                        value={teacherForm.maxPeriods}
                                        onChange={(e) => setTeacherForm(prev => ({ ...prev, maxPeriods: e.target.value }))}
                                        min="1"
                                        max="60"
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Add Subject</label>
                                    <div className="input-with-btn">
                                        <input
                                            type="text"
                                            value={newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                                            placeholder="e.g., Maths"
                                            className="input-field"
                                        />
                                        <button className="btn btn-primary" onClick={handleAddSubject}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="form-field full-width">
                                    <label>Assigned Subjects</label>
                                    <div className="subject-tags">
                                        {teacherForm.allowedSubjects.length === 0 ? (
                                            <span className="no-subjects">No subjects added</span>
                                        ) : (
                                            teacherForm.allowedSubjects.map(subject => (
                                                <span key={subject} className="subject-tag">
                                                    {subject}
                                                    <button onClick={() => handleRemoveSubject(subject)}>
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                {editingTeacher ? (
                                    <button className="btn btn-primary" onClick={handleUpdateTeacher}>
                                        <Save size={18} />
                                        Update Teacher
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleAddTeacher}>
                                        <Plus size={18} />
                                        Add Teacher
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Teachers List - Filtered by Segment */}
                        <div className="teachers-list">
                            <h2 className="section-title">
                                <Users size={20} />
                                {selectedSegment === 'primary' ? 'Primary' : 'Secondary'} Teachers ({teachers.filter(t => t.category === selectedSegment).length})
                            </h2>
                            
                            <div className="teachers-grid">
                                {teachers.filter(t => t.category === selectedSegment).map(teacher => (
                                    <div key={teacher.id} className="teacher-card glass">
                                        <div className="teacher-card-header">
                                            <div className="teacher-info">
                                                <h3>{teacher.name}</h3>
                                                <div className="teacher-meta">
                                                    <Clock size={14} />
                                                    <span>Max {teacher.maxPeriods} periods/week</span>
                                                    <span className="teacher-category-badge">{teacher.category}</span>
                                                </div>
                                            </div>
                                            <div className="teacher-actions">
                                                <button 
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEditTeacher(teacher)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeTeacher(teacher.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="teacher-subjects">
                                            {teacher.allowedSubjects.map(subject => (
                                                <span key={subject} className="subject-badge-small">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'requirements' && (
                    <div className="settings-section">
                        {/* Subject-wise Requirements View */}
                        <div className="form-card glass">
                            <div className="form-header">
                                <h2>
                                    <Target size={20} />
                                    Subject-wise Period Requirements per Class
                                </h2>
                            </div>

                            <p className="help-text">
                                Configure minimum periods per week for each subject across all classes. 
                                This ensures government mandates are met for curriculum distribution.
                            </p>
                        </div>

                        {/* Subject-wise Table */}
                        <div className="subject-wise-card glass">
                            {(() => {
                                // Filter classes by selected segment (with fallback for missing category)
                                const segmentClasses = classes.filter(c => {
                                    if (!c.category) return selectedSegment === 'secondary'; // Default old data to secondary
                                    return c.category === selectedSegment;
                                });
                                
                                // Get all unique subjects from timetable and requirements for this segment
                                const allSubjects = new Set();
                                const timetableState = store.getState().timetable;
                                
                                segmentClasses.forEach(cls => {
                                    const reqs = getClassRequirements(cls.id);
                                    Object.keys(reqs).forEach(s => allSubjects.add(s));
                                    
                                    Object.values(timetableState)
                                        .filter(cell => cell.classId === cls.id && cell.subject)
                                        .forEach(cell => allSubjects.add(cell.subject));
                                });

                                const subjects = Array.from(allSubjects).sort();

                                return (
                                    <>
                                        <h3 className="subject-wise-title">
                                            {selectedSegment === 'primary' ? 'Primary' : 'Secondary'} - Required Periods per Week by Subject
                                        </h3>
                                        
                                        {subjects.length === 0 ? (
                                            <div className="no-subjects-message">
                                                <Target size={48} />
                                                <p>No subjects found for {selectedSegment} classes</p>
                                                <p className="help-text">Subjects will appear once you assign them in the timetable or set requirements</p>
                                            </div>
                                        ) : (
                                            <div className="subject-wise-table-wrapper">
                                                <table className="subject-wise-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="subject-name-header">Subject</th>
                                                            {segmentClasses.map(cls => (
                                                                <th key={cls.id} className="class-name-header">
                                                                    {cls.name}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {subjects.map(subject => (
                                                            <tr key={subject}>
                                                                <td className="subject-label-cell">
                                                                    <span className="subject-label">{subject}</span>
                                                                </td>
                                                                {segmentClasses.map(cls => {
                                                                    const required = getClassRequirements(cls.id)[subject] || 0;
                                                                    const actual = getSubjectActualPeriods(cls.id, subject);
                                                                    const isMet = required === 0 || actual >= required;
                                                                    const hasRequirement = required > 0;
                                                                    
                                                                    return (
                                                                        <td 
                                                                            key={cls.id} 
                                                                            className={`requirement-cell 
                                                                                ${!hasRequirement ? 'no-requirement' : ''} 
                                                                                ${hasRequirement && !isMet ? 'has-deficit' : ''} 
                                                                                ${hasRequirement && isMet ? 'requirement-met' : ''}`}
                                                                        >
                                                                            <div className="requirement-input-group">
                                                                                <label>Required:</label>
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
                                                                                    className="period-input"
                                                                                    placeholder="0"
                                                                                />
                                                                            </div>
                                                                            <div className="actual-display">
                                                                                <span className={`actual-count ${hasRequirement && !isMet ? 'is-deficit' : ''}`}>
                                                                                    {actual}
                                                                                </span>
                                                                                <span className="actual-label">actual</span>
                                                                            </div>
                                                                            {hasRequirement && !isMet && (
                                                                                <div className="deficit-indicator">
                                                                                    -{required - actual}
                                                                                </div>
                                                                            )}
                                                                            {hasRequirement && isMet && (
                                                                                <div className="met-indicator">
                                                                                    ✓
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {activeTab === 'classes' && (
                    <div className="settings-section">
                        {/* Add/Edit Class Form */}
                        <div className="form-card glass">
                            <div className="form-header">
                                <h2>
                                    {editingClass ? <Edit2 size={20} /> : <Plus size={20} />}
                                    {editingClass ? 'Edit Class' : 'Add New Class'}
                                </h2>
                                {editingClass && (
                                    <button className="btn btn-sm btn-secondary" onClick={() => {
                                        setEditingClass(null);
                                        setClassForm({ name: '' });
                                    }}>
                                        <X size={16} />
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Class Name</label>
                                    <input
                                        type="text"
                                        value={classForm.name}
                                        onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., 6th, 9th A, 10th B"
                                        className="input-field"
                                        onKeyPress={(e) => e.key === 'Enter' && (editingClass ? handleUpdateClass() : handleAddClass())}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Segment</label>
                                    <select
                                        value={classForm.category || selectedSegment}
                                        onChange={(e) => setClassForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="input-field"
                                    >
                                        <option value="primary">Primary</option>
                                        <option value="secondary">Secondary</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">
                                {editingClass ? (
                                    <button className="btn btn-primary" onClick={handleUpdateClass}>
                                        <Save size={18} />
                                        Update Class
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleAddClass}>
                                        <Plus size={18} />
                                        Add Class
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Classes List - Filtered by Segment */}
                        <div className="classes-list">
                            <h2 className="section-title">
                                <BookOpen size={20} />
                                {selectedSegment === 'primary' ? 'Primary' : 'Secondary'} Classes ({classes.filter(c => c.category === selectedSegment).length})
                            </h2>
                            
                            <div className="classes-grid">
                                {classes.filter(c => c.category === selectedSegment).map(cls => (
                                    <div key={cls.id} className="class-card glass">
                                        <div className="class-card-header">
                                            <div className="class-info">
                                                <h3>{cls.name}</h3>
                                                <span className="class-category">{cls.category}</span>
                                            </div>
                                            <div className="class-actions">
                                                <button 
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEditClass(cls)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeClass(cls.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
