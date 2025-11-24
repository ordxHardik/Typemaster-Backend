require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

const wpmRoute = require("./routes/wpmRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// --- Your routes ---
app.use("/api/wpm", wpmRoute);
app.use("/api/user", userRoute);

// --- Database connection (cached for serverless) ---
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.CONNECTION);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to the database.");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

// --- IMPORTANT: Establish DB BEFORE any request ---
app.use(async (req : any, res : any, next : any) => {
  await connectToDatabase();
  next();
});

// --- Export handler for Vercel ---
module.exports = serverless(app);
