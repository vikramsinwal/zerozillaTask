const jwt = require('jsonwebtoken');
const CONSTANTS = require('../Utils/constants');
const CONSTANTS_MESSAGE = require('../Utils/constantsMessage');

function requestAuthMiddleware(Models) {
    async function requestAuth(req, res, next) {
        try {
            let authToken = req.headers.authorization;

            if (!authToken) {
                throw { status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: CONSTANTS_MESSAGE.INVALID_DATA, message: CONSTANTS_MESSAGE.TOKEN_REQUIRED };
            }
            let tokenArr = authToken.split(' ');
            let token = tokenArr[1];
            let decoded;
            if (token == process.env.REQUEST_TOKEN) {
                decoded = jwt.verify(token, process.env.SESSION_SECRET);
            }
            if (decoded == process.env.SECRET) {
                next();
            } else {
                throw { status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: CONSTANTS_MESSAGE.INVALID_DATA, auth: CONSTANTS.FALSE, message: CONSTANTS_MESSAGE.INVALID_TOKEN };
            }
        } catch (error) {
            res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: CONSTANTS_MESSAGE.INVALID_DATA, auth: CONSTANTS.FALSE, message: error.message });
        }
    }
    return requestAuth;
}

module.exports = { requestAuthMiddleware };