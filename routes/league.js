const express = require('express');
const router = express.Router();
const league = require('../services/league');
const validator = require("../services/validate");
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");

router.get('/standings', async function (req, res, next) {
    try {
        res.json(await league.getStandings());
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.get('/history', async function (req, res, next) {
    try {
        res.json(await league.getMatchHistory(req.query.page));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.get('/history/details/:id', async function (req, res, next) {
    try {
        res.json(await league.getMatchHistoryDetailsByID(req.params.id));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.get('/history/stats/:id', async function (req, res, next) {
    try {
        res.json(await league.getMatchHistoryFromBlob(req.params.id));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.use(validator.validationErrorMiddleware);

module.exports = router;