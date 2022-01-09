const Joi = require('joi');
const _ = require('lodash');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const CONSTANTS = require('../../../Utils/constants');
const CONSTANTS_MESSAGE = require('../../../Utils/constantsMessage');


const createAgencySchema = Joi.object({
    AgencyName: Joi.string().trim().required(),
    Address1: Joi.string().required(),
    Address2: Joi.string().allow(null, ''),
    PhoneNumber: Joi.number().required(),
    State: Joi.string().required(),
    City: Joi.string().required(),
    ///////////
    ClientName: Joi.string().trim().required(),
    Email: Joi.string().email().trim().required(),
    ClientPhoneNumber: Joi.number().required(),
    TotalBill: Joi.number().required(),
});
const getAgencySchema = Joi.object({
    _id: Joi.objectId().required(),
    clientCount: Joi.number().required(),
});
const getClientCountSchema = Joi.object({
    clientCount: Joi.number().required(),
});

function createAgencyFunction(Models) {
    async function createAgency(req, res) {
        try {
            let validateData = createAgencySchema.validate(req.body);
            if (validateData.error) {
                let errorDetail = validateData.error.details[0].message;
                throw { status: CONSTANTS.FALSE, errorDetail, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: CONSTANTS_MESSAGE.INVALID_DATA };
            }

            // pick data from req.body
            let AllData = _.pick(req.body, ['AgencyName', 'Address1', 'Address2', 'PhoneNumber', 'State', 'City', 'ClientName', 'Email', 'ClientPhoneNumber', 'TotalBill']);
            let AgencyData = {};
            AgencyData.Name = AllData.AgencyName;
            AgencyData.Address1 = AllData.Address1;
            AgencyData.Address2 = AllData.Address2;
            AgencyData.PhoneNumber = AllData.PhoneNumber;
            AgencyData.State = AllData.State;
            AgencyData.City = AllData.City;

            let savedAgencyData = await new Models.AgencyDB(AgencyData).save();
            savedAgencyData = savedAgencyData.toObject();

            let clientData = {};
            clientData.AgencyId = savedAgencyData._id;
            clientData.Name = AllData.ClientName;
            clientData.Email = AllData.Email;
            clientData.PhoneNumber = AllData.ClientPhoneNumber;
            clientData.TotalBill = AllData.TotalBill;
            let savedClientData = await new Models.ClientDB(clientData).save();
            if (savedAgencyData === null || savedClientData === null) {
                if (savedAgencyData === null) {
                    res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: "Agency Data NULL, Error While Creating Agency" });
                } else {
                    res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, message: "Client Data NULL, Error While Creating Agency's Client" });
                }
            } else {
                res.send({ status: CONSTANTS.TRUE, statusCode: CONSTANTS.SUCCESS, error: CONSTANTS.ERROR_FALSE, message: "Agency Created with Client" });
            }
        }
        catch (e) {
            console.log('Error is', e);
            res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: e, message: "Error while Creating Agency" });
        }
    }
    return createAgency;
}
function getAgencyFunction(Models) {
    async function getTopClients(clientsData, topClients) {
        let data = clientsData.sort(function (a, b) {
            return b.TotalBill - a.TotalBill;
        });
        let newData = data.map((item) => {
            item.ClientName = item.Name;
            delete item.Name;
            return item;
        })

        return newData.slice(0, topClients);
    }
    async function details(req, res) {
        try {
            let validateData = getAgencySchema.validate(req.body);
            if (validateData.error) {
                let errorDetail = validateData.error.details[0].message;
                throw { status: CONSTANTS.FALSE, errorDetail, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: validateData.error, message: CONSTANTS_MESSAGE.INVALID_DATA };
            }

            let bodyData = _.pick(req.body, ['_id', 'clientCount']);

            let findData = await Models.AgencyDB.aggregate([
                {
                    $match: {
                        _id: ObjectId(bodyData._id),
                    }
                },
                {
                    $lookup:
                    {
                        from: 'clients',
                        localField: '_id',
                        foreignField: 'AgencyId',
                        as: 'clientsData'
                    }
                },
                {
                    $project: {
                        "Name": 1,
                        "clientsData.Name": 1,
                        "clientsData.TotalBill": 1
                    }
                },
            ]).sort({ updated: -1 });
            findData = findData[0];
            let topClients = await getTopClients(findData.clientsData, bodyData.clientCount);
            findData.topClients = topClients;
            findData.AgencyName = findData.Name;
            delete findData._id;
            delete findData.Name;
            delete findData.clientsData;
            res.send({
                status: CONSTANTS.TRUE,
                statusCode: CONSTANTS.SUCCESS,
                error: CONSTANTS.ERROR_FALSE,
                data: findData
            });
        }
        catch (e) {
            console.log('Error is', e);
            res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: e, message: "Error while getting Agency details." });
        }
    }
    return details;
}
function getByTopBilling(Models) {
    async function getTop(req, res) {
        try {
            let validateData = getClientCountSchema.validate(req.body);
            if (validateData.error) {
                let errorDetail = validateData.error.details[0].message;
                throw { status: CONSTANTS.FALSE, errorDetail, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: validateData.error, message: CONSTANTS_MESSAGE.INVALID_DATA };
            }

            let bodyData = _.pick(req.body, ['clientCount']);

            //let findData = await new Models.ClientDB.find({}, { _id: 0, Name: 1, TotalBill: 1, AgencyId: 1 }).sort({ TotalBill: 1 }).limit(bodyData.clientCount).
            let findData = await Models.ClientDB.aggregate([
                {
                    $lookup:
                    {
                        from: 'agencies',
                        localField: 'AgencyId',
                        foreignField: '_id',
                        as: 'agencyData'
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "Name": 1,
                        "agencyData.Name": 1,
                        "TotalBill": 1
                    }
                },
                {
                    $sort: { TotalBill: -1 }
                }
            ]).limit(bodyData.clientCount);
            console.log('findData is', findData)
            let newData = findData.map((item) => {
                item.AgencyName = item.agencyData[0].Name;
                item.ClientName = item.Name;
                delete item.agencyData;
                delete item.Name;
                return item;
            })
            res.send({ status: CONSTANTS.True, statusCode: CONSTANTS.SUCCESS, error: CONSTANTS.ERROR_FALSE, data: newData })

        }
        catch (e) {
            console.log('Error is', e);
            res.send({ status: CONSTANTS.FALSE, statusCode: CONSTANTS.FAILURE, error: CONSTANTS.ERROR_TRUE, errorDetails: e, message: "Error while getting Agency details." });
        }
    }
    return getTop;
}
module.exports = {
    createAgencyFunction,
    getAgencyFunction,
    getByTopBilling
};