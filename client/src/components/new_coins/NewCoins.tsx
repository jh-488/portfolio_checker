import { useState } from "react";
import { FC } from "react";
import axios from "axios";
import "./NewCoins.css";
import { Coin } from "../../pages/dashboard/Dashboard";

interface Props {
  addNewCoin: (coin: Coin) => void;
}

interface SearchResult {
  symbol: string,
  name: string
}

const NewCoins: FC<Props> = ({ addNewCoin }) => {
  const [newCoin, setNewCoin] = useState<Coin>({
    name: "",
    symbol: "",
    quantity: 0,
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isHidden, setIsHidden] = useState(true);

  const fetchSearchResults = (value: string) => {
    axios
      .post("http://localhost:3001/api/users/availableCoins", {
        value: value,
      })
      .then((response) => setSearchResults(response.data));
  };

  const handleCoinNameChange = (name: string) => {
    setIsHidden(false);
    setNewCoin({ ...newCoin, name: name });
    fetchSearchResults(name);
  };

  const handleCoinQuantityChange = (quantity: number) => {
    setNewCoin({ ...newCoin, quantity: quantity });
  };

  const handleItemSelect = (name: string, symbol: string) => {
    setNewCoin({ ...newCoin, name: name, symbol: symbol });
    setIsHidden(true);
  };

  const addCoin = () => {
    const availableCoin = searchResults.find(coin => coin.name === newCoin.name);
    if(availableCoin) addNewCoin(newCoin);
    setNewCoin({ ...newCoin, name: "", symbol: "", quantity: 0 });
  };

  return (
    <div className="new_coins">
      <div className="new_coins_container">
        <div className="new_coins_info">
          <div className="user_inputs">
            <label>Add Coin:</label>
            <input
              type="text"
              placeholder="Coin Name"
              value={newCoin.name}
              onChange={(e) => handleCoinNameChange(e.target.value)}
            />
            <label>Quantity:</label>
            <input
              type="number"
              placeholder="How many?"
              value={newCoin.quantity}
              onChange={(e) => handleCoinQuantityChange(+e.target.value)}
            />
          </div>
          <div className="results_list">
            {!isHidden &&
              searchResults.map((result: SearchResult, index) => (
                <div
                  className="result"
                  key={index}
                  onClick={() => handleItemSelect(result.name, result.symbol)}
                >
                  {result.name}, {result.symbol}
                </div>
              ))}
          </div>
        </div>
        <button className="btn1" onClick={() => addCoin()}>
          Add
        </button>
      </div>
    </div>
  );
};

export default NewCoins;
