const WebSocket = require("ws");
const { handleAuth } = require("./handlers/auth.handler");
const { handleSendMessage } = require("./handlers/message.handler");
const { handleMarkRead } = require("./handlers/read.handler");
const { connections } = require("./socketState");

let wss;

function initSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    
    ws.on("message", async (raw) => {
      
      try {
        const data = JSON.parse(raw.toString());

        if (data.type === "AUTH") return handleAuth(ws, data);
        if (data.type === "SEND_MESSAGE")
          return handleSendMessage(ws, data, wss);
        if (data.type === "MARK_READ")
          return handleMarkRead(ws, data);

      } catch (err) {
        ws.send(JSON.stringify({ type: "ERROR", message: err.message }));
      }
    });

    ws.on("close", () => {
      connections.delete(ws);
    });
  });
}

module.exports = { initSocketServer };
