(function () {
    'use strict';

    /**
     * Notification Status types as simple Enumeration
     * @type {Object}
     */
    const notificationStatuses = {
        READY_FOR_SEND: 'readyToSend',
        SENT: 'sent',
        FAIL: 'fail'
    };

    module.exports = Object.freeze(notificationStatuses);
})();