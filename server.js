<<<<<<< HEAD
const express = require("express");
const app = express();
var cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");


/*Def du "mongoose" et connextion a la base de données
const mongoose = require("mongoose");
it's better to store this "const URI" in .env folder(URI=...) //WITH init the dotenv library ==> require('dotenv').config()
and apply that const: process.env.URI
const URI = "mongodb+srv://kendypass:arsd1234@cluster0.ltwam.mongodb.net/kendypass?retryWrites=true&w=majority"

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log('Server running on port: ${PORT}')))
  .catch((error) => console.log(error.message));
mongoose.set('useFindAndModify', false);*/

//connectDB
connectDB();

 app.use(
   cors({
     origins: "http://localhost",
     optionsSuccessStatus: 200,
   })
);
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// When it requests a resource that has a different origin (domain, protocol, or port)
app.set("trust proxy", 1);
require("./passport"); // Passport config
//require("./passport")(passport);




// Init Middleware
app.use("/uploads", express.static("uploads"));
app.use(express.json({ extanded: false }));

//passport middleware intialization
app.use(passport.initialize());
//app.use(passport.session());
//app.use(express.json);


//when the user is requesting a GET (demande la page)
app.get("/", (req, res) => res.send("API running"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/passwords", require("./routes/api/passwords"));

const PORT = process.env.PORT || 5000;
=======
const express = require("express");
const app = express();
var cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");


/*Def du "mongoose" et connextion a la base de données
const mongoose = require("mongoose");
it's better to store this "const URI" in .env folder(URI=...) //WITH init the dotenv library ==> require('dotenv').config()
and apply that const: process.env.URI
const URI = "mongodb+srv://kendypass:arsd1234@cluster0.ltwam.mongodb.net/kendypass?retryWrites=true&w=majority"

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log('Server running on port: ${PORT}')))
  .catch((error) => console.log(error.message));
mongoose.set('useFindAndModify', false);*/

//connectDB
connectDB();

 app.use(
   cors({
     origins: "http://localhost",
     optionsSuccessStatus: 200,
   })
);
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// When it requests a resource that has a different origin (domain, protocol, or port)
app.set("trust proxy", 1);
require("./passport"); // Passport config
//require("./passport")(passport);




// Init Middleware
app.use("/uploads", express.static("uploads"));
app.use(express.json({ extanded: false }));

//passport middleware intialization
app.use(passport.initialize());
//app.use(passport.session());
//app.use(express.json);


//when the user is requesting a GET (demande la page)
app.get("/", (req, res) => res.send("API running"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/passwords", require("./routes/api/passwords"));

const PORT = process.env.PORT || 5000;
>>>>>>> 8764759c10e35b6a79265eefde7644382b99caa7
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));