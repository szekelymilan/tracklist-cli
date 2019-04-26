#!/usr/bin/env node

const { bold } = require('chalk');
const meow = require('meow');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');
const _generate = require('./src/generate');

const cli = meow(
  `
 ${bold('Usage')}
   $ tracklist <options>

 ${bold('Options')}
   -o, --output    Path to output file

 ${bold('Examples')}
   See: https://github.com/szekelymilan/tracklist#readme
`,
  {
    flags: {
      output: {
        type: 'string',
        alias: 'o',
        default: '',
      },
    },
  },
);

const { output: OUTPUT } = cli.flags;

(async () => {
  let noFlag = true;

  updateNotifier({ pkg }).notify();

  if (OUTPUT !== undefined && OUTPUT != '') {
    await _generate(OUTPUT);
    noFlag = false;
  }

  if (noFlag) cli.showHelp();

  process.exit();
})();
