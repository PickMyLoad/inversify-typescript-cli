import * as yargs from 'yargs';
import { EActions } from './interface';
import { init } from './actions/init';

const myCommand = yargs
.command(
  `${EActions.INIT} <folder>`,
  `initialize the application`,
  (conf: yargs.Argv) => conf.option('folder', { describe: 'Folder', demandOption: true})
)
.argv;

const main = async () => {

  try {

  switch (myCommand._[0]) {

    case EActions.INIT:

      await init(
        {
          folder: myCommand.folder
        }
      );

      break;

  }

  process.exit();

} catch (e) {

  // tslint:disable-next-line:no-console
  console.log(e);

}

};

main();