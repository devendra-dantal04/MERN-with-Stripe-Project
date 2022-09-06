const express = require('express');
const ejs = require('ejs');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("express-flash");
const MongoDBStore = require('connect-mongo');
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000 ;


app.use(flash());
app.use(express.json())


//Database Connection
const url = 'mongodb://localhost:27017/pizza';
mongoose.connect(url,
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


//Assests
app.use(express.static('public'));

//Session Storage

let mongoStore = new MongoDBStore({
  mongoUrl : url,
  collectionName : "sessions"
})

//Session config
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  store : mongoStore,
  saveUninitialized : false,
  cookie : {maxAge : 1000*60*60*24} //24 hours
  // cookie : {maxAge : 1000*15} //15sec
}))



//Global Middleware
app.use((req,res,next) => {
  res.locals.session = req.session;
  next();
})


//set Template Engine
app.use(expressEjsLayouts)
app.set("views", path.join(__dirname, "/resources/views"));
app.set('view engine', 'ejs');

require('./routes/web')(app);




app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})