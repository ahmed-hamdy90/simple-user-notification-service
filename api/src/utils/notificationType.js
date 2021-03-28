(function () {
    'use strict';

    /**
     * Notification Types as simple Enumeration
     * @type {Object}
     */
    const notificationTypes = {
        SMS: 1,
        PUSH_NOTIFICATION: 2
    };

    module.exports = Object.freeze(notificationTypes);
})();