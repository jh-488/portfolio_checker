const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const path = require('path');
const fs = require('fs');

const UserRoutes = require("./routes/UserRoutes");

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://portfoliochecker.netlify.app/"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Create sessions directory (if it doesn't exist)
const sessionsDir = path.join(__dirname, 'sessions');
try {
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir);
  }
} catch (err) {
  console.error('Error creating sessions directory:', err);
  process.exit(1); 
}

const fileStore = new FileStore({
  path: sessionsDir,
});

app.use(session({
    name: "userId",
    key: "userId",
    store: fileStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 7 * 24 * 3600 * 1000, // 1 week
    }
}));


app.use("/api/users", UserRoutes);


app.listen(3001, () => console.log("server is running on port 3001..."));