const prisma = require("../../../prisma");
const { connections } = require("../socketState");

async function handleMarkRead(ws, data) {
  const reader = connections.get(ws);
  if (!reader) return;

  const { chatId, messageIds } = data;

  if (reader.userType === "USER") {
    await prisma.messageRead.createMany({
      data: messageIds.map((id) => ({
        messageId: id,
        userId: reader.userId
      })),
      skipDuplicates: true
    });
  }

  if (reader.userType === "CUSTOMER") {
    await prisma.chatParticipant.updateMany({
      where: { chatId, customerId: reader.userId },
      data: { lastReadAt: new Date() }
    });
  }
}

module.exports = { handleMarkRead };
