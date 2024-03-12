const handel = require('./handlersFactory');
const Trips = require('../models/tripModel');

exports.getTrips = handel.getAll(Trips);

exports.getTrip = handel.getOne(Trips);

exports.createTrips = handel.createOne(Trips);

exports.updateTrips = handel.updateOne(Trips);

exports.deleteTrips = handel.deleteOne(Trips);
