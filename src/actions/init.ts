import { setupDir } from './helpers/setupDir';
import { setupFile } from './helpers/setupFile';
import { dirPaths } from './helpers/dirPaths';
import { IInitConfig } from './../interface';
import * as fs from 'fs-extra';
import * as path from 'path';
import { filePaths } from './helpers/filePaths';
import { templates } from './helpers/templates';

const setupDirs = async (config: IInitConfig) => {

  await setupDir(dirPaths.modules(config.dir));

};

const setupFiles = async (config: IInitConfig) => {

  const setups = [
    {
      path: filePaths.app(config.dir),
      template: templates.app
    },
    {
      path: filePaths.container(config.dir),
      template:  templates.container
    },
    {
      path: filePaths.harness(config.dir),
      template: templates.harness
    },
    {
      path: filePaths.interface(config.dir),
      template: ``
    },
    {
      path: filePaths.ref(config.dir),
      template: templates.ref
    }
  ];

  await Promise.all(
    setups.map((setup) => setupFile(setup.path, setup.template))
  );

};

export const init = async (config: IInitConfig) => {

  await setupFiles(config);

  await setupDirs(config);

};