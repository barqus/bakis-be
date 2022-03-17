const express = require('express');
const router = express.Router();
const tournaments = require('../services/tournaments');
const validator = require("../services/validate");
const jwtService = require("../services/jwt");

/* GET quotes listing. */
router.get('/', jwtService.authenticateToken, async function (req, res, next) {
  try {
    res.json(await tournaments.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting tournaments `, err.message);
    next(err);
  }
});

router.post('/', jwtService.authenticateToken, validator.validate({ body: validator.tournamentSchema }),
  async function (req, res, next) {
    try {
      res.json(await tournaments.create(req.body));
    } catch (err) {
      console.error(`Error while posting tournament `, err.message);
      next(err);
    }
  }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;