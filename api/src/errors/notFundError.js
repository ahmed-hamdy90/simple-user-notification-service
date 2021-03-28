(function () {
    'use strict';

    /**
     * Represent custom Error will need to throw in case search for something not exists happened
     */
    class NotFundError extends Error {

        /**
         * NotFundError constructor
         * @param {string} message error's message value
         */
         constructor(message) {
             super(message);
             this.name = "NotFoundError";
         }
    }

    module.exports = NotFundError;
})();