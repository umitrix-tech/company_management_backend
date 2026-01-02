const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { createCompanySchema, updateCompanySchema } = require("../validation/company.validation");
const { companyCreateController, companyUpdateController } = require("../controller/company.controller");
const auth = require("../middleware/auth.middleware");

router.post(
  '/create',
  auth,
  validate(createCompanySchema),
  companyCreateController
  
);


router.put(
  '/update',
  auth,
  validate(updateCompanySchema),
  companyUpdateController
)
// router.patch(
//   '/company/:id',
//   validate(updateCompanySchema),
//   companyUpdateController
// );

module.exports = router;

