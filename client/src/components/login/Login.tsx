import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { login, loginStatus, loginError } = useContext(AuthContext);


  const handleLogin = () => {
    login(loginUsername, loginPassword);
  };


  return (
    <div className="login box">
        <h1>Log In</h1>
        <div className="info">
          <input 
            placeholder="Username"
            type="text" 
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}  
          />
          <input 
            placeholder="Password"
            type="password" 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}   
          />
        </div>
        <p className={`status ${loginError ?  "red" : "green"}`}>{loginStatus}</p>
        <button 
          className="btn1"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
  )
}

export default Login
