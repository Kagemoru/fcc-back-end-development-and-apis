import http from "http";
import fs from "fs";
import path from "path";
import { WebSocketServer } from "ws";

const PORT = 3001;

// 1. HTTP server
const server = http.createServer((req, res) => {
    const url = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join("public", url);
    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".png": "image/png",
        ".js": "text/javascript",
    };
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (err, file) => {
        if (err) {
            res.writeHead(404, { "content-type": "text/plain"});
            res.end("Page not found");
            return;
        }
        res.writeHead(200, { "content-type": contentType });
        res.end(file);
    });
});

// 3. WebSocket Server
const wss = new WebSocketServer({ server });

// Helper function to broadcast a message to all connected clients
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// 4. Listen for new WebSocket connection
wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get("username");
    broadcast({
        type: "system",
        text: `${username} joined`
    });

    console.log(`${username} joined the server.`)

    // 5. Listen for messages from clients
    socket.on("message", (message) => {
        const { username, text} = JSON.parse(message);
        broadcast({
            type: "chat",
            username,
            text
        })
    });

    // 6. Listen for the clients disconnection
    socket.on("close", () => {
        broadcast({
            type: "system",
            text: `${username} left`
        });
    });
});

// 2. Start Server
server.listen(PORT, () => {
    console.log(`Server is listening to http://localhost:${PORT}`);
});