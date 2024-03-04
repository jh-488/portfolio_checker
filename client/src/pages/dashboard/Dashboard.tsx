import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import NewCoins from "../../components/new_coins/NewCoins";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Coins from "../../components/coins/Coins";
import UserInfo from "../../components/userInfo/UserInfo";

export interface Coin {
  name: string;
  symbol: string;
  quantity: number;
  price?: string;
  change?: string
}

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userCoins, setUserCoins] = useState<Coin[]>();
  const [showPortfolio, setShowPortfolio] = useState(true);

  const navigate = useNavigate();

  const addNewCoin = (coin: Coin) => {
    // only add a coin if it's not already on the list
    const existingCoin = userCoins?.find(
      (prevCoin) => prevCoin.name === coin.name
    );
    if (!existingCoin) {
      axios
        .post("http://localhost:3001/api/users/dashboard", {
          userId: user?.id,
          coin: coin,
        })
        .then((res) => {
          if (res.data.isAdded) {
            if (userCoins) {
              setUserCoins([...userCoins, coin]);
            } else {
              setUserCoins([coin]);
            }
          }
        });
    }
  };


  const fetchCoinData = async (coinName: string) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinName.toLowerCase()}`, {
      withCredentials: false,
    });
    const coinPrice = response.data.market_data.current_price.usd.toLocaleString();
    const coin24HChange = response.data.market_data.price_change_percentage_24h;
    return { coinPrice, coin24HChange };
  };

  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/dashboard`);
        const coins = response.data;
        setUserCoins(coins);

        const coinPricePromises = coins.map(async (coin: Coin) => {
          const { coinPrice, coin24HChange} = await fetchCoinData(coin.name);
          return { ...coin, price: coinPrice, change: coin24HChange };
        });

        const coinPrices = await Promise.all(coinPricePromises);

        setUserCoins(coinPrices);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserCoins();
  }, [userCoins?.length]);


  useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate(`/`);
    }
  }, [user?.isLoggedIn]);

  return (
    <div className="dashboard">
      <UserInfo setShowPortfolio={setShowPortfolio}/>
      <div className="user_coins">
        {showPortfolio ? (
          <Coins userCoins={userCoins} setUserCoins={setUserCoins}/>
        ) : (
          <NewCoins addNewCoin={addNewCoin} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
