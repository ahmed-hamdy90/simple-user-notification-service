(function () {
    'use strict';

    // load configuration
    const environment = process.env.NODE_ENV || 'development';
    const configuration = require(`./src/config/config.${environment}.json`);
    const port = process.env.PORT || configuration.api.port;

    // load modules
    const express = require('express');
    const notifyRoutes = require('./src/routes/notify.route');
    const tryResendNotificationsRoutes = require('./src/routes/tryResendNotifications.route');
    const NotFoundError = require('./src/errors/notFundError');
    const BadRequestError = require('./src/errors/badRequestError');

    // initialize express application
    const app = express();

    // application body json and url encode
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    // application's routes
    app.use('/api/notify', notifyRoutes);
    app.use('/api/trySendNotifications', tryResendNotificationsRoutes);
    // application handle wrong routes
    app.all('*', (req, res) => {
        throw new BadRequestError('Invalid Request');
    })
    // application handle wrong routes plus Error handler
    app.use((err, req, res, next) => {
        let status;
        if (err instanceof NotFoundError) {
            status = 404;
        } else if (err instanceof BadRequestError) {
            status = 400;
        } else {
            status = 500;
        }
        res.status(status);
        res.json({
            error: err
        });
    });

    // make server run on chosen host and port
    app.listen(
        port,
        configuration.api.host,
        _ => console.log(`Running Node API on http://${configuration.api.host}:${port}`)
    );
})();