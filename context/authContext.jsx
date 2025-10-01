import { createContext, useContext, useState, useEffect } from "react";
import checkAuth from "@/app/actions/checkAuth";
// Import the checkAdmin function to verify admin status
import checkAdmin from "@/app/actions/checkAdmin";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const { isAuthenticated, user } = await checkAuth();
      setIsAuthenticated(isAuthenticated);
      setCurrentUser(user);
      // Check admin status only if authenticated
      if (isAuthenticated) {
        const { isAdmin } = await checkAdmin();
        setIsAdmin(isAdmin);
      } else {
        setIsAdmin(false);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// This custom hook will be used to access the context in any component to get the authentication status, current user, and admin status.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
