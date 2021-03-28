(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');
    const userModel = require('../models/user');
    const NotFoundError = require('../errors/notFundError');

    /**
     * User service class
     */
    class UserService {
        dbAdapter;
        model;

        /**
         * UserService constructor
         * @param {Object} mongoDbAdapter mongoDb adapter instance
         * @param {Object} userModel user mongoose model instance
         */
        constructor(mongoDbAdapter, userModel) {
            this.dbAdapter = mongoDbAdapter;
            this.model = userModel;
        }

        /**
         * Find a user with given id value
         * @param {string} id user's id value will search for it
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        findUserById(id, successCallback, errorCallback) {
            const criteria = {
                'user_id': id
            };
            this.dbAdapter
                .findByCriteria(
                    this.model,
                    criteria,
                    (users) => {
                        if (users === undefined || !Array.isArray(users) || users.length === 0) {
                            errorCallback(new NotFoundError(`There no user with given Id: ${id}`));
                            return;
                        }
                        // take the first user object
                        const retrievedUser = users[0];
                        successCallback(retrievedUser);
                    },
                    (error) => {
                        console.error(error);
                        errorCallback(error);
                    }
                );
        }

        /**
         * Find users using their ids values
         * @param {string[]} ids ids of users which want to search for them
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        findUsersByIds(ids, successCallback, errorCallback) {
            if (!Array.isArray(ids) || ids.length === 0) {
                errorCallback(new Error('Must given need User Ids as Array and not empty'));
                return;
            }
            const criteria = {
                'user_id': {$in: ids}
            }
            this.dbAdapter
                .findByCriteria(
                    this.model,
                    criteria,
                    (data) => {
                        console.log(data);
                        successCallback(data);
                    },
                    (error) => {
                        console.error(error);
                        errorCallback(error);
                    }
                );
        }
    }

    module.exports = new UserService(mongoDbAdapter, userModel);
})();