import { templates } from './../helpers/templates';
import { dirPaths } from './../helpers/dirPaths';
import { setupDir } from '../helpers/setupDir';
import { setupFile } from '../helpers/setupFile';
import * as path from 'path';
import * as changeCase from 'change-case';
import { IComponentConfig } from "../../interface";
import { filePaths } from '../helpers/filePaths';
import Ast, { ArrayLiteralExpression, FunctionDeclaration,
  Expression, ArrowFunction, FunctionExpression, ObjectLiteralExpression,
  PropertyAccessExpression, MethodDeclaration, PropertyAssignment } from 'ts-simple-ast';
import { SyntaxKind, Declaration, ObjectLiteralElementLike } from 'typescript';
import { createWrappedNode } from 'ts-simple-ast/dist/createWrappedNode';

const setupDirs = async (config: IComponentConfig) => {

  await setupDir(dirPaths.classes(config.dir, config.moduleName));

};

const setupFiles = async (config: IComponentConfig) => {

  const moduleIndexFile = filePaths.moduleIndex(config.dir, config.moduleName);

  const moduleIndexSpecifier = filePaths.moduleIndex(config.dir, config.moduleName, false);

  const pathToRef = `./${path.relative(path.dirname(moduleIndexFile), filePaths.ref(config.dir, false))}`;

  const componentSpecifier = changeCase.pascalCase(config.componentName);

  const componentInterfaceName = `I${componentSpecifier}`;

  const pathToInterface = `./${path.relative(moduleIndexSpecifier, filePaths.interface(config.dir, false))}`;

  await setupFile(
    filePaths.moduleComponent(
      config.dir,
      config.moduleName,
      config.componentName),
      templates.classComponent(
        config.moduleName,
        config.componentName,
        pathToRef,
        componentInterfaceName,
        pathToInterface
      )
  );

};

const addComponentToModuleContainer = async (config: IComponentConfig) => {

  const ast = new Ast();

  const moduleIndexFile = filePaths.moduleIndex(config.dir, config.moduleName);

  const moduleIndexSpecifier = filePaths.moduleIndex(config.dir, config.moduleName, false);

  const componentFilePath = filePaths.moduleComponent(config.dir, config.moduleName, config.componentName, false);

  const componentSpecifier = changeCase.pascalCase(config.componentName);

  ast.addExistingSourceFile(moduleIndexFile);

  const sourceFile = ast.getSourceFileOrThrow(moduleIndexFile);

  sourceFile.addImportDeclaration(
    {
      namedImports: [
        {
          name: config.componentName
        }
      ],
      moduleSpecifier: `./${path.relative(path.dirname(moduleIndexFile), componentFilePath)}`
    }
  );

  await sourceFile.save();

};

const addComponentInterfaceToInterface = async (config: IComponentConfig) => {

  const ast = new Ast();

  const interfaceFile = filePaths.interface(config.dir);

  ast.addExistingSourceFile(interfaceFile);

  const sourceFile = ast.getSourceFileOrThrow(interfaceFile);

  sourceFile.addInterface(
   {
     name: `I${changeCase.pascalCase(config.componentName)}`,
     isExported: true
   }
  );

  await sourceFile.save();

};

const addSymbolToRef = async (config: IComponentConfig) => {

  const ast = new Ast();

  const refFile = filePaths.ref(config.dir);

  ast.addExistingSourceFile(refFile);

  const sourceFile = ast.getSourceFileOrThrow(refFile);

  const symbolName = changeCase.camelCase(config.componentName);

  const myRef = sourceFile.getVariableDeclarationOrThrow('ref')
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression;

  myRef.addPropertyAssignment({
      name: symbolName,
      initializer: `Symbol('${symbolName}')`
    });

  await sourceFile.save();

};

const bindComponentToModule = async (config: IComponentConfig) => {

  const ast = new Ast();

  const moduleIndexFile = filePaths.moduleIndex(config.dir, config.moduleName);
  const interfaceName = `I${changeCase.pascalCase(config.componentName)}`;

  const symbolName = changeCase.camelCase(config.componentName);
  const className = changeCase.pascalCase(config.componentName);

  ast.addExistingSourceFile(moduleIndexFile);

  const sourceFile = ast.getSourceFileOrThrow(moduleIndexFile);

  sourceFile.addImportDeclaration(
    {
      namedImports: [
        {
          name: interfaceName
        }
      ],
      moduleSpecifier: `./${path.relative(path.dirname(moduleIndexFile), filePaths.interface(config.dir, false))}`
    }
  );

  const myModule = sourceFile.getVariableDeclarationOrThrow(config.moduleName)
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression;

  const container = (myModule.getProperty('container') as PropertyAssignment)
    .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction) as ArrowFunction;

  const binder = container.getVariableDeclarationOrThrow('binder')
    .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction) as ArrowFunction;

  binder.addStatements(`bind<${interfaceName}>(ref.${symbolName}).to(${className})`);

  await sourceFile.save();

};

export const componentCreate = async (config: IComponentConfig) => {

  await setupDirs(config);

  await setupFiles(config);

  await addComponentToModuleContainer(config);

  await addComponentInterfaceToInterface(config);

  await addSymbolToRef(config);

  await bindComponentToModule(config);

};