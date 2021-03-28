(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');
    const userModel = require('../models/user');

    /**
     * Define User Db seeder loader
     */
    module.exports = function () {
        const user1 = new userModel({
            name: 'Ahmed',
            email: 'test1@test.com',
            mobile: {
                number: '1234567',
                code: '010'
            }
        });
        mongoDbAdapter.save(
            user1,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );

        const user2 = new userModel({
            name: 'Mohammed',
            email: 'test2@test.com',
            mobile: {
                number: '1234567',
                code: '012'
            }
        });

        mongoDbAdapter.save(
            user2,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );

        const user3 = new userModel({
            name: 'salah',
            email: 'test3@test.com',
            mobile: {
                number: '1234567',
                code: '015'
            }
        });

        mongoDbAdapter.save(
            user3,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            }
        );
    }
})();