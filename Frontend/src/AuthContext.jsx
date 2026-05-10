import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [id, setId ] = useState(localStorage.getItem("id"));
  const signin = !!token;

  const login = (token, userName, userRole, userid) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", userName);
    localStorage.setItem("role", userRole);
    localStorage.setItem("id", userid);

    setToken(token);
    setName(userName);
    setRole(userRole);
    setId(userid);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setToken(null);
    setName(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ signin, logout, name, role, login, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);