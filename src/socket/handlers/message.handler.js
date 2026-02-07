const prisma = require("../../../prisma");
const { connections, chatParticipantsCache } = require("../socketState");

async function handleSendMessage(ws, data, wss) {
    const sender = connections.get(ws);
    if (!sender) return;

    console.log(sender, 'sender');

    const { chatId, content } = data;
    if (!chatId || !content || !content.trim()) return;

    console.log(data, 'data');


    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            companyId: sender.companyId,
            participants: {
                some: sender.userType === "USER"
                    ? { userId: sender.userId }
                    : { customerId: sender.userId }
            }
        }
    });

    console.log(chat, 'chat');

    if (!chat) return;

    const message = await prisma.message.create({
        data: {
            chatId,
            companyId: sender.companyId,
            senderType: sender.userType,
            senderUserId: sender.userType === "USER" ? sender.userId : null,
            senderCustomerId:
                sender.userType === "CUSTOMER" ? sender.userId : null,
            content
        }
    });

    // customer unread logic
    if (sender.userType === "USER") {
        await prisma.chatParticipant.updateMany({
            where: { chatId, customerId: { not: null } },
            data: { lastReadAt: null }
        });
    }

    if (!chatParticipantsCache.get(chatId)) {

        let listOfParticipent = await prisma.chatParticipant.findMany({
            where: { chatId, companyId: sender.companyId }
        });
        chatParticipantsCache.set(chatId, listOfParticipent.map(p => ({
            userType: p.userId ? "USER" : "CUSTOMER",
            userId: p.userId ?? p.customerId
        })));
    }

    const participants = chatParticipantsCache.get(chatId);

    console.log(participants, 'participants');


    wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;

        const meta = connections.get(client);

        console.log(meta, 'meta');

        if (!meta) return;
        if (meta.companyId !== sender.companyId) return;

        const isParticipant = participants.some(
            (p) =>
                (meta.userType === "USER" && p.userId === meta.userId) ||
                (meta.userType === "CUSTOMER" && p.customerId === meta.userId)
        );

        console.log(isParticipant, 'isParticipant');


        if (!isParticipant) return;

        // skip sender
        if (
            meta.userType === sender.userType &&
            meta.userId === sender.userId
        ) return;

        client.send(JSON.stringify({
            type: "NEW_MESSAGE",
            message
        }));
    });
}


module.exports = {
    handleSendMessage
}