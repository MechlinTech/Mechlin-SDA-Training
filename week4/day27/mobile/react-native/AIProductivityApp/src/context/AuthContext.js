import React, {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import {
    saveToken,
    getToken,
    removeToken,
  } from "../utils/storage";
  
  const AuthContext = createContext();
  
  export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      loadToken();
    }, []);
  
    const loadToken = async () => {
      const storedToken = await getToken();
  
      if (storedToken) {
        setToken(storedToken);
      }
  
      setLoading(false);
    };
  
    const login = async (jwt) => {
      await saveToken(jwt);
  
      setToken(jwt);
    };
  
    const logout = async () => {
      await removeToken();
  
      setToken(null);
    };
  
    return (
      <AuthContext.Provider
        value={{
          token,
          loading,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);