const https = require("https");
const http = require("http");

const fs = require("fs");
const { initSocketServer } = require("./index");

const prod = true;

// const wsServer = https.createServer({});
const wsServer = http.createServer();
initSocketServer(wsServer);

module.exports = wsServer;
