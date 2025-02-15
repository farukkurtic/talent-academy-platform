const express = require('express');
const { authController } = require('../controllers')
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate')

const router = express.Router();

router.post('/registracija', validate(authValidation.register), authController.register);
router.post('/prijava', validate(authValidation.login), authController.login);
router.put('/promijeni-lozinku', validate(authValidation.changePassword), authController.changePassword);

module.exports = router;
