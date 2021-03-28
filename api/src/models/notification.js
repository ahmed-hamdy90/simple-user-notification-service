(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');

    /**
     * Represent Notification Mongoose Collection schema
     * @type {{date: string, userWillSendTo: {name: string, mobile: {number: string, code: string}, id: string, email: string}, numberOfTries: string, state: string, type: string, title: string, message: string}}
     */
    const notificationSchema = {
        date: 'string',
        type: 'number',
        title: 'string',
        message: 'string',
        userWillSendTo: {
            id: 'number',
            name: 'string',
            email: 'string',
            mobile: {
                number: 'string',
                code: 'string'
            }
        },
        state: 'string',
        numberOfTries: 'number'
    };

    module.exports = mongoDbAdapter.createModel('Notification', notificationSchema);
})();