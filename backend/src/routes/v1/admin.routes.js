const express = require('express');
const { adminController } = require('../../controllers');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { userValidation, authValidation } = require('../../validations');
const auth = require('../../middlewares/auth');

router.route('/login').post(validate(authValidation.adminLogin), adminController.adminLogin);
router.route('/user-register').post(validate(userValidation.register), adminController.userRegister);
router.route('/donation-list').get(adminController.allList);
router.route('/donation-list/:id').get(adminController.allList);

module.exports = router;