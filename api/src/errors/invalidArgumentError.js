(function () {
    'use strict';

    /**
     * Represent custom Error will need to throw in case passing invalid argument happened
     */
    class InvalidArgumentError extends Error {

        /**
         * InvalidArgumentError constructor
         * @param {string} message error's message value
         */
        constructor(message) {
            super(message);
            this.name = "InvalidArgumentError";
        }
    }

    module.exports = InvalidArgumentError;
})();