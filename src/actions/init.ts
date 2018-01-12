import { dirPaths } from './helpers/dirPaths';
import { IInitConfig } from './../interface';
import * as fs from 'fs-extra';
import * as path from 'path';
import { filePaths } from './helpers/filePaths';
import { templates } from './helpers/templates';

interface IFileSetup {
  path: string;
  template: string;
}

interface IDirSetup {
  path: string;
}

const setupFileStep = async (mySetupStep: IFileSetup) => {

  if (false === await fs.pathExists(mySetupStep.path)) {

    await fs.ensureFile(mySetupStep.path);

    await fs.writeFile(mySetupStep.path, mySetupStep.template);

  }

};

const setupDirStep = async (mySetupStep: IDirSetup) => {

  if (false === await fs.pathExists(mySetupStep.path)) {

    await fs.ensureDir(mySetupStep.path);

  }

};

const setupDirs = async (config: IInitConfig) => {

  const setups: IDirSetup[] = [
    {
      path: dirPaths.modules(config.folder)
    }
  ];

  await Promise.all(
    setups.map((setup) => setupDirStep(setup))
  );

};

const setupFiles = async (config: IInitConfig) => {

  const setups: IFileSetup[] = [
    {
      path: filePaths.app(config.folder),
      template: templates.app
    },
    {
      path: filePaths.container(config.folder),
      template:  templates.container
    },
    {
      path: filePaths.harness(config.folder),
      template: templates.harness
    },
    {
      path: filePaths.interface(config.folder),
      template: ``
    },
    {
      path: filePaths.ref(config.folder),
      template: templates.ref
    }
  ];

  await Promise.all(
    setups.map((setup) => setupFileStep(setup))
  );

};

export const init = async (config: IInitConfig) => {

  await setupFiles(config);

  await setupDirs(config);

};