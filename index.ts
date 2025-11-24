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

const serverless = require("serverless-http");

async function ensureDBConnection() {
  if (mongoose.connection && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log("Connected to the database (serverless).");
  } catch (err: any) {
    console.log("Database connection error:", err);
    throw err;
  }
}

// Export the app (useful for testing or platforms like Vercel)
module.exports = app;
// Export a serverless handler for platforms like AWS Lambda
const _serverlessHandler = serverless(app);
module.exports.handler = async (event: any, context: any) => {
  await ensureDBConnection();
  return _serverlessHandler(event, context);
};
