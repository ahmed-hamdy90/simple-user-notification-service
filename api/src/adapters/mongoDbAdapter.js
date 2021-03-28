(function () {
    'use strict';

    // load configuration
    const environment = process.env.NODE_ENV || 'development';
    const configuration = require(`../config/config.${environment}.json`);

    // load modules
    const mongoose = require('mongoose');
    const autoIncrementPlugin = require('mongoose-sequence')(mongoose);

    /**
     * MongoDb adapter class who responsible for any Db operations
     */
    class MongoDbAdapter {

        adapter;

        /**
         * MongoDbAdapter constructor
         * @param {*} mongo mongoose library instance
         * @param {Object} config mongoDb configuration details
         */
        constructor(mongo, config) {
            const dbUri = 'mongodb://' + config.host + '/' + config.database;
            const dbOptions = {
                useNewUrlParser: true
            }
            mongo.connect(dbUri, dbOptions);
            this.adapter = mongo;
        }

        /**
         * Create a mongoose model instance for collection under mongoDB
         * @param {string} name model's name value
         * @param {Object} schema model's schema details
         * @param {Object} [options] options need to pass during create model instance
         */
        createModel(name, schema, options = {}) {
            let applyAutoIncrementPlugin = false;
            if (options.hasOwnProperty('autoIncrement')) {
                applyAutoIncrementPlugin = true;
                delete options.autoIncrement;
                schema[`${name.toLowerCase()}_id`] = 'Number';
            }
            // create Schema as object
            const schemaObject = new this.adapter.Schema(schema, options);
            // apply plugin if needed
            if (applyAutoIncrementPlugin) {
                schemaObject.plugin(
                    autoIncrementPlugin, {inc_field: `${name.toLowerCase()}_id`, collection_name: 'idsSequence'});
            }
            // setting virtual method for model Id
            if (applyAutoIncrementPlugin) {
                schemaObject.virtual('id').get(function() { return this[`${name.toLowerCase()}_id`] });
            } else {
                schemaObject.virtual('id').get(function() { return this._id });
            }

            return this.adapter.model(name, schemaObject);
        }

        /**
         * Save given mongoose model
         * @param {*} model model instance which need to save
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        save(model, successCallback, errorCallback) {
            model.save((err, result) => {
                if (err) {
                    errorCallback(err);
                    return; 
                }
                successCallback(result);
            });
        }

        /**
         * Update an exists model
         * @param {*} model model instance which need to edit
         * @param {string} id model's id which need to edit
         * @param {Object} updatedData updated model's data which need to edit
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        update(model, id, updatedData, successCallback, errorCallback) {
            model.updateOne({_id: id}, updatedData, (err, result) => {
                if (err) {
                    errorCallback(err);
                    return;
                }
                successCallback(result);
            });
        }

        /**
         * Retrieve all data under given mongoose model's collection
         * @param {*} model model instance which need get it's data
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        findAll(model, successCallback, errorCallback) {
            model.find((err, result) => {
                if (err) {
                    errorCallback(err);
                    return; 
                }
                successCallback(result);
            });
        }

        /**
         * Search for data under given mongoose model's collection
         * @param {*} model model instance which need to search into it's data
         * @param {Object} criteria define which filter will apply to search for data
         * @param {function} successCallback success callback function will called on process done successfully
         * @param {function} errorCallback error callback function will called on process failed
         */
        findByCriteria(model, criteria, successCallback, errorCallback) {
            // must given criteria as object
            if (criteria === undefined || typeof criteria !== "object") {
                errorCallback(new Error('Invalid given criteria to search with'));
            }
            model.find(criteria, (err, result) => {
                if (err) {
                    errorCallback(err);
                    return;
                }
                successCallback(result);
            });
        }
    }

    module.exports = new MongoDbAdapter(mongoose, configuration.databaseConfig);
})();