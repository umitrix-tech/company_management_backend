const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { createCompanySchema, updateCompanySchema } = require("../validation/company.validation");
const { companyCreateController, companyUpdateController, companyDetaillController } = require("../controller/company.controller");
const auth = require("../middleware/auth.middleware");
const permissonAuth = require("../middleware/permissionMiddleware");
const { moduleAccess } = require("../utils/constData");

router.post(
  '/create',
  auth,
  validate(createCompanySchema),
  companyCreateController
);

router.get(
  '/',
  permissonAuth(moduleAccess.COMPANY_INFO.MODULE),
  companyDetaillController
);

router.put(
  '/update',
  permissonAuth(moduleAccess.COMPANY_INFO.EDIT_COMPANY),
  validate(updateCompanySchema),
  companyUpdateController
)
// router.patch(
//   '/company/:id',
//   validate(updateCompanySchema),
//   companyUpdateController
// );

module.exports = router;

