const express = require('express');
const router = express.Router();
const users = require('../services/auth');
const validator = require("../services/validate");

router.post('/register', validator.validate({ body: validator.userSchema }),
  async function (req, res, next) {
    try {
      res.json(await users.register(req.body));
    } catch (err) {
      console.error(`Error while registering`, err.message);
      next(err);
    }
  }
);

router.post('/login',
  async function (req, res, next) {
    try {
      res.json(await users.login(req.body));
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;