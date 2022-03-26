const express = require('express');
const router = express.Router();
const users = require('../services/users');
const jwtService = require("../services/jwt");

/* GET quotes listing. */
router.get('/', jwtService.authenticateToken, async function (req, res, next) {
  const { user_id } = req.user;
  console.log(user_id)
  try {
    res.json(await users.getUserByID(user_id));
  } catch (err) {
    return res.sendStatus(403);
  }
});

module.exports = router;