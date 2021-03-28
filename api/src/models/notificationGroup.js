(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');

    /**
     * Represent Notification Group Mongoose Collection schema
     * @type {{name: string, users: [NumberConstructor]}}
     */
    const notificationGroupSchema = {
        name: 'string',
        users: [Number]
    };

    module.exports = mongoDbAdapter
        .createModel('NotificationGroup', notificationGroupSchema, {autoIncrement: true});
})();