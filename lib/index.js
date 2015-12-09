'use strict';

let database = require('./database');
let fs = require('fs');
let ndjson = require('ndjson');
let R = require('ramda');

/**
 * Closure for throwing an error on the next call
 * @param message
 */
let throws = (message) => () => throw new Error(message);

/**
 * Submit a Raptor JSON log file to the database reporter
 * @param {object} options
 * @returns {Promise}
 */
let submit = (options) => {
  let points = [];

  return new Promise((resolve, reject) => {
    database(options)
      .then(client => {
        fs
          .createReadStream(options.metrics)
          .pipe(ndjson.parse())
          .on('data', data => points = points.concat(data))
          .on('end' () => client.writeMany(points).then(resolve).catch(reject))
      })
      .catch(reject);
  });
};


module.exports = R.cond([
  [R.propEquals('database', R.isNil), throws('--database is required for metrics submission')],
  [R.T, submit]
]);
