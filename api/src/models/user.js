(function () {
    'use strict';

    // load modules
    const mongoDbAdapter = require('../adapters/mongoDbAdapter');

    /**
     * Represent User Mongoose Collection schema
     * @type {{name: string, mobile: {number: string, code: string}, email: string}}
     */
    const userSchema = {
        name: 'string',
        email: 'string',
        mobile: {
            number: 'string',
            code: 'string'
        }
    };

    module.exports = mongoDbAdapter.createModel('User', userSchema, {autoIncrement: true});
})();