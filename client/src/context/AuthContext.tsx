import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { ReactNode } from "react";

interface User {
  id: number | null;
  name: string | null;
  isLoggedIn: boolean;
};

interface ContextValue {
  user: User | undefined;
  loginStatus: string,
  loginError: boolean,
  login: (name: string, password: string) => void,
  logout: () => void
};

interface Props {
  children: ReactNode;
};

export const AuthContext = createContext<ContextValue>({} as ContextValue); 

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User>(); 
  const [loginStatus, setLoginStatus] = useState("");
  const [loginError, setLoginError] = useState(true);

  axios.defaults.withCredentials = true;
  
  const login = async (loginUsername: string, loginPassword: string) => {
    await axios.post("http://localhost:3001/api/users/login", {
      username: loginUsername,
      password: loginPassword
    }).then((res) => {
      if(!res.data.loginErr) {
        setLoginError(false);
        setUser({id: res.data.userId,name: res.data.username, isLoggedIn: res.data.isLoggedIn});
      } else {
        setLoginError(true);
      } 
      setLoginStatus(res.data.message);
    })
  };

  const logout = () => {
    axios.get("http://localhost:3001/api/users/logout")
    .then((_res) => {
      setUser({id: null,name: null, isLoggedIn: false})
    }).catch((err) => console.log(err))
  };


  // if the user is already logged in
  useEffect(() => {
    axios.get("http://localhost:3001/api/users/login")
    .then((res) => {
      if(res.data.isLoggedIn) {
        setUser({id: res.data.userId, name: res.data.username, isLoggedIn: true})
      } 
    })
  }, []);


  return (
    <AuthContext.Provider value={{ user, login, loginStatus, loginError, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
