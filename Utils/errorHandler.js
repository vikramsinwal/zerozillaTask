const CONSTANTS = require('./constants');
const CONSTANTS_MESSAGE = require('./constantsMessage');

function errorHandler(err, req, res, next) {
    res.status(err.status || CONSTANTS.NOT_FOUND);
    res.send({
        error: {
            status: err.status || CONSTANTS.NOT_FOUND,
            error: CONSTANTS.ERROR_TRUE,
            message: CONSTANTS_MESSAGE.NOT_FOUND
        }
    })
}
module.exports = errorHandler;