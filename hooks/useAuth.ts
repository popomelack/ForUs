import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Logic to check if user is authenticated,
    // potentially fetching user info and setting state
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Additional login logic (e.g., API call)
  };

  const logout = () => {
    setUser(null);
    // Additional logout logic (e.g., API call)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
