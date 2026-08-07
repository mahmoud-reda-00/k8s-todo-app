const express = require("express");
const path = require("path");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

// Serve frontend static files from ./frontend (inside the container image)
app.use(express.static(path.join(__dirname, 'frontend')));

const appName = process.env.APP_NAME || "Kubernetes Todo App";
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPassword = process.env.REDIS_PASSWORD || undefined;

const clientOptions = {
    url: `redis://${redisHost}:6379`
};

if (redisPassword) {
    clientOptions.password = redisPassword;
}

const client = createClient(clientOptions);

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

app.get("/api", async (req, res) => {
    try {
        const visits = await client.incr("visits");

        res.json({
            message: `Hello from ${appName} 🚀`,
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