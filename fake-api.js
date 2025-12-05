/**
 * ----------------------------------------------------------------------------
 * Questionful Fake API Server
 * ----------------------------------------------------------------------------
 * Simple Express.js mock API for testing Questionful form submissions.
 * It listens for POST requests at /submit and logs the payload to console.
 * ----------------------------------------------------------------------------
 */

import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("✅ Questionful Fake API is running!");
});

app.post("/submit", (req, res) => {
    console.log("📩 Received submission:");
    console.log(JSON.stringify(req.body, null, 2));

    setTimeout(() => {
        res.status(200).json({ message: "Form data received successfully!" });
    }, 300);
});

app.listen(PORT, () => {
    console.log(`🚀 Fake API running at http://localhost:${PORT}`);
});
