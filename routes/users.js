const express = require('express');
const router = express.Router();
const users = require('../services/users');
const config = require('../config');
const jwt = require('jsonwebtoken');

/* GET quotes listing. */
router.get('/', async function (req, res, next) {

  const { authorization } = req.headers;
  console.log(req.headers)
  if (!authorization) {
    return res.sendStatus(403);
  }
  const token = authorization.split(" ")[1];

  try {
    const data = jwt.verify(token, config.token_secret);
    res.json(await users.getUserByID(data.user_id));
  } catch (err) {
    return res.sendStatus(403);
  }
});

module.exports = router;