(function () {
    'use strict';

    const AbstractNotificationProvider = require('../providers/abstractNotificationProvider');

    /**
     * Represent SMS notification provider class
     */
    class SmsProvider extends AbstractNotificationProvider {

        /**
         * {@inheritDoc}
         */
        sendNotification(user, messageTitle, messageBody, successCallback, errorCallback) {
            // TODO: implement real SMS provider
            successCallback();
        }
    }

    module.exports = new SmsProvider();
})();