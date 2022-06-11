const express = require('express');
const router = express.Router();
const answers = require('../services/answers');
const jwtService = require("../services/jwt");
const createHttpError = require("http-errors");

router.get('/', async function (req, res, next) {
    try {
        res.json(await answers.getAll());
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});

router.get('/:participant_id', async function (req, res, next) {
    try {
        res.json(await answers.getByParticipantID(req.params.participant_id));
    } catch (err) {
        const httpError = createHttpError(500, err);
        next(httpError);
    }
});


router.post('/', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            for (const element of req.body) {
                if (element == null) {
                    continue
                }
                let alreadyExists = await answers.checkIfAnswerExistsByQuestionAndParticipant(element.question_id, element.participant_id)
                if (alreadyExists.length > 0) {
                    let answerID = alreadyExists[0].id
                    await answers.update(element, answerID)
                } else {
                    await answers.create(element);
                }
                
            }
            res.status(201).json();
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.put('/:id', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(201).json(await answers.update(req.body, req.params.id));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

router.delete('/:id', jwtService.authenticateAdminToken,
    async function (req, res, next) {
        try {
            res.status(204).json(await answers.deleteByID(req.params.id));
        } catch (err) {
            const httpError = createHttpError(500, err);
            next(httpError);
        }
    }
);

module.exports = router;