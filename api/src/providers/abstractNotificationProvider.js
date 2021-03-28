(function () {
    'use strict';

    /**
     * Represent base notification provider class for any provider
     */
    class AbstractNotificationProvider {

        /**
         * AbstractNotificationProvider constructor
         */
        constructor() {
            if (this.constructor === AbstractNotificationProvider) {
                throw new TypeError('This Class is abstract class, can\'t initialize instance from it');
            }
        }

        /**
         * Send a notification for user with given message's information
         * @param {Object} user user details instance who will send notification to him
         * @param {string} messageTitle message's title value
         * @param {string} messageBody message's body value
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        sendNotification(user, messageTitle, messageBody, successCallback, errorCallback) {
            throw new TypeError('This abstract method');
        }
    }

    module.exports = AbstractNotificationProvider;
})();