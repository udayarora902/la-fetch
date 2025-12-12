import express from "express";
import dotenv from "dotenv";
import connectDb from "../lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
  connectDb();
});
