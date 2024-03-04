const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const UserRoutes = require("./routes/UserRoutes");

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 7 * 24 * 3600 * 1000, // 1 week
    }
}));


app.use("/api/users", UserRoutes);


app.listen(3001, () => console.log("server is running on port 3001..."));