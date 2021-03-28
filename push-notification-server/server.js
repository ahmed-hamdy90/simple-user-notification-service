(function () {
    'use strict';

    // load configuration
    const environment = process.env.NODE_ENV || 'development';
    const configuration = require(`./config/config.${environment}.json`);
    const port = process.env.PORT ||  configuration.server.port;

    // load modules
    const express = require('express');
    const app = express();

    const http = require("http");
    const server = http.Server(app);

    const io = require('socket.io')(server, {
        path: "/push-notification",
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    // listen on any client has been connected to push notification server
    io.on(
        'connection',
        socket => console.log('a client connected to simple push notification socket.io server')
    );

    // application body json and url encode
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    // create one post request to send notification
    app.post('/send', (req, res) => {
        // take request's body details
        if (req.body.userId === undefined || req.body.message === undefined) {
            res.status(400);
            res.json('FAIL');
            return;
        }
        // send notification on event for given user by his id
        io.of('/').emit(`push-notification-for-${req.body.userId}`, req.body.message);

        res.status(201);
        res.json('OK');
    });
    // application handle wrong routes plus Error handler
    app.use((err, req, res, next) => {
        res.status(500);
        res.json({
            error: err
        });
    });

    // run server on chosen host and port
    server.listen(
        port,
        configuration.server.host,
        _ => console.log(`Running push notification server on http://${configuration.server.host}:${port}`)
    );
})();