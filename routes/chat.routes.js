const express = require('express');
const { isAuth } = require('../utils/authentication');

const router = express.Router();

router.get('/:userID/chat', isAuth , (req, res) => {
    res.send({message : "Welcome to chat room.!"})
})

module.exports = router;