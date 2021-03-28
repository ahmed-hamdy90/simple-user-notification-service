(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');
    const notificationModel = require('../models/notification');
    const AbstractNotificationProvider = require('../providers/abstractNotificationProvider');
    const InvalidArgumentError = require('../errors/invalidArgumentError');
    const NOTIFICATION_TYPES = require('../utils/notificationType');
    const NOTIFICATION_STATUSES = require('../utils/notificationStatus');

    /**
     * Notification service class
     */
    class NotificationService {
        dbAdapter;
        model
        notificationProvider;

        /**
         * NotificationService constructor
         * @param {Object} mongoDbAdapter mongoDb adapter instance
         * @param {Object} notificationModal notification mongoose model instance
         */
        constructor(mongoDbAdapter, notificationModal) {
            this.dbAdapter = mongoDbAdapter;
            this.model = notificationModal;
        }

        /**
         * Setting notification provider instance, as use Method Dependency injection type
         * @param {Object} provider notification provider will use for send notification(s)
         */
        setNotificationProvider(provider) {
            if (provider === null || provider === undefined || !(provider instanceof AbstractNotificationProvider)) {
                throw new InvalidArgumentError('Must given provider instance from AbstractNotificationProvider class');
            }
            this.notificationProvider = provider;
        }

        /**
         * Save and try to sent given notification
         * @param {Object} user user's details instance who need to send notification to
         * @param {number} notificationType type of notification which need to send
         * @param {Object} notificationDetails details of notification will need to send include title and message
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        saveAndSendNotification(user, notificationType, notificationDetails, successCallback, errorCallback) {
            // first make sure given notification type one of supported types
            if (!this.isNotificationTypeSupported(notificationType)) {
                throw new InvalidArgumentError('Given notification type not supported');
            }
            // then make sure provider is setting
            if (this.notificationProvider === undefined) {
                throw new Error('Must call setNotificationProvider method before send message');
            }
            // create notification model
            const newNotification = new this.model({
                date: new Date(Date.now()).toUTCString(),
                type: notificationType,
                title: notificationDetails.title,
                message: notificationDetails.message,
                userWillSendTo: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                },
                state: NOTIFICATION_STATUSES.READY_FOR_SEND,
                numberOfTries: 0
            });
            // save new notification
            this.dbAdapter.save(
                newNotification,
                notification => {
                    console.log(notification);
                    // then try to send this notification using provider
                    this.notificationProvider
                        .sendNotification(
                            user,
                            notificationDetails.title,
                            notificationDetails.message,
                            result => {
                                console.log(result);
                                // in case send process done successfully will update saved notification's type
                                this.dbAdapter
                                    .update(
                                        notificationModel,
                                        notification.id,
                                        {state: NOTIFICATION_STATUSES.SENT},
                                        notification => console.log(notification),
                                        err => console.error(err));
                                successCallback({saved: true, sent: true});
                            },
                            err => {
                                console.error(err);
                                // in case send process failed will update saved notification's type
                                this.dbAdapter
                                    .update(
                                        notificationModel,
                                        notification.id,
                                        {state: NOTIFICATION_STATUSES.FAIL, numberOfTries: 1},
                                        notification => console.log(notification),
                                        err => console.error(err));
                                errorCallback(err);
                            });
                },
                err => {
                    console.error(err);
                    errorCallback(err);
                }
            );
        }

        /**
         * Retry to send the failed notifications to user again,
         * failed notification which has number of tries less than 3 times only will try to re-send
         * as notification reach to maximum tries
         * @param {number} notificationType type of notification which need to send
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        tryReSendFailedNotification(notificationType, successCallback, errorCallback) {
            // first make sure given notification type one of supported types
            if (!this.isNotificationTypeSupported(notificationType)) {
                throw new InvalidArgumentError('Given notification type not supported');
            }
            // then make sure provider is setting
            if (this.notificationProvider === undefined) {
                throw new Error('Must call setNotificationProvider method before send message');
            }
            // search for notification was failed to send and number of Tries less than 4 times only
            this.dbAdapter
                .findByCriteria(
                    notificationModel,
                    {type: notificationType, state: NOTIFICATION_STATUSES.FAIL, numberOfTries: {$lt: 4}},
                    notifications => {
                        // must check if there already notifications or not before try again
                        if (notifications === undefined || !Array.isArray(notifications) || notifications.length === 0) {
                            successCallback({result: 'There no notification to re-send them'});
                            return;
                        }
                        // loop on notifications to try re-send them again
                        notifications.forEach(notification => {
                            this.notificationProvider
                                .sendNotification(
                                    notification.user,
                                    notification.title,
                                    notification.message,
                                    result => {
                                        console.log(result);
                                        // in case send process done successfully will update saved notification's type
                                        this.dbAdapter
                                            .update(
                                                notificationModel,
                                                notification._id,
                                                {state: NOTIFICATION_STATUSES.SENT},
                                                notification => console.log(notification),
                                                err => console.error(err));
                                    },
                                    err => {
                                        console.error(err);
                                        // in case send process failed will update saved notification's type
                                        this.dbAdapter
                                            .update(
                                                notificationModel,
                                                notification._id,
                                                {state: NOTIFICATION_STATUSES.FAIL, numberOfTries: notification.numberOfTries + 1},
                                                notification => console.log(notification),
                                                err => console.error(err));
                                    });
                        });
                        successCallback();
                    },
                    error => {
                        console.error(error);
                        errorCallback(error);
                    });
        }

        /**
         * Determine whether notification type is one supported types or not
         * @param {number} type type which will check for it
         * @returns {boolean}
         */
        isNotificationTypeSupported(type) {
            return (type === NOTIFICATION_TYPES.SMS || type === NOTIFICATION_TYPES.PUSH_NOTIFICATION);
        }
    }

    module.exports = new NotificationService(mongoDbAdapter, notificationModel);
})();