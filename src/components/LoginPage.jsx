import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Calendar, Lock, User, AlertCircle } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated) {
        window.location.reload();
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = login(username, password);
        
        if (!result.success) {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background Pattern */}
            <div className="login-background">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
            </div>

            {/* Login Card */}
            <div className="login-container">
                <div className="login-card glass-strong">
                    {/* Logo & Header */}
                    <div className="login-header">
                        <div className="login-logo">
                            <Calendar size={40} />
                        </div>
                        <h1>TimeTable Pro</h1>
                        <p>School Schedule Manager</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username">
                                <User size={18} />
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                                className="login-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <Lock size={18} />
                                Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="login-input"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isLoading || !username || !password}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        <p className="default-credentials">
                            <strong>Default Login:</strong>
                        </p>
                        <p className="credentials-text">
                            Username: <code>admin</code> | Password: <code>admin123</code>
                        </p>
                        <p className="security-note">
                            ⚠️ Change default password after first login
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="login-copyright">
                    <p>© {new Date().getFullYear()} TimeTable Pro. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
