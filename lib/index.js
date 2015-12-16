'use strict';

let database = require('./database');
let ndjson = require('ndjson');
let R = require('ramda');

/**
 * Closure for throwing an error on the next call
 * @param message
 */
let throws = (message) => () => {
  throw new Error(message);
};

/**
 * Submit a Raptor JSON log file to the database reporter
 * @param {object} options
 * @returns {Promise}
 */
let submit = (options) => {
  if (process.stdin.isTTY) {
    throw new Error('Using this method requires stdin, no stdin detected');
  }

  let points = [];

  return new Promise((resolve, reject) => {
    database(options)
      .then(client => {
        process.stdin
          .pipe(ndjson.parse())
          .on('data', data => points = points.concat(data))
          .on('end', () => client.writeMany(points).then(resolve).catch(reject))
      })
      .catch(reject);
  });
};

module.exports = R.cond([
  [R.propEq('database', R.isNil), throws('--database is required for metrics submission')],
  [R.T, submit]
]);
