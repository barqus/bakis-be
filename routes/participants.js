const express = require('express');
const router = express.Router();
const participants = require('../services/participants');
const validator = require("../services/validate");
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");
router.get('/', async function (req, res, next) {
    try {
        res.json(await participants.getAll());
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        res.json(await participants.getByID(req.params.id));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.get('/:id/qna', async function (req, res, next) {
    try {
        res.json(await participants.getQnA(req.params.id));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.post('/', jwtService.authenticateAdminToken, validator.validate({ body: validator.participantsSchema }),
    async function (req, res, next) {
        try {
            res.status(201).json(await participants.create(req.body));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.put('/:id', jwtService.authenticateAdminToken, validator.validate({ body: validator.participantsSchema }),
    async function (req, res, next) {
        try {
            res.status(201).json(await participants.update(req.body, req.params.id));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.delete('/:id', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(204).json(await participants.deleteByID(req.params.id));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.use(validator.validationErrorMiddleware);

module.exports = router;