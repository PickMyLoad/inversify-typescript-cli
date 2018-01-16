import { util } from './helpers/util';
import { moduleCreate } from './actions/moduleCreate';
import { componentCreate } from './actions/componentCreate';
import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import { EActions, IConfig } from './interface';
import { init } from './actions/init';

const myCommand = yargs.config(
    util.getConfig()
  )
  .command(
    `${EActions.INIT}`,
    `Create an App`
  )
  .command(
    `${EActions.MODULE} <action> <moduleName>`,
    'Create a Module',
    (conf: yargs.Argv) =>
      conf
        .option('action', { describe: 'Action', demandOption: true})
        .option('moduleName', { describe: 'Name of Module', demandOption: true})
  )
  .command(
    `${EActions.COMPONENT} <action> <moduleName> <componentName>`,
    'Create a Component',
    (conf: yargs.Argv) =>
      conf
        .option('action', { describe: 'Action', demandOption: true})
        .option('moduleName', { describe: 'Name of Module', demandOption: true})
        .option('componentName', { describe: 'Name of Component', demandOption: true})
  ).argv;

const main = async () => {

  const config: IConfig = {
    dir: myCommand.dir,
    componentTests: myCommand.componentTests
  };

  try {
    switch (myCommand._[0]) {

      case EActions.INIT:

        await init(
          config
        );

        break;

      case EActions.MODULE:

        switch (myCommand.action) {

          case 'create':

            await moduleCreate(
              config,
              {
                moduleName: myCommand.moduleName
              }
            );

            break;

        }

        break;

      case EActions.COMPONENT:

        switch (myCommand.action) {

          case 'create':

            await componentCreate(
              config,
              {
                moduleName: myCommand.moduleName,
                componentName: myCommand.componentName
              }
            );

            break;

        }

        break;

    }

    process.exit();

} catch (e) {

  // tslint:disable-next-line:no-console
  console.log(e);

}

};

main();