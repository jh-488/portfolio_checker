import { useState } from "react";
import axios from "axios";

const Registration = () => {
  const [registrationUsername, setRegistrationUsername] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");

  const [registrationStatus, setRegistrationStatus] = useState("");
  const [registrationError, setRegistrationError] = useState(false);


  const register = () => {
    if(registrationUsername.length > 0 && registrationPassword.length > 0) {
      axios
      .post("http://localhost:3001/api/users/register", {
        username: registrationUsername,
        password: registrationPassword,
      })
      .then((res) => {
        if(res.data.isUsernametaken) {
          setRegistrationError(true);
        } else {
          setRegistrationError(false);
        }
        setRegistrationStatus(res.data.message);
      });
    } else {
      setRegistrationError(true);
      setRegistrationStatus("Please enter a username and password");
    }
  };

  return (
    <div className="registration box">
      <h1>Create Account</h1>
      <div className="info">
        <input
          placeholder="Username"
          type="text"
          value={registrationUsername}
          onChange={(e) => setRegistrationUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={registrationPassword}
          onChange={(e) => setRegistrationPassword(e.target.value)}
        />
      </div>
      <p className={`status ${registrationError ?  "red" : "green"}`}>{registrationStatus}</p>
      <button 
        className="btn1" 
        onClick={register}
      >
          Register
      </button>
    </div>
  );
};

export default Registration;
