import { templates } from './../helpers/templates';
import { paths } from './../helpers/paths';
import { names } from './../helpers/names';
import { util } from './../helpers/util';
import { IComponentConfig , IConfig} from "./../interface";
import Ast, { ArrayLiteralExpression, FunctionDeclaration,
  Expression, ArrowFunction, FunctionExpression, ObjectLiteralExpression,
  PropertyAccessExpression, MethodDeclaration, PropertyAssignment } from 'ts-simple-ast';
import { SyntaxKind, Declaration, ObjectLiteralElementLike } from 'typescript';
import { createWrappedNode } from 'ts-simple-ast/dist/createWrappedNode';

const setupDirs = async (config: IConfig, componentConfig: IComponentConfig) => {

  await util.setupDir(
    paths.getComponentsDir(config, componentConfig.moduleName));

};

const setupFiles = async (config: IConfig, componentConfig: IComponentConfig) => {

  const moduleFile = paths.getModuleFile(config, componentConfig.moduleName);

  const componentFile = paths.getComponentFile(
    config,
    componentConfig.moduleName,
    componentConfig.componentName
  );

  await util.setupFile(
    componentFile,
    templates.componentClass(
      componentConfig.moduleName,
      componentConfig.componentName,
      util.getRelativeModuleSpecifier(componentFile, paths.getRefFile(config)),
      util.getRelativeModuleSpecifier(componentFile, paths.getInterfaceFile(config))
    )
  );

};

const addComponentTestFile = async (config, componentConfig) => {

  const moduleFile = paths.getModuleFile(config, componentConfig.moduleName);

  const componentFile = paths.getComponentFile(config, componentConfig.moduleName, componentConfig.componentName);

  const componentTestFile = paths.getComponentTestFile(
    config,
    componentConfig.moduleName,
    componentConfig.componentName
  );

  await util.setupFile(
    componentTestFile,
    templates.componentTest(
      componentConfig.componentName,
      util.getRelativeModuleSpecifier(componentTestFile, componentFile),
      util.getRelativeModuleSpecifier(componentTestFile, paths.getHarnessFile(config)),
      util.getRelativeModuleSpecifier(componentTestFile, paths.getRefFile(config))
    )
  );

};

const addComponentToModule = async (config: IConfig, componentConfig: IComponentConfig) => {

  const ast = new Ast();

  const moduleFile = paths.getModuleFile(config, componentConfig.moduleName);

  const componentFile =
    paths.getComponentFile(config, componentConfig.moduleName, componentConfig.componentName);

  ast.addExistingSourceFile(moduleFile);

  const sourceFile = ast.getSourceFileOrThrow(moduleFile);

  sourceFile.addImportDeclaration(
    {
      namedImports: [
        {
          name: names.getComponentClassName(componentConfig.componentName)
        }
      ],
      moduleSpecifier: util.getRelativeModuleSpecifier(moduleFile, componentFile)
    }
  );

  await sourceFile.save();

};

const addComponentInterfaceToInterface = async (config: IConfig, componentConfig: IComponentConfig) => {

  const ast = new Ast();

  const interfaceFile = paths.getInterfaceFile(config);

  ast.addExistingSourceFile(interfaceFile);

  const sourceFile = ast.getSourceFileOrThrow(interfaceFile);

  sourceFile.addInterface(
   {
     name: names.getComponentInterfaceName(componentConfig.componentName),
     isExported: true
   }
  );

  await sourceFile.save();

};

const addSymbolToRef = async (config: IConfig, componentConfig: IComponentConfig) => {

  const ast = new Ast();

  const refFile = paths.getRefFile(config);

  ast.addExistingSourceFile(refFile);

  const sourceFile = ast.getSourceFileOrThrow(refFile);

  const refName = names.getRefName(componentConfig.componentName);

  const myRef = sourceFile.getVariableDeclarationOrThrow('ref')
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression;

  myRef.addPropertyAssignment({
      name: refName,
      initializer: `Symbol('${refName}')`
    });

  await sourceFile.save();

};

const bindComponentToModule = async (config: IConfig, componentConfig: IComponentConfig) => {

  const ast = new Ast();

  const moduleFile = paths.getModuleFile(config, componentConfig.moduleName);
  const interfaceFile = paths.getInterfaceFile(config);

  const componentClassName = names.getComponentClassName(componentConfig.componentName);
  const componentInterfaceName = names.getComponentInterfaceName(componentConfig.componentName);
  const refName = names.getRefName(componentConfig.componentName);

  ast.addExistingSourceFile(moduleFile);

  const sourceFile = ast.getSourceFileOrThrow(moduleFile);

  sourceFile.addImportDeclaration(
    {
      namedImports: [
        {
          name: componentInterfaceName
        }
      ],
      moduleSpecifier: util.getRelativeModuleSpecifier(moduleFile, interfaceFile)
    }
  );

  const moduleVarName = names.getModuleVarName(componentConfig.moduleName);

  const myModule = sourceFile.getVariableDeclarationOrThrow(moduleVarName)
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression;

  const container = (myModule.getProperty('container') as PropertyAssignment)
    .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction) as ArrowFunction;

  const binder = container.getVariableDeclarationOrThrow('binder')
    .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction) as ArrowFunction;

  binder.addStatements(
    `bind<${componentInterfaceName}>(ref.${refName}).to(${componentClassName})`
  );

  await sourceFile.save();

};

export const componentCreate = async (config: IConfig, componentConfig: IComponentConfig) => {

  await setupDirs(config, componentConfig);

  await setupFiles(config, componentConfig);

  await addComponentToModule(config, componentConfig);

  await addComponentInterfaceToInterface(config, componentConfig);

  await addSymbolToRef(config, componentConfig);

  await bindComponentToModule(config, componentConfig);

  if (config.componentTests) {

    await addComponentTestFile(config, componentConfig);
  }

};