const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const servicesRoute = require('./servicesRoute');
const DevicesRoute = require('./devicesRoutes');
const notificationRoute = require('./notificationroute');
const mapRoute = require("./mapRoute");
const tripRoute = require("./tripRoute");
const reviewRoute = require('./reviewRoute');

const mountRoutes = (app) => {
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/services', servicesRoute);
  app.use('/api/v1/device', DevicesRoute);
  app.use('/api/v1/notification', notificationRoute);
  app.use("/api/v1/map", mapRoute);
  app.use("/api/v1/trip", tripRoute);
  app.use('/api/v1/reviews', reviewRoute);
};

module.exports = mountRoutes;
