const express = require('express');

var router = express.Router();


const agencyHelper = require('./Helper/Agency');
const authMiddlewareFunction = require('../Middleware/authFunction');


module.exports = function (conn) {
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const requestAuthMiddlewareFun = authMiddlewareFunction.requestAuthMiddleware();

    router.post('/create', requestAuthMiddlewareFun, agencyHelper.createAgencyFunction(db));
    router.post('/details', requestAuthMiddlewareFun, agencyHelper.getAgencyFunction(db));
    router.post('/topBilling', requestAuthMiddlewareFun, agencyHelper.getByTopBilling(db));

    return router;
};