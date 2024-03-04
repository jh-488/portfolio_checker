import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Coin } from "../../pages/dashboard/Dashboard";
import "./Coins.css";
import deleteIcon from "../../assets/delete-icon.webp";


interface Props {
  userCoins: Coin[] | undefined;
  setUserCoins: Dispatch<SetStateAction<Coin[] | undefined>>
}

const Coins = ({ userCoins, setUserCoins }: Props) => {

  const coinValue = (coinPrice: string, quantity: number) => {
      const price = parseFloat(coinPrice.replace(/,/g, ''));
      const coinValue = price * quantity;
      return coinValue.toLocaleString()
  };

  const totalValue = userCoins?.reduce((accumulator: number, coin: Coin) => {
      if (coin.price) {
        const price = parseFloat(coin.price.replace(/,/g, ''));
        const coinValue = price * coin.quantity;
        return accumulator + coinValue;
      } else {
        return accumulator;
      }
  }, 0);


  const handleQuantityChange = async (value: number, coinName: string) => {
    await axios.post("http://localhost:3001/api/users/quantityChange", {
      newQuantity: value,
      coin: coinName
    });

    setUserCoins(userCoins?.map((coin) => (
      coin.name === coinName ? {...coin, quantity: value} : coin
    )))
  };

  const handleDeleteCoin = async (coin: Coin) => {
    await axios.post("http://localhost:3001/api/users/deleteCoin", {
      coin: coin
    });

    await axios.get(`http://localhost:3001/api/users/dashboard`)
    .then((res) => setUserCoins(res.data));
  };

  return (
    <div className="coins">
      <div className="coins_container">
        <div className="coins_titles row">
          <p className="hidden">Name</p>
          <p>Symbol</p>
          <p>Quantity</p>
          <p>Price</p>
          <p className="hidden">24H</p>
          <p>Value</p>
        </div>
        <div className="coins_rows">
          {userCoins && userCoins.length > 0 ? (
            userCoins.map((coin: Coin, index: number) => {
              return (
                <div className="coin_row row" key={index}>
                  <p className="hidden">{coin.name}</p>
                  <p>{coin.symbol}</p>
                  <input 
                    type="number" 
                    value={coin.quantity}
                    onChange={(e) => handleQuantityChange(+e.target.value, coin.name)}
                  />
                  <p>{coin.price ? `${coin.price}` : "NA"}</p>
                  <p className="hidden">{coin.change ? <span className={Number(coin.change) > 0 ? "green" : "red"}>{Number(coin.change).toFixed(2)}</span> : "NA"}</p>
                  <p>{coin.price ? `${coinValue(coin.price, coin.quantity)}` : "NA"}</p>
                  <img 
                    src={deleteIcon} 
                    alt="Delete icon" 
                    title="Delete"
                    onClick={() => handleDeleteCoin(coin)}  
                  />
                </div>
              )
            } )
          ) : (
            <div>No coins added yet</div>
          )}
        </div>
        <div className="total_value"><span>Total:</span> {totalValue?.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Coins;
