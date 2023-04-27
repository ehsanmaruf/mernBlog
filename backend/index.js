const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const router= require("./routes/userRoute");
const blogRouter = require("./routes/blogRoute");
require("dotenv").config();

const app = express();                                  
const PORT = process.env.PORT || 6060;                                        
const URL = process.env.MONGO_STRING;

app.use(express.json()); //parse data
app.use(cors());

app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .then(() => app.listen(PORT))
  .then(console.log(`Listening on Port ${PORT}`))
  .catch((err) => console.log(err));
