import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config(); // MUST be before using env vars


const app = express();
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("Server is running");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to start server:", error.message);
});