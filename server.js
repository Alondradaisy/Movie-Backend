require("dotenv").config(); //configures dotenv package into backend

const mongoose = require("mongoose"); //instantiates mongoose
console.log(process.env.NODE_ENV); //console logs the node environment being worked in
const app = require("./app"); //instantiates the app and brings in direct path

const port = 8080; //port that app will be running on

//instantiates mongoDB through mongoose library
mongoose
  .connect(process.env.MONGO_DB, {
    //connects mongoDB's to the environment
    useNewUrlParser: true, // required documentation
    useUnifiedTopology: true, // required documentation
  })
  .then(() => {
    app.listen(port, () => {
      //runs the app and watches it at port 8080
      console.log(`Server connected on ${port}`); //displays template string in console
      console.log("MongoDB Connected"); // console log to make sure mongoDB is connected
    });
  })
  .catch((e) => {
    //.catch to catch any errors
    console.log(e); // console logs err(s)
  });
