import { IConfig } from './../interface';
import * as path from 'path';
import { names } from './names';

export const paths = {
  getModulesDir: (config: IConfig) =>
    path.join(process.cwd(), config.dir, 'modules'),
  getComponentsDir: (config: IConfig, moduleName: string) =>
    path.join(paths.getModuleDir(config, moduleName), 'components'),
  getAppFile: (config: IConfig) =>
    path.join(process.cwd(), config.dir, 'app.ts'),
  getContainerFile: (config: IConfig) =>
    path.join(process.cwd(), config.dir, 'container.ts'),
  getHarnessFile: (config: IConfig) =>
    path.join(process.cwd(), config.dir, 'harness.ts'),
  getInterfaceFile: (config: IConfig) =>
    path.join(process.cwd(), config.dir, 'interface.ts'),
  getRefFile: (config: IConfig) =>
    path.join(process.cwd(), config.dir, 'ref.ts'),
  getModuleDir: (config: IConfig, moduleName: string) =>
    path.join(paths.getModulesDir(config), names.getModuleDirName(moduleName)),
  getModuleFile: (config: IConfig, moduleName: string) =>
    path.join(paths.getModuleDir(config, moduleName), `${names.getModuleFileName(moduleName)}.ts`),
  getComponentFile: (config: IConfig, moduleName: string, componentName: string) =>
    path.join(paths.getComponentsDir(config, moduleName), `${names.getComponentFileName(componentName)}.ts`),
  getComponentTestFile: (config: IConfig, moduleName: string, componentName: string) =>
    path.join(paths.getComponentsDir(config, moduleName), `${names.getComponentFileName(componentName)}.spec.ts`)
};