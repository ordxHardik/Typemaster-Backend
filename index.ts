require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const wpmRoute = require("./routes/wpmRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/wpm/", wpmRoute);
app.use("/api/user/", userRoute);

// mongoose
//   .connect(process.env.CONNECTION)
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log("Listening to the port and connecting to the db.");
//     });
//   })
//   .catch((err: Error) => {
//     console.log(err);
//   });

let isConnected = false;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.CONNECTION ,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to the database.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

// app.use((req, res, next) => {
//   if (!isConnected) {
//     connectToDatabase();
//   }
//   next();
// });

// module.exports = app;
