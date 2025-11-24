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

let isConnected = false;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

app.use(async (req : any, res : any, next : any) => {
  await connectToDatabase();
  next();
});



// --- Your routes ---
app.use("/api/wpm", wpmRoute);
app.use("/api/user", userRoute);

// --- Database connection (cached for serverless) ---


// --- IMPORTANT: Establish DB BEFORE any request ---


// --- Export handler for Vercel ---
module.exports = app;
