(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');
    const notificationModel = require('../models/notification');
    const NOTIFICATION_TYPES = require('../utils/notificationType');
    const NOTIFICATION_STATUSES = require('../utils/notificationStatus');

    /**
     * Define Notification Db seeder loader
     */
    module.exports = function () {
        // create sent SMS notification
        const notification1 = new notificationModel({
            date: new Date(Date.now()).toUTCString(),
            type: NOTIFICATION_TYPES.SMS,
            title: 'SMS success notification',
            message: 'Test SMS',
            userWillSendTo: {
                id: 1,
                name: 'Ahmed',
                email: 'test1@test.com',
                mobile: {
                    number: '1234567',
                    code: '010'
                }
            },
            state: NOTIFICATION_STATUSES.SENT,
            numberOfTries: 0
        });
        mongoDbAdapter.save(
            notification1,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );

        // create ready to send push notification
        const notification2 = new notificationModel({
            date: new Date(Date.now()).toUTCString(),
            type: NOTIFICATION_TYPES.PUSH_NOTIFICATION,
            title: 'Push notification to send',
            message: 'Test PUSH',
            userWillSendTo: {
                id: 1,
                name: 'Ahmed',
                email: 'test1@test.com',
                mobile: {
                    number: '1234567',
                    code: '010'
                }
            },
            state: NOTIFICATION_STATUSES.READY_FOR_SEND,
            numberOfTries: 0
        });
        mongoDbAdapter.save(
            notification2,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );
        // create fail SMS notification with one number of tries
        const notification3 = new notificationModel({
            date: new Date(Date.now()).toUTCString(),
            type: NOTIFICATION_TYPES.SMS,
            title: 'SMS fail notification',
            message: 'Test SMS',
            userWillSendTo: {
                id: 1,
                name: 'Ahmed',
                email: 'test1@test.com',
                mobile: {
                    number: '1234567',
                    code: '010'
                }
            },
            state: NOTIFICATION_STATUSES.FAIL,
            numberOfTries: 1
        });
        mongoDbAdapter.save(
            notification3,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );
        // create fail SMS notification with max number of tries
        const notification4 = new notificationModel({
            date: new Date(Date.now()).toUTCString(),
            type: NOTIFICATION_TYPES.SMS,
            title: 'SMS fail notification',
            message: 'Test SMS',
            userWillSendTo: {
                id: 1,
                name: 'Ahmed',
                email: 'test1@test.com',
                mobile: {
                    number: '1234567',
                    code: '010'
                }
            },
            state: NOTIFICATION_STATUSES.FAIL,
            numberOfTries: 4
        });
        mongoDbAdapter.save(
            notification4,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );
    }
})();