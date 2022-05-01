const express = require('express');
const router = express.Router();
const users = require('../services/users');
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");

/* GET quotes listing. */
router.get('/', jwtService.authenticateToken, async function (req, res, next) {
  const { user_id } = req.user;
  try {
    res.json(await users.getUserByID(user_id));
  } catch (err) {
    return res.sendStatus(403);
  }
});

router.put('/role/:id', jwtService.authenticateAdminToken,
  async function (req, res, next) {
    try {
        res.status(201).json(await users.updateRole(req.body, req.params.id));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});


router.get('/all', jwtService.authenticateAdminToken, async function (req, res, next) {
  try {
      res.json(await users.getAll());
  } catch (err) {
      const httpError = createHttpError(500, err);
      next(httpError);
  }
});

module.exports = router;