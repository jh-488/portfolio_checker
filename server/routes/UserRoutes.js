const express = require("express");
const db = require("../database/Database");
const availableCoins = require("../data/availableCoins");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require("bcrypt");
const saltRounds = 10;


// Route for a new user to register
router.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err);
        } else {
            db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, hash], (err, result) => {
                if(err) {
                    console.log(err);
                    if(err.errno === 1062) {
                        res.send({
                            isUsernametaken: true,
                            message: "Username already exists"
                        })
                    }
                } else {
                    res.send({
                        isUsernametaken: false,
                        message: "Registration successful"
                    })
                }
            })
        }
    });
});

// Route to check if a user is already logged in
router.get("/login", (req, res) => {
    if(req.session.user) {
        res.send({
            isLoggedIn: true,
            userId: req.session.user[0].userId,
            username: req.session.user[0].username,
            message: `${req.session.user[0].username} is logged in`
        });
    } else {
        res.send({
            isLoggedIn: false
        })
    }
});

// Route for a user to login
router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE username = ?", username, (err, result) => {
        if(err) {
            res.send({error: err});
        } 

        if(result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(response) {
                    req.session.user = result;

                    res.send({
                        isLoggedIn: true,
                        userId: req.session.user[0].userId,
                        username: req.session.user[0].username,
                        loginErr: false,
                    });
                } else {
                    res.send({
                        isLoggedIn: false,
                        loginErr: true,
                        message: "Username or Password is incorrect!!"
                    });
                }
            });
        } else {
            res.send({
                isLoggedIn: false,
                loginErr: true,
                message: "User not found!!"
            });
        }
    })
});


// Route fot logout
router.get("/logout", (req, res) => {
    res.clearCookie("userId"); 
    return res.send({message: "User logged out"})
});

// Route to get all available coins
router.post("/availableCoins", async (req, res) => {
    try {
        const coinsResult = await availableCoins.filter((coin) => {
            return req.body.value && coin && ((coin.symbol && coin.symbol.toLowerCase().includes(req.body.value)) || (coin.name && coin.name.toLowerCase().includes(req.body.value)));
        });

        res.json(coinsResult);
    } catch (e) {
        res.status(500).json({message : "Server error"});
    }
});

// Route for a user dashboard
router.get("/dashboard", (req, res) => {
    if(req.session.user) {
        db.query("SELECT * FROM coins WHERE userId = ?", req.session.user[0].userId, (err, result) => {
            if(err) {
                res.send({error: err})
            }

            if(result.length > 0) {
                res.send(result)
            }
        })
    } else {
        res.send({
            message: "User is not logged In"
        })
    }
});

// Route to store a user's coins data
router.post("/dashboard", (req, res) => {
    const userId = req.body.userId;
    const coin = req.body.coin;

    db.query("INSERT INTO coins (userId, name, symbol, quantity) VALUES (?,?,?,?)", [userId, coin.name, coin.symbol, coin.quantity], (err, result) => {
        if(err) {
            res.send({
                isAdded: false,
                message: err
            })
        } else {
            res.send({
                isAdded: true,
                result: result,
                message: "Coin added successfully"
            })
        }
    })
});


// route that handles a quantity change of a coin
router.post("/quantityChange", (req, res) => {
    const newQuantity = req.body.newQuantity;
    const coinName = req.body.coin;
    const userId = req.session.user[0].userId;

    db.query("UPDATE coins SET quantity = ? WHERE userID = ? AND name = ?", [newQuantity, userId, coinName], (err, result) => {
        if(err) {
            res.send({
                message: "Server error, please try again later!!",
            })
            console.log(err)
        } else {
            res.send({
                message: "Quantity changed successfully."
            })
        }
    })
});


// Route to delete a coin
router.post("/deleteCoin", (req, res) => {
    const coinName = req.body.coin.name;
    const userId = req.session.user[0].userId;

    db.query("DELETE FROM coins WHERE userID = ? AND name = ?", [userId, coinName], (err, result) => {
        if(err) {
            res.send({
                message: "Server error, please try again later!!",
            })
            console.log(err)
        } else {
            res.send({
                result: result,
                message: "Coin deleted successfully."
            })
        }
    })
});

module.exports = router;