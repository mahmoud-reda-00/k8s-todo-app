const express = require("express");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

const client = createClient({
    url: `redis://${process.env.REDIS_HOST || "localhost"}:6379`
});

client.on("error", (err) => {
    console.error("Redis Error:", err);
});

(async () => {
    try {
        await client.connect();
        console.log("✅ Connected to Redis");
    } catch (err) {
        console.error("❌ Failed to connect to Redis:", err);
    }
})();

app.get("/", async (req, res) => {
    try {
        const visits = await client.incr("visits");

        res.json({
            message: "Hello from Kubernetes Backend 🚀",
            visits: visits
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});