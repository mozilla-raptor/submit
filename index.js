'use strict';

let submit = require('./lib');

module.exports = (cli) => {
  let command = cli.command('submit');

  command
    .description('Submit piped in performance metrics to an InfluxDB database')
    .action(function() {
      return Promise
        .resolve(cli.getOptions(this))
        .then(submit)
        .then(() => cli.log('Database results submitted successfully'))
        .catch(cli.exits)
    });

  cli.usesDatabase(command);

  return command;
};
