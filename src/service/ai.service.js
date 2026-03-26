const { OpenAI } = require("openai");
const prisma = require("../../prisma");
const AppError = require("../utils/AppError");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY || "", // Ensure proper API key provided in .env
});

const processChatService = async ({ query }, user) => {
    try {
        const { companyId, id: userId } = user;
        console.log(query,'query');
        

        if (!companyId) {
            throw new AppError("Company information missing", 400);
        }

        // Get today's start date (local timezone)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Count queries for today
        const todayQueriesCount = await prisma.aiChatLog.count({
            where: {
                companyId: parseInt(companyId),
                createdAt: {
                    gte: todayStart
                }
            }
        });

        // If >= 20, check for active premium plan
        if (todayQueriesCount >= 20) {
            const activePlan = await prisma.planHistory.findFirst({
                where: {
                    companyId: parseInt(companyId),
                    isActive: true,
                    tierOfPlan: {
                        in: ["MONTH_PAY", "YEAR_PAY"]
                    },
                    endDate: {
                        gte: new Date()
                    }
                }
            });

            if (!activePlan) {
                throw new AppError("Daily limit of 20 chats reached. Please upgrade subscription.", 403);
            }
        }

        if (!process.env.OPEN_AI_KEY && !process.env.OPENAI_API_KEY) {
            throw new AppError("OpenAI configuration is missing on the server", 500);
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: query }],
            model: "gpt-4o-mini",
        });

        const responseText = completion.choices[0].message.content;

        // Log the chat
        const log = await prisma.aiChatLog.create({
            data: {
                companyId: parseInt(companyId),
                userId: parseInt(userId),
                query,
                response: responseText
            }
        });

        return {
            query,
            response: responseText,
            logId: log.id
        };

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error.status === 401 || error.status === 403) {
             throw new AppError(error.message, error.status); // OpenAI Error handling
        }
        throw catchAsyncPrismaError(error);
    }
};

module.exports = {
    processChatService
};
