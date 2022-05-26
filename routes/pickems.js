const express = require("express");
const router = express.Router();
const pickems = require("../services/pickems");
const validator = require("../services/validate");
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");

router.get(
  "/:user_id",
  jwtService.authenticateTokenForCurrentUser,
  async function (req, res, next) {
    res.set('Cache-Control', 'no-store')
    try {
      res.json(await pickems.getUsersPickems(req.params.user_id));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);

router.post(
  "/:user_id",
  jwtService.authenticateTokenForCurrentUser,
  async function (req, res, next) {
    try {
      res.status(201).json(await pickems.createUsersPickems(req.body));
    } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
    }
  }
);

router.delete(
  "/:user_id",
  jwtService.authenticateTokenForCurrentUser,
  async function (req, res, next) {
    try {
      res
        .status(204)
        .json(await pickems.deleteUsersPickems(req.params.user_id));
    } catch (err) {
      const httpError = createHttpError(500, err);

      next(httpError);
    }
  }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;
