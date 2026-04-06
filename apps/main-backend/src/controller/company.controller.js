const { createCompanyService, companyUpdateService, companyDetailService } = require("../service/company.service");
const catchAsync = require("../utils/catchAsync");

const companyCreateController = catchAsync(async (req, res) => {
    const responce = await createCompanyService(req.body, req.user);
    res.status(200).json({ message: "company created successfully", data: responce });
});

const companyUpdateController = catchAsync(async (req, res) => {
    const responce = await companyUpdateService(req.body, req.user);
    res.status(200).json({ message: "company updated successfully", data: responce });
});

const companyDetaillController = catchAsync(async (req, res) => {
    const responce = await companyDetailService(req.user);
    res.status(200).json({ message: "Company retrived successfully", data: responce })
});


module.exports = {
    companyCreateController,
    companyUpdateController,
    companyDetaillController
};


