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
        
        // Skip the header row (index 0) and check each user
        for (let i = 1; i < users.length; i++) {
          const [id, name, userEmail, userPassword, role] = users[i];
          
          if (userEmail === email && userPassword === password) {
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
        throw new Error('Invalid credentials');
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
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