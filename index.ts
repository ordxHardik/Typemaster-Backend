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

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to the database.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

// Middleware to ensure DB connection on every request
app.use(async (req: any, res: any, next: any) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Export for Vercel serverless
module.exports = app;
