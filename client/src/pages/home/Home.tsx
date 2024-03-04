import "./Home.css";
import logo from "../../assets/logo.webp";
import Registration from "../../components/registration/Registration";
import { useContext, useState, useEffect } from "react";
import Login from "../../components/login/Login";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const { user } = useContext(AuthContext);
  
  const [isHidden, setIsHidden] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isLoggedIn) {
      navigate(`/dashboard`);
    }
  }, [user?.isLoggedIn]);

  return (
    <div className="home">
      <div className="left_column">
        <img src={logo} alt="Portfolio Checker Logo" />
        <div className="text">
            <h1>Welcome Back!</h1>
            <p>Visualize, analyze and keep track of your crypto portfolios and investment strategies.</p>
            <button 
                className="btn1"
                onClick={() => setIsHidden(false)}
            >
                Sign In</button>
        </div>
      </div>
      <div className="line"></div>
      <div className="right_column">
        {isHidden ? (
            <Registration />
        ) : (
            <div className="sign_in">
                <Login />
                <p className="no_account">No Account Yet ? <span onClick={() => setIsHidden(true)}>Sign Up</span></p>
            </div>
        )}
      </div>
    </div>
  )
}

export default Home
