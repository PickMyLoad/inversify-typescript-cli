import * as changeCase from 'change-case';
import * as path from 'path';

const formatPathSegments = (segment: string, transformer: (val: string) => string, extension = "") => {

  const thePath = segment.split(path.sep).map(
    (pathPart) => transformer(pathPart)
  );

  thePath[(thePath.length - 1)] += extension;

  return thePath;

};

export const names = {
  getModuleVarName: (name: string) => changeCase.camelCase(path.basename(name)),
  getModuleDirName: (name: string) => formatPathSegments(name, changeCase.camelCase),
  getModuleFileName: (name: string) => [
    ...formatPathSegments(name, changeCase.camelCase), // get the directory portion
    ...formatPathSegments(path.basename(name), changeCase.camelCase, '.ts') // get the basename portion
  ],
  getComponentFileName: (name: string) => formatPathSegments(name, changeCase.pascalCase, '.ts'),
  getComponentTestFileName: (name: string) => formatPathSegments(name, changeCase.pascalCase, '.spec.ts'),
  getComponentClassName: (name: string) => changeCase.pascalCase(path.basename(name)),
  getComponentInterfaceName: (name: string) => `I${changeCase.pascalCase(path.basename(name))}`,
  getRefName: (name: string) => changeCase.pascalCase(name)
};