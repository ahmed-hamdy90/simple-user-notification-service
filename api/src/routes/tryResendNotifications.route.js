(function () {
    'use strict';

    // load modules
    const express = require('express');
    const notificationService = require('../services/notification.service');
    const smsProvider = require('../providers/smsProvider');
    const pushNotificationProvider = require('../providers/pushNotificationProvider');
    const NOTIFICATION_TYPES = require('../utils/notificationType');

    // initialize express's router instance
    const router = express.Router();

    // define possible routes
    router.post('/', (req, res) => {
        // make sure given post parameter include need data
        if (req.body.type === undefined) {
            res.status(400);
            res.json({
                error: 'Invalid Request\'s body details'
            });
            return;
        }
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
        notificationService.setNotificationProvider(notificationProvider);
        notificationService
            .tryReSendFailedNotification(notificationType,
                _ => {
                    res.status(200);
                    res.json({});
                },
                err => {
                    res.status(500);
                    res.json({
                        error: error
                    });
                });
    });

    module.exports = router;
})();