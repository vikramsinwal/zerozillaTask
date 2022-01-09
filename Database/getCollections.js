module.exports = function (mongoose) {

    const AgencyDB = mongoose.model('agency');
    const ClientDB = mongoose.model('client');
    return {
        AgencyDB,
        ClientDB
    }
}