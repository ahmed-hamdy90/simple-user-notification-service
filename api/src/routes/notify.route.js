(function () {
    'use strict';

    // load modules
    const express = require('express');
    const userService = require('../services/user.service');
    const notificationGroupService = require('../services/notificationGroup.service');
    const notificationService = require('../services/notification.service');
    const smsProvider = require('../providers/smsProvider');
    const pushNotificationProvider = require('../providers/pushNotificationProvider');
    const NotFoundError = require('../errors/notFundError');
    const NOTIFICATION_TYPES = require('../utils/notificationType');

    // initialize express's router instance
    const router = express.Router();

    // define possible routes
    router.post('/user/:userId', (req, res) => {
        // make sure given post parameter include need data
        if (req.body.type === undefined ||
            req.body.title === undefined ||
            req.body.message === undefined) {
            res.status(400);
            res.json({
                error: 'Invalid Request\'s body details'
            });
            return;
        }
        const notificationDetails = {
            title: req.body.title,
            message: req.body.message
        };
        // according to given type will define notification type and notification provider
        let notificationType;
        let notificationProvider;
        switch (req.body.type) {
            case 1:
                notificationType = NOTIFICATION_TYPES.SMS;
                notificationProvider = smsProvider;
                break;
            case 2:
                notificationType = NOTIFICATION_TYPES.PUSH_NOTIFICATION;
                notificationProvider = pushNotificationProvider;
                break;
            default:
                notificationType = null;
        }
        if (notificationType === null) {
            res.status(400);
            res.json({
                error: 'Not supported message type'
            });
            return;
        }
        // search of given user then send message
        userService.findUserById(
            req.params.userId,
            user => {
                notificationService.setNotificationProvider(notificationProvider);
                notificationService
                    .saveAndSendNotification(
                        user,
                        notificationType,
                        notificationDetails,
                        result => {
                            console.log(result);
                            res.status(201);
                            res.json({result: 'Sent'});
                        },
                        err => {
                            console.error(err);
                            res.status(200);
                            res.json({result: 'Saved But Not sent'});
                        });
            },
            error => {
                console.error(error);
                res.status((error instanceof NotFoundError) ? 404 : 500);
                res.json({
                    error: error
                });
            });
    });

    router.post('/group/:groupId', (req, res) => {
        // make sure given post parameter include need data
        if (req.body.type === undefined ||
            req.body.title === undefined ||
            req.body.message === undefined) {
            res.status(400);
            res.json({
                error: 'Invalid Request\'s body details'
            });
            return;
        }
        const notificationDetails = {
            title: req.body.title,
            message: req.body.message
        };
        // according to given type will define notification type and notification provider
        let notificationType;
        let notificationProvider;
        switch (req.body.type) {
            case 1:
                notificationType = NOTIFICATION_TYPES.SMS;
                notificationProvider = smsProvider;
                break;
            case 2:
                notificationType = NOTIFICATION_TYPES.PUSH_NOTIFICATION;
                notificationProvider = pushNotificationProvider;
                break;
            default:
                notificationType = null;
        }
        if (notificationType === null) {
            res.status(400);
            res.json({
                error: 'Not supported message type'
            });
            return;
        }
        // search of given group then extract users under retrieved group then send message
        notificationGroupService.findGroupById(
            req.params.groupId,
            group => {
                // first check this group has already users
                if (group.users.length === 0) {
                    res.status(400);
                    res.json({
                        error: 'Given group not have users under it'
                    });
                    return;
                }
                // get users under this group
                userService
                    .findUsersByIds(
                        group.users,
                        users => {
                            if (users.length === 0) {
                                res.status(400);
                                res.json({
                                    error: 'Given group not have users under it'
                                });
                                return;
                            }
                            notificationService.setNotificationProvider(notificationProvider);
                            // loop on users and send notification
                            users.forEach(user => {
                                notificationService
                                    .saveAndSendNotification(
                                        user,
                                        notificationType,
                                        notificationDetails,
                                        result => console.log(result),
                                        err => console.error(err));
                            });
                            res.status(200);
                            res.json({
                                result: 'notification saved and sent to users under group'
                            });
                        }, error => {
                            res.status(500);
                            res.json({
                                error: error
                            });
                        });
            },
            error => {
                console.error(error);
                res.status((error instanceof NotFoundError) ? 404 : 500);
                res.json({
                    error: error
                });
            });
    });

    module.exports = router;
})();