const express = require('express');
const { register, signin, signout, forgetPassword, resetPassword } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);

router.post('/signin', signin);

router.get('/signout', signout);

router.post('/forgetPassword',forgetPassword);

router.post('/resetPassword', resetPassword);

module.exports = router;