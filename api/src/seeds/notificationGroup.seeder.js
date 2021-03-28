(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');
    const notificationGroupModel = require('../models/notificationGroup');

    /**
     * Define notification Group Db seeder loader
     */
    module.exports = function () {
        const group1 = new notificationGroupModel({
            name: 'alex-company-group',
            users: [1, 2]
        });
        mongoDbAdapter.save(
            group1,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );
    }
})();