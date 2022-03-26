const express = require('express');
const router = express.Router();
const settings = require('../services/settings');
const validator = require("../services/validate");
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");

router.get('/', async function (req, res, next) {
    try {
        res.json(await settings.get());
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.post('/', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(201).json(await settings.create(req.body));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.put('/', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(201).json(await settings.update(req.body));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;