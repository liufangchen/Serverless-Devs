import program from 'commander';
import { logger } from '../../utils';
import { CommandError } from '../../error';
import core from '../../utils/core';
const { inquirer } = core;
import { setConfig, getConfig } from '../../utils/handler-set-config';

const CUSTOMER_KEY = 'custom';
const registryList = [
  {
    key: 'https://api.github.com/repos',
    name: 'open source registry [Github source]',
    value: 'https://api.github.com/repos',
  },
  {
    key: 'http://gitee.registry.devsapp.cn/simple',
    name: 'open source registry [Gitee source] ',
    value: 'http://gitee.registry.devsapp.cn/simple',
  },
  {
    key: 'http://registry.devsapp.cn/simple',
    name: 'serverless devs offical registry [http://registry.devsapp.cn/simple]',
    value: 'http://registry.devsapp.cn/simple',
  },
  {
    key: CUSTOMER_KEY,
    name: 'custom registry',
    value: CUSTOMER_KEY,
  },
];

export const registryInquire = [
  {
    type: 'list',
    name: 'registry',
    message: 'Choose a registry?',
    choices: registryList,
  },
];
program
  .name('s set registry')
  .usage('[options]')
  .helpOption('-h, --help', 'Display help for command')
  .addHelpCommand(false)
  .description(
    `Set registry information.

     Example:
        $ s set registry
        $ s set registry http://registry.devsapp.cn/simple`,
  )
  .parse(process.argv);
(async () => {
  if (program.args.length === 0) {
    logger.log(`\n🔎 Current registry: ${getConfig('registry')}\n`);
    let answers = await inquirer.prompt(registryInquire);
    if (answers.registry === CUSTOMER_KEY) {
      answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'registry',
          message: 'Please input your customer registry?',
        },
      ]);
    }
    let registry = answers.registry;
    setConfig('registry', registry);
  }
  if (program.args.length > 0) {
    const r = program.args[0];
    if (r) {
      setConfig('registry', r);
      logger.success('Setup succeeded');
    }
  }
})().catch(err => {
  throw new CommandError(err.message);
});
