const express = require('express');
const { register, signin, signout } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);

router.post('/signin', signin);

router.get('/signout', signout);


module.exports = router;