const Joi = require('joi');
const _ = require('lodash');
Joi.objectId = require('joi-objectid')(Joi)

const CONSTANTS = require('../../../Utils/constants');
const CONSTANTS_MESSAGE = require('../../../Utils/constantsMessage');

const createClientSchema = Joi.object({
    AgencyId: Joi.objectId().required(),
    Name: Joi.string().trim().required(),
    Email: Joi.string().email().trim().required(),
    PhoneNumber: Joi.number().required(),
    TotalBill: Joi.number().required(),
});
const createUpdateSchema = Joi.object({
    _id: Joi.objectId().required(),
    AgencyId: Joi.objectId().required(),
    Name: Joi.string().trim().required(),
    Email: Joi.string().email().trim().required(),
    PhoneNumber: Joi.number().required(),
    TotalBill: Joi.number().required(),
});

function createClientFunction(Models) {
    async function create(req, res) {
        try {
            let validateData = createClientSchema.validate(req.body);
            if (validateData.error) {
                let errorDetail = validateData.error.details[0].message;
                throw { status: CONSTANTS.FALSE, errorDetail, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: validateData.error, message: CONSTANTS_MESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ['AgencyId', 'Name', 'PhoneNumber', 'Email', 'TotalBill']);

            let savedClientData = await new Models.ClientDB(bodyData).save();
            if (savedClientData === null) {
                res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: "Client Data NULL, Error While Creating Client" });
            } else {
                res.send({ status: CONSTANTS.TRUE, statusCode: CONSTANTS.SUCCESS, error: CONSTANTS.ERROR_FALSE, message: "Client Created." });
            }
        }
        catch (e) {
            res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: "Error while Creating Client" });
        }
    }
    return create;
}
function updateClientFunction(Models) {
    async function update(req, res) {
        try {
            let validateData = createUpdateSchema.validate(req.body);
            if (validateData.error) {
                let errorDetail = validateData.error.details[0].message;
                throw { status: CONSTANTS.FALSE, errorDetail, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: validateData.error, message: CONSTANTS_MESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let bodyData = _.pick(req.body, ['_id', 'AgencyId', 'Name', 'PhoneNumber', 'Email', 'TotalBill']);

            let updateClient = await Models.ClientDB.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData });
            console.log('updateClient is', updateClient)
            if (updateClient === null) {
                res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: "Client Data NULL, Error While Updating Client" });
            } else {
                res.send({ status: CONSTANTS.TRUE, statusCode: CONSTANTS.SUCCESS, error: CONSTANTS.ERROR_FALSE, message: "Client Updated" });
            }
        }
        catch (e) {
            res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: e, message: "Error while Updating Client" });
        }
    }
    return update;
}
module.exports = {
    createClientFunction,
    updateClientFunction
};