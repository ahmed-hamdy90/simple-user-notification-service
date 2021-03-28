(function () {
    'use strict';
    // load configuration
    const environment = process.env.NODE_ENV || 'development';
    const configuration = require(`../config/config.${environment}.json`);

    // load modules
    const axios = require('axios');
    const AbstractNotificationProvider = require('../providers/abstractNotificationProvider');

    /**
     * Represent Push Notification provider class
     */
    class PushNotificationProvider extends AbstractNotificationProvider {
        httpClient;
        pushNotificationRequestPath;

        /**
         * PushNotificationProvider
         * @param {*} axios axios library instance
         * @param {Object} serverConfig push notification server configuration
         */
        constructor(axios, serverConfig) {
            super();
            this.httpClient = axios;
            this.pushNotificationRequestPath = `http://${serverConfig.host}:${serverConfig.port}/send`;
        }

        /**
         * {@inheritDoc}
         */
        sendNotification(user, messageTitle, messageBody, successCallback, errorCallback) {
            this.httpClient
                .post(this.pushNotificationRequestPath, {userId: user.id, message: messageBody})
                .then(res => {
                    console.log(res);
                    successCallback();
                })
                .catch(err => {
                    console.error(err);
                    errorCallback(err);
                });
        }
    }

    module.exports = new PushNotificationProvider(axios, configuration.pushNotificationServer);
})();