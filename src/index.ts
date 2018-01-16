import { moduleCreate } from './actions/module/moduleCreate';
import { componentCreate } from './actions/module/componentCreate';
import * as yargs from 'yargs';
import { EActions } from './interface';
import { init } from './actions/init';

const myCommand = yargs
.command(
  `${EActions.INIT} <folder>`,
  `Create an App`,
  (conf: yargs.Argv) => conf.option('folder', { describe: 'Folder', demandOption: true})
)
.command(
  `${EActions.MODULE} <action> <folder> <moduleName>`,
  'Create a Module',
  (conf: yargs.Argv) =>
    conf
      .option('action', { describe: 'Action', demandOption: true})
      .option('folder', { describe: 'Folder', demandOption: true})
      .option('moduleName', { describe: 'Name of Module', demandOption: true})
)
.command(
  `${EActions.COMPONENT} <action> <folder> <moduleName> <componentName>`,
  'Create a Component',
  (conf: yargs.Argv) =>
    conf
      .option('action', { describe: 'Action', demandOption: true})
      .option('folder', { describe: 'Folder', demandOption: true})
      .option('moduleName', { describe: 'Name of Module', demandOption: true})
      .option('componentName', { describe: 'Name of Component', demandOption: true})
)
.argv;

const main = async () => {

  try {

  switch (myCommand._[0]) {

    case EActions.INIT:

      await init(
        {
          dir: myCommand.folder
        }
      );

      break;

    case EActions.MODULE:

      switch (myCommand.action) {

        case 'create':

          await moduleCreate(
            {
              dir: myCommand.folder,
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
            {
              dir: myCommand.folder,
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