/* Define The Headers */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
/* Import Controller */
const Auth = require("./controller/Auth");
const Users = require("./controller/Users");
const Providers = require("./controller/Providers");
const Server = require("./controller/Server");
const Games = require("./controller/Games");
const Players = require("./controller/Players");
const Finance = require("./controller/Finance");
const {
  DBURL, DBNAME, PORT, TOKEN_SECRET
} = require('./config');

/* Create Server */
const server = require("http").Server(app); // Node Server
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

/* MongoDB Connection */
mongoose.connect(
  DBURL + DBNAME, { 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify : false
}).then(
  () => { console.log('database was connected successfully') },
  err => { console.log("can't connect to the database by"+ err) }
);

/* Main */
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json({
  limit: "15360mb", 
  type:'application/json'
}));
app.use(bodyParser.urlencoded({
  limit: "15360mb",
  extended: true,
  parameterLimit:5000000,
  type:'application/json'
}));

/* JWT Authentication */
authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token
  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.send(err)
    next() // pass the execution off to whatever request the client intended
  })
}

/* Listen All Request */
app.use("/api/auth", Auth);
app.use("/api/users", Users);
app.use("/api/providers", Providers);
app.use("/api/server", Server);
app.use("/api/games", Games);
app.use("/api/finance", Finance);
app.use("/api/players", Players);
app.get("*", (req, res) => {
  res.send(__dirname + "/app/index.html");
})
server.listen(PORT, () => {
  console.log("server is running on " + PORT);
});

