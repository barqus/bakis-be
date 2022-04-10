const express = require('express');
const router = express.Router();
const users = require('../services/auth');
const validator = require("../services/validate");
const createHttpError = require("http-errors");

router.post('/register', validator.validate({ body: validator.userSchema }),
  async function (req, res, next) {
    try {
      res.json(await users.register(req.body));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
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

router.get('/confirm/:activation_code',
  async function (req, res, next) {
    try {
      res.json(await users.activate(req.params.activation_code,req));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;