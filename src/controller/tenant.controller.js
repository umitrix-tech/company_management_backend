
const { tenantConfigService } = require("../service/tenant.service");
const catchAsync = require("../utils/catchAsync");


const tenantConfigController = catchAsync(async (req, res, next) => {
    const responce = await tenantConfigService(req);
    res.status(200).json({ data: responce, messsage: "Tenant config get succssfully" });
})

module.exports = {
    tenantConfigController
}