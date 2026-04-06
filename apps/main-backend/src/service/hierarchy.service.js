const AppError = require("../utils/AppError");
const prisma = require("@umitrix/database");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const getHierarchyTreeService = async (payload, user) => {
    try {
        const { companyId } = user;
        
        // Fetch all users for the company to build the tree
        const users = await prisma.user.findMany({
            where: { companyId: parseInt(companyId), isDetele: false },
            select: { 
                id: true, 
                name: true, 
                empCode: true, 
                email: true, 
                roleId: true,
                reportingId: true, 
                role: { select: { name: true } } 
            }
        });

        // Build tree
        const userMap = {};
        const tree = [];

        users.forEach(u => {
            userMap[u.id] = { ...u, reports: [] };
        });

        users.forEach(u => {
            if (u.reportingId && userMap[u.reportingId]) {
                userMap[u.reportingId].reports.push(userMap[u.id]);
            } else {
                tree.push(userMap[u.id]);
            }
        });

        return tree;
    } catch (error) {
        throw catchAsyncPrismaError(error);
    }
}

const assignManagerService = async (payload, user) => {
    try {
        const { userId, reportingId } = payload;
        const { companyId } = user;

        if (userId === reportingId) {
            throw new AppError("User cannot report to themselves", 400);
        }

        const employee = await prisma.user.findFirst({
            where: { id: parseInt(userId), companyId: parseInt(companyId), isDetele: false }
        });

        const manager = await prisma.user.findFirst({
            where: { id: parseInt(reportingId), companyId: parseInt(companyId), isDetele: false }
        });

        if (!employee) throw new AppError("Employee not found", 404);
        if (!manager) throw new AppError("Manager not found", 404);

        // Circular reporting check
        let currentManager = manager.reportingId;
        while (currentManager) {
            if (currentManager === employee.id) {
                throw new AppError("Circular reporting structure is not allowed", 400);
            }
            const parent = await prisma.user.findUnique({ select: { reportingId: true }, where: { id: currentManager } });
            currentManager = parent ? parent.reportingId : null;
        }

        const userUpdate = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { reportingId: parseInt(reportingId) }
        });

        return userUpdate;
    } catch (err) {
        throw catchAsyncPrismaError(err);
    }
}

const removeManagerService = async (payload, user) => {
    try {
        const { userId } = payload;
        const { companyId } = user;

        const employee = await prisma.user.findFirst({
            where: { id: parseInt(userId), companyId: parseInt(companyId), isDetele: false }
        });

        if (!employee) throw new AppError("Employee not found", 404);

        const userUpdate = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { reportingId: null }
        });

        return userUpdate;
    } catch (err) {
        throw catchAsyncPrismaError(err);
    }
}

module.exports = {
    getHierarchyTreeService,
    assignManagerService,
    removeManagerService
};
