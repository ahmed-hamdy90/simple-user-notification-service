(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');
    const groupModel = require('../models/notificationGroup');
    const NotFoundError = require('../errors/notFundError');

    /**
     * Notification group service class
     */
    class NotificationGroupService {
        dbAdapter;
        model;

        /**
         * NotificationGroupService constructor
         * @param {Object} mongoDbAdapter mongoDb adapter instance
         * @param {Object} groupModel notification group mongoose model instance
         */
        constructor(mongoDbAdapter, groupModel) {
            this.dbAdapter = mongoDbAdapter;
            this.model = groupModel;
        }

        /**
         * Find a group using it's id value
         * @param {string} id group's id which we need to search for
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        findGroupById(id, successCallback, errorCallback) {
            const criteria = {
                'notificationgroup_id': id
            };
            this.dbAdapter
                .findByCriteria(
                    this.model,
                    criteria,
                    (groups) => {
                        if (groups === undefined || !Array.isArray(groups) || groups.length === 0) {
                            errorCallback(
                                new NotFoundError(`There no notification group with given Id: ${id}`));
                            return;
                        }
                        // take the first group object
                        const retrievedGroup = groups[0];
                        successCallback(retrievedGroup);
                    },
                    (error) => {
                        console.error(error);
                        errorCallback(error);
                    }
                );
        }
    }

    module.exports = new NotificationGroupService(mongoDbAdapter, groupModel);
})();