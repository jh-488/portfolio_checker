import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logoutIcon from "../../assets/logout-icon.webp";

interface Props {
    setShowPortfolio: (arg: boolean) => void; 
}

const UserInfo = ({setShowPortfolio}: Props) => {
  
  const { user, logout } = useContext(AuthContext);  


  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user_info">
        <h1>
          {user?.name}
        </h1>
        <div className="sections">
            <button className="btn1" onClick={() => setShowPortfolio(false)}>Add New Coin</button>
            <button className="btn1" onClick={() => setShowPortfolio(true)}>My Portfolio</button>
        </div>
        <div className="logout">
          <button className="btn1" onClick={handleLogout}>
            <img src={logoutIcon} alt="logout icon" /> Logout
          </button>
        </div>
    </div>
  )
}

export default UserInfo
