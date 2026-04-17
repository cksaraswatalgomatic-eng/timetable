import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Key, X, Eye, EyeOff } from 'lucide-react';
import './PasswordChange.css';

export default function PasswordChange({ onClose }) {
    const { changePassword, logout } = useAuthStore();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 4) {
            setError('Password must be at least 4 characters');
            setIsLoading(false);
            return;
        }

        const result = await changePassword(currentPassword, newPassword);
        setIsLoading(false);
        
        if (result.success) {
            setSuccess('Password changed successfully! Please login again.');
            setTimeout(() => {
                logout();
                window.location.reload();
            }, 2000);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="password-change-overlay" onClick={onClose}>
            <div className="password-change-modal glass-strong" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <Key size={20} />
                        Change Password
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && (
                        <div className="message error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="message success">
                            <span>✓</span>
                            <span>{success}</span>
                        </div>
                    )}

                    <div className="form-field">
                        <label>Current Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="input-field"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-field">
                        <label>New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="input-field"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Confirm New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="input-field"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    <Key size={18} />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
