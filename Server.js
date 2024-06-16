const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { configDotenv } = require("dotenv");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const userRoutes = require("./Routes/userRoutes");
app.use("/user", userRoutes);

const blogRoutes = require("./Routes/blogRoutes")
app.use("/blog",blogRoutes)

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MONGODB CONNECTED");
});

PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
