const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.token_secret, (err, user) => {
            if (err) {
                return res.sendStatus(403).json({message: "Token has expired, please re-log"});
            }

            req.user = user;

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const authenticateTokenForCurrentUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.token_secret, (err, user) => {
            if (err) {
                return res.sendStatus(403).json({message: "Token has expired, please re-log"});
            }
            
            req.user = user

            const { user_id } = user;
            if (user_id != req.params.user_id) {
                return res.sendStatus(403);
            }
            

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const authenticateAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.token_secret, (err, user) => {
            if (err) {
                return res.sendStatus(403).json({message: "Token has expired, please re-log"});
            }
            
            req.user = user

            const { role } = user;

            if (role !== 'admin') {
                return res.sendStatus(403);
            }
            
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateToken,
    authenticateAdminToken,
    authenticateTokenForCurrentUser,
}