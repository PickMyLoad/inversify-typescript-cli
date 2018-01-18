import { IConfig } from './../interface';
import { util } from './../helpers/util';
import * as fs from 'fs-extra';
import * as path from 'path';
import { paths } from './../helpers/paths';
import { templates } from './../helpers/templates';

const setupDirs = async (config: IConfig) => {

  await util.setupDir(paths.getModulesDir(config));

};

const setupFiles = async (config: IConfig) => {

  const setups = [
    {
      path: paths.getAppFile(config),
      template: templates.app
    },
    {
      path: paths.getContainerFile(config),
      template:  templates.container
    },
    {
      path: paths.getHarnessFile(config),
      template: templates.harness
    },
    {
      path: paths.getInterfaceFile(config),
      template: templates.interface
    },
    {
      path: paths.getRefFile(config),
      template: templates.ref
    }
  ];

  await Promise.all(
    setups.map((setup) => util.setupFile(setup.path, setup.template))
  );

};

export const init = async (config: IConfig) => {

  await setupFiles(config);

  await setupDirs(config);

};