import * as changeCase from 'change-case';

export const names = {
  getModuleVarName: (name: string) => changeCase.camelCase(name),
  getModuleDirName: (name: string) => changeCase.camelCase(name),
  getModuleFileName: (name: string) => changeCase.camelCase(name),
  getComponentFileName: (name: string) => changeCase.pascalCase(name),
  getComponentClassName: (name: string) => changeCase.pascalCase(name),
  getComponentInterfaceName: (name: string) => `I${changeCase.pascalCase(name)}`,
  getRefName: (name: string) => changeCase.pascalCase(name)
};