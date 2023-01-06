const express = require('express');
const { requireSignin, isAuth } = require('../utils/authentication');

const router = express.Router();

router.get('/:userID/chat', requireSignin , isAuth , (req, res) => {
    res.send({message : "Welcome to chat room!"})
})

module.exports = router;