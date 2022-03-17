const {
    Validator,
    ValidationError,
} = require("express-json-validator-middleware");

const { validate } = new Validator();

function validationErrorMiddleware(error, request, response, next) {
    if (response.headersSent) {
        return next(error);
    }

    const isValidationError = error instanceof ValidationError;
    if (!isValidationError) {
        return next(error);
    }

    response.status(400).json({
        errors: error.validationErrors,
    });

    next();
}

const tournamentSchema = {
    type: "object",
    required: ["name", "type", "region", "maximum_players", "registration_until", "starting_date", "created_by_user"],
    properties: {
        name: {
            type: "string",
            minLength: 1,
        },
        type: {
            type: "string",
            minLength: 1,
            enum: ["Brackets", "Leaderboard"],
        },
        region: {
            type: "string",
            minLength: 1,
            enum: ["euw", "eune", "na"],
        },
        maximum_players: {
            type: "number",
            min: 2,
        },
    },
};

const userSchema = {
    type: "object",
    required: ["username", "email", "password",],
    properties: {
        username: {
            type: "string",
            minLength: 1,
        },
        email: {
            type: "string",
            minLength: 1,
        },
        password: {
            type: "string",
            minLength: 1,
        },
    },
};

module.exports = {
    tournamentSchema,
    userSchema,
    validate,
    validationErrorMiddleware
}
