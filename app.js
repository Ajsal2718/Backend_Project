const express = require("express");
const app = express();

const cookies = require("cookie-parser");

const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnection");
dotenv.config({ path: "./config/config.env" });
dbConnect();

app.use(express.json());
app.use(cookies());
// app.use(express.urlencoded({extended:false}))


////////// User registration SignUp & Login ///////////
const userRoute = require("./Routes/userlog");
app.use("/api", userRoute);

///////////////// User authorization ////////////
const userformRoute = require("./Routes/UserForm_route");
app.use("/api", userformRoute);


///////////////// Admin registration ///////////////
const adminRoute = require('./Routes/admin');
app.use('/api',adminRoute)


///////// Localhost Port //////////////
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfull")
  }
});
