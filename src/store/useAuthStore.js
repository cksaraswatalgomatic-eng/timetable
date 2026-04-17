import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../utils/api';

// Simple hash for localStorage fallback
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Default users for localStorage fallback
const defaultUsers = [
  {
    id: 'admin',
    username: 'admin',
    password: simpleHash('admin123'),
    role: 'admin',
    name: 'Administrator',
    createdAt: new Date().toISOString()
  }
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Users database (for localStorage fallback)
      users: defaultUsers,
      
      // Current session
      currentUser: null,
      isAuthenticated: false,
      lastLogin: null,
      apiAvailable: false,

      // Initialize - check API availability
      init: async () => {
        const apiAvailable = await apiClient.healthCheck();
        set({ apiAvailable });
        
        if (apiAvailable) {
          // API is available, verify token
          const token = apiClient.getToken();
          if (token) {
            try {
              // Token exists, user is considered authenticated
              set({ isAuthenticated: true, apiAvailable: true });
            } catch {
              // Token invalid, clear it
              apiClient.clearToken();
              set({ 
                currentUser: null, 
                isAuthenticated: false, 
                apiAvailable: true 
              });
            }
          }
        } else {
          // API not available, use localStorage fallback
          console.log('⚠️ API not available, using localStorage fallback');
        }
      },

      // Login
      login: async (username, password) => {
        const { apiAvailable, users } = get();

        if (apiAvailable) {
          // Use API
          try {
            const response = await apiClient.login(username, password);
            
            set({
              currentUser: response.user,
              isAuthenticated: true,
              lastLogin: new Date().toISOString(),
              apiAvailable: true
            });

            return { success: true, user: response.user };
          } catch (error) {
            console.error('API login failed:', error);
            return { success: false, error: error.message };
          }
        } else {
          // Fallback to localStorage
          const hashedPassword = simpleHash(password);
          const user = users.find(
            u => u.username === username && u.password === hashedPassword
          );

          if (user) {
            set({
              currentUser: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name
              },
              isAuthenticated: true,
              lastLogin: new Date().toISOString()
            });
            return { success: true, user };
          }

          return { success: false, error: 'Invalid username or password' };
        }
      },

      // Logout
      logout: () => {
        if (get().apiAvailable) {
          apiClient.logout();
        }
        set({
          currentUser: null,
          isAuthenticated: false,
          lastLogin: null
        });
      },

      // Add user (admin only)
      addUser: async (userData) => {
        const { apiAvailable, users, currentUser } = get();
        
        if (apiAvailable) {
          // Use API
          try {
            const response = await apiClient.register(userData);
            return { success: true, user: response };
          } catch (error) {
            return { success: false, error: error.message };
          }
        } else {
          // Fallback to localStorage
          if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
          }

          if (users.find(u => u.username === userData.username)) {
            return { success: false, error: 'Username already exists' };
          }

          const newUser = {
            id: 'user_' + Date.now(),
            username: userData.username,
            password: simpleHash(userData.password),
            role: userData.role || 'user',
            name: userData.name || userData.username,
            createdAt: new Date().toISOString()
          };

          set({ users: [...users, newUser] });
          return { success: true, user: newUser };
        }
      },

      // Update user
      updateUser: async (userId, updates) => {
        const { apiAvailable, users, currentUser } = get();
        
        if (apiAvailable) {
          // Use API
          try {
            await apiClient.updateUser(userId, updates);
            
            // If updating current user, update the store
            if (currentUser && currentUser.id === userId) {
              set({
                currentUser: { ...currentUser, ...updates }
              });
            }
            
            return { success: true };
          } catch (error) {
            return { success: false, error: error.message };
          }
        } else {
          // Fallback to localStorage
          if (currentUser?.role !== 'admin' && currentUser?.id !== userId) {
            return { success: false, error: 'Unauthorized' };
          }

          const updatedUsers = users.map(user => {
            if (user.id === userId) {
              const updated = { ...user, ...updates };
              if (updates.password) {
                updated.password = simpleHash(updates.password);
              }
              return updated;
            }
            return user;
          });

          set({ users: updatedUsers });
          return { success: true };
        }
      },

      // Delete user (admin only)
      deleteUser: async (userId) => {
        const { apiAvailable, users, currentUser } = get();
        
        if (apiAvailable) {
          // Use API
          try {
            await apiClient.deleteUser(userId);
            return { success: true };
          } catch (error) {
            return { success: false, error: error.message };
          }
        } else {
          // Fallback to localStorage
          if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
          }

          const adminCount = users.filter(u => u.role === 'admin').length;
          const userToDelete = users.find(u => u.id === userId);
          
          if (userToDelete?.role === 'admin' && adminCount <= 1) {
            return { success: false, error: 'Cannot delete the last admin user' };
          }

          set({ users: users.filter(u => u.id !== userId) });
          return { success: true };
        }
      },

      // Get all users (admin only)
      getUsers: async () => {
        const { apiAvailable } = get();
        
        if (apiAvailable) {
          // Use API
          try {
            const response = await apiClient.getUsers();
            return { success: true, users: response.users };
          } catch (error) {
            return { success: false, error: error.message, users: [] };
          }
        } else {
          // Fallback to localStorage
          const { users } = get();
          return { success: true, users };
        }
      },

      // Change password for current user
      changePassword: async (currentPassword, newPassword) => {
        const { apiAvailable, users, currentUser, login } = get();
        
        if (apiAvailable) {
          // Use API
          try {
            await apiClient.changePassword(currentPassword, newPassword);
            return { success: true };
          } catch (error) {
            return { success: false, error: error.message };
          }
        } else {
          // Fallback to localStorage
          if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
          }

          // Verify current password
          const loginResult = login(currentUser.username, currentPassword);
          if (!loginResult.success) {
            return { success: false, error: 'Current password is incorrect' };
          }

          // Update password
          const updatedUsers = users.map(user => {
            if (user.id === currentUser.id) {
              return { ...user, password: simpleHash(newPassword) };
            }
            return user;
          });

          set({ users: updatedUsers });
          return { success: true };
        }
      },

      // Reset password (admin)
      resetPassword: async (userId, newPassword) => {
        const { apiAvailable } = get();
        
        if (apiAvailable) {
          // Use API
          try {
            await apiClient.resetPassword(userId, newPassword);
            return { success: true };
          } catch (error) {
            return { success: false, error: error.message };
          }
        } else {
          // Fallback to localStorage
          const { users, currentUser } = get();
          
          if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
          }

          const updatedUsers = users.map(user => {
            if (user.id === userId) {
              return { ...user, password: simpleHash(newPassword) };
            }
            return user;
          });

          set({ users: updatedUsers });
          return { success: true };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        lastLogin: state.lastLogin
      })
    }
  )
);
