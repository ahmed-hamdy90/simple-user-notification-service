(function () {
    'use strict';

    // load modules
    const userDBSeeder = require('./src/seeds/user.seeder');
    const notificationGroupDBSeeder = require('./src/seeds/notificationGroup.seeder');
    const notificationDBSeeder = require('./src/seeds/notification.seeder');

    /**
     * load available Db seeder loaders process
     */
    const loadDbSeed = function () {
        // load users collection DB seeder
        userDBSeeder();
        // load notification groups collection DB seeder
        notificationGroupDBSeeder();
        // load notification collection DB seeder
        notificationDBSeeder();
    }

    loadDbSeed();
})();