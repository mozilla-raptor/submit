'use strict';

let submit = require('./lib');
let R = require('ramda');

module.exports = (cli) => {
  let command = cli.command('submit <metrics>');

  command
    .description('Submit a performance metrics file to an InfluxDB database')
    .action(function(args) {
      return Promise
        .resolve(R.merge({ metrics: args.metrics }, cli.getOptions(this)))
        .then(submit)
        .then(() => cli.log('Database results submitted successfully'))
        .catch(cli.exits)
    });

  cli.usesDatabase(command);

  return command;
};
