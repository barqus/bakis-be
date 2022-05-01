const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const validator = require("../services/validate");
const createHttpError = require("http-errors");

router.post('/register', validator.validate({ body: validator.userSchema }),
  async function (req, res, next) {
    try {
      let usernameExists = await auth.checkIfUsernameExists(req.body)
      if (usernameExists) {
        res.status(400).json({message: "username exists"});
        return
      }

      let emailExists = await auth.checkIfEmailExists(req.body)
      if (emailExists) {
        res.status(400).json({message: "email exists"});
        return
      }
      res.json(await auth.register(req.body));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);

router.post('/login',
  async function (req, res, next) {
    try {
      res.json(await auth.login(req.body));
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  }
);

router.post('/reset',
  async function (req, res, next) {
    try {
      res.json(await auth.resetPassword(req.body));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);

router.post('/new_password',
  async function (req, res, next) {
    try {
      res.json(await auth.newPassword(req.body));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);


router.get('/twitch/:code',
  async function (req, res, next) {
    try {
      res.json(await auth.authTwitch(req.params.code));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);
router.get('/confirm/:activation_code',
  async function (req, res, next) {
    try {
      res.json(await auth.activate(req.params.activation_code,req));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;