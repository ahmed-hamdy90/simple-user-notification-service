(function () {
    'use strict';

    /**
     * Represent custom Error will need to throw in case bad request happened
     */
    class BadRequestError extends Error {

        /**
         * BadRequestError constructor
         * @param {string} message error's message value
         */
        constructor(message) {
            super(message);
            this.name = "BadRequestError";
        }
    }

    module.exports = BadRequestError;
})();