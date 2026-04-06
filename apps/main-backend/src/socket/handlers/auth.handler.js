const { connections } = require("../socketState");

function handleAuth(ws, data) {
  const { companyId, userId, userType } = data;

  if (!companyId || !userId || !userType) {
    throw new Error("Invalid AUTH payload");
  }

  connections.set(ws, {
    companyId,
    userId,
    userType // USER | CUSTOMER
  });

  ws.send(JSON.stringify({ type: "AUTH_SUCCESS" }));
}

module.exports = { handleAuth };
