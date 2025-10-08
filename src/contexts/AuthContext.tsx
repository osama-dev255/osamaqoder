import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getSheetData } from '@/services/apiService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem('pos_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Fetch user data from Google Sheets
      const response = await getSheetData('Sheet1');
      
      if (response && response.data && response.data.values) {
        const users = response.data.values;
        
        // Check if we have any users data
        if (users.length < 2) {
          throw new Error('No user accounts found. Please contact your system administrator.');
        }
        
        // Skip the header row (index 0) and check each user
        for (let i = 1; i < users.length; i++) {
          const [id, name, userEmail, userPassword, role] = users[i];
          
          if (userEmail === email && userPassword === password) {
            // Validate role
            if (!['admin', 'manager', 'cashier'].includes(role)) {
              throw new Error('Invalid user role. Please contact your system administrator.');
            }
            
            const userData: User = {
              id,
              name,
              email: userEmail,
              role: role as 'admin' | 'manager' | 'cashier'
            };
            
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('pos_user', JSON.stringify(userData));
            return;
          }
        }
        
        // If we get here, no matching user was found
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else {
        throw new Error('Unable to connect to authentication service. Please check your internet connection.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Provide more specific error messages
      if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Authentication failed. Please try again or contact your system administrator.');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pos_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}