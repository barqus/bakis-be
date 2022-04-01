const express = require('express');
const router = express.Router();
const questions = require('../services/questions');
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");

router.get('/', async function (req, res, next) {
    try {
        res.json(await questions.getAll());
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});


router.post('/', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(201).json(await questions.create(req.body));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.put('/:id', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(201).json(await questions.update(req.body, req.params.id));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.delete('/:id', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(204).json(await questions.deleteByID(req.params.id));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

module.exports = router;