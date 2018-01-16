import { templates } from './../helpers/templates';
import { dirPaths } from './../helpers/dirPaths';
import { setupDir } from '../helpers/setupDir';
import { setupFile } from '../helpers/setupFile';
import * as path from 'path';
import { IModuleConfig } from "../../interface";
import { filePaths } from '../helpers/filePaths';
import Ast, { ArrayLiteralExpression, FunctionDeclaration,
  Expression, ArrowFunction, FunctionExpression } from 'ts-simple-ast';
import { SyntaxKind, Declaration } from 'typescript';
import { createWrappedNode } from 'ts-simple-ast/dist/createWrappedNode';

const setupDirs = async (config: IModuleConfig) => {

  await setupDir(dirPaths.modules(config.dir, config.moduleName));

};

const setupFiles = async (config: IModuleConfig) => {

  const modulePath = filePaths.moduleIndex(config.dir, config.moduleName, false);

  const pathToRef = `./${path.relative(path.dirname(modulePath), filePaths.ref(config.dir, false))}`;

  await setupFile(
    filePaths.moduleIndex(config.dir, config.moduleName),
    templates.moduleIndex(config.moduleName, pathToRef),
  );

};

const addModuleContainerToAppContainer = async (config: IModuleConfig) => {

  const ast = new Ast();

  const containerFile = filePaths.container(config.dir);
  const moduleIndexFile = filePaths.moduleIndex(config.dir, config.moduleName);
  const moduleIndexSpecifier = filePaths.moduleIndex(config.dir, config.moduleName, false);

  ast.addExistingSourceFile(containerFile);

  const sourceFile = ast.getSourceFileOrThrow(containerFile);

  sourceFile.addImportDeclaration(
    {
      namedImports: [
        {
          name: config.moduleName
        }
      ],
      moduleSpecifier: `./${path.relative(path.dirname(containerFile), moduleIndexSpecifier)}`
    }
  );

  const container = sourceFile.getVariableDeclarationOrThrow('container')
    .getInitializerIfKind(SyntaxKind.ArrowFunction) as FunctionExpression;

  const moduleConfigs = container.getVariableDeclaration('moduleConfigs')
      .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression) as ArrayLiteralExpression;

  moduleConfigs.addElement(`
  {
    module: ${config.moduleName},
    config: {}
  }`);

  await sourceFile.save();

};
export const moduleCreate = async (config: IModuleConfig) => {

  await setupDirs(config);

  await setupFiles(config);

  await addModuleContainerToAppContainer(config);

};