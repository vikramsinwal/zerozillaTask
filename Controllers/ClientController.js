const express = require('express');

var router = express.Router();


const clientHelper = require('./Helper/Client');
const authMiddlewareFunction = require('../Middleware/authFunction');


module.exports = function (conn) {
    const db = require('../Database/getCollections')(conn.MongoDBConnection);
    const requestAuthMiddlewareFun = authMiddlewareFunction.requestAuthMiddleware();

    router.post('/create', requestAuthMiddlewareFun, clientHelper.createClientFunction(db));
    router.post('/update', requestAuthMiddlewareFun, clientHelper.updateClientFunction(db));
    return router;
};