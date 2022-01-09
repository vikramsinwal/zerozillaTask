module.exports = function (mongoose) {
    mongoose.model('agency', require('./schema/agency'));
    mongoose.model('client', require('./schema/client'));

}