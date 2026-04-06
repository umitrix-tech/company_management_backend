const {
  getDashboardStatsService,
  getUpcomingTimelineService,
  getDashboardChartDataService
} = require("../src/service/dashboard.service");
const prisma = require("@umitrix/database");

async function testDashboard() {
  try {
    // Find a sample user to mock auth
    const user = await prisma.user.findFirst({
      where: { isDetele: false },
      select: { companyId: true, id: true }
    });

    if (!user) {
      console.log("No users found in database to test with.");
      return;
    }

    console.log("Testing with User:", user);

    console.log("\n--- Testing Stats ---");
    const stats = await getDashboardStatsService(user);
    console.log(JSON.stringify(stats, null, 2));

    console.log("\n--- Testing Timeline ---");
    const timeline = await getUpcomingTimelineService(user);
    console.log(JSON.stringify(timeline, null, 2));

    console.log("\n--- Testing Chart Data ---");
    const charts = await getDashboardChartDataService(user);
    console.log(JSON.stringify(charts, null, 2));

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboard();
