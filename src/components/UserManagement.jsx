import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Edit2, Trash2, Save, X, User, Shield, Key, RefreshCw, AlertTriangle } from 'lucide-react';
import './UserManagement.css';

export default function UserManagement() {
    const { 
        users, 
        currentUser, 
        addUser, 
        updateUser, 
        deleteUser, 
        getUsers,
        resetPassword 
    } = useAuthStore();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [resetUserId, setResetUserId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'user'
    });

    const isAdmin = currentUser?.role === 'admin';

    // Load users on mount
    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const resetForm = () => {
        setFormData({ username: '', password: '', name: '', role: 'user' });
        setIsEditing(false);
        setEditingUser(null);
        setError('');
        setSuccess('');
    };

    const handleAddUser = () => {
        setError('');
        setSuccess('');

        if (!formData.username || !formData.password) {
            setError('Username and password are required');
            return;
        }

        const result = addUser(formData);
        if (result.success) {
            setSuccess('User added successfully');
            resetForm();
        } else {
            setError(result.error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '', // Don't show password
            name: user.name,
            role: user.role
        });
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleUpdateUser = () => {
        setError('');
        setSuccess('');

        if (!formData.username) {
            setError('Username is required');
            return;
        }

        const updates = {
            username: formData.username,
            name: formData.name,
            role: formData.role
        };

        // Only update password if provided
        if (formData.password) {
            updates.password = formData.password;
        }

        const result = updateUser(editingUser.id, updates);
        if (result.success) {
            setSuccess('User updated successfully');
            resetForm();
        } else {
            setError(result.error);
        }
    };

    const handleDeleteUser = (userId) => {
        if (userId === currentUser.id) {
            setError('Cannot delete your own account');
            return;
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            const result = deleteUser(userId);
            if (result.success) {
                setSuccess('User deleted successfully');
            } else {
                setError(result.error);
            }
        }
    };

    const handlePasswordReset = async () => {
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }

        const result = await resetPassword(resetUserId, newPassword);
        
        if (result.success) {
            setSuccess('Password reset successfully');
            setShowPasswordReset(false);
            setResetUserId(null);
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="user-management">
            {/* Messages */}
            {error && (
                <div className="message error">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError('')}><X size={16} /></button>
                </div>
            )}

            {success && (
                <div className="message success">
                    <span>✓</span>
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')}><X size={16} /></button>
                </div>
            )}

            {/* Add/Edit User Form */}
            <div className="user-form-card glass">
                <div className="form-header">
                    <h2>
                        {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                        {isEditing ? 'Edit User' : 'Add New User'}
                    </h2>
                    {isEditing && (
                        <button className="btn btn-sm btn-secondary" onClick={resetForm}>
                            <X size={16} />
                            Cancel
                        </button>
                    )}
                </div>

                <div className="user-form-grid">
                    <div className="form-field">
                        <label>Username *</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="e.g., john.doe"
                            className="input-field"
                            disabled={isEditing} // Can't change username when editing
                        />
                    </div>

                    <div className="form-field">
                        <label>{isEditing ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder={isEditing ? 'Enter new password' : 'Enter password'}
                            className="input-field"
                        />
                    </div>

                    <div className="form-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., John Doe"
                            className="input-field"
                        />
                    </div>

                    <div className="form-field">
                        <label>Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            className="input-field"
                            disabled={!isAdmin}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    {isEditing ? (
                        <button className="btn btn-primary" onClick={handleUpdateUser}>
                            <Save size={18} />
                            Update User
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleAddUser}>
                            <Plus size={18} />
                            Add User
                        </button>
                    )}
                </div>
            </div>

            {/* Users List */}
            <div className="users-list-section">
                <h2 className="section-title">
                    <User size={20} />
                    All Users ({users.length})
                </h2>

                <div className="users-table-card glass">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={user.id === currentUser.id ? 'current-user-row' : ''}>
                                    <td>
                                        <div className="username-cell">
                                            <User size={16} />
                                            <span>{user.username}</span>
                                            {user.id === currentUser.id && (
                                                <span className="you-badge">You</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{user.name || '-'}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            <Shield size={12} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="date-cell">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="user-actions">
                                            <button 
                                                className="btn-icon"
                                                onClick={() => handleEditUser(user)}
                                                title="Edit user"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                className="btn-icon"
                                                onClick={() => {
                                                    setResetUserId(user.id);
                                                    setShowPasswordReset(true);
                                                    setNewPassword('');
                                                    setConfirmPassword('');
                                                }}
                                                title="Reset password"
                                            >
                                                <Key size={16} />
                                            </button>
                                            {isAdmin && user.id !== currentUser.id && (
                                                <button 
                                                    className="btn-icon danger"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showPasswordReset && (
                <div className="modal-overlay" onClick={() => setShowPasswordReset(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <Key size={20} />
                                Reset Password
                            </h2>
                            <button className="modal-close" onClick={() => setShowPasswordReset(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-field">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="input-field"
                                />
                            </div>

                            <div className="form-field">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="input-field"
                                />
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={() => setShowPasswordReset(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handlePasswordReset}>
                                    <RefreshCw size={18} />
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
