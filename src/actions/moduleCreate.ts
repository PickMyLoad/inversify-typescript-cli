import { templates } from './../helpers/templates';
import { paths } from './../helpers/paths';
import { names } from './../helpers/names';
import { util } from '../helpers/util';
import { IModuleConfig, IConfig } from "./../interface";
import Ast, { ArrayLiteralExpression, FunctionDeclaration,
  Expression, ArrowFunction, FunctionExpression } from 'ts-simple-ast';
import { SyntaxKind } from 'typescript';

const setup = async (config: IConfig, moduleConfig: IModuleConfig) => {

  const moduleFile = paths.getModuleFile(config, moduleConfig.moduleName);
  const refPath = paths.getRefFile(config);

  const pathToRef = util.getRelativeModuleSpecifier(moduleFile, refPath);

  await util.setupFile(
    moduleFile,
    templates.moduleIndex(moduleConfig.moduleName, pathToRef),
  );

};

const addModuleToApp = async (config: IConfig, moduleConfig: IModuleConfig) => {

  const ast = new Ast();

  const containerFile = paths.getContainerFile(config);
  const moduleFile = paths.getModuleFile(config, moduleConfig.moduleName);

  ast.addExistingSourceFile(containerFile);

  const sourceFile = ast.getSourceFileOrThrow(containerFile);

  sourceFile.addImportDeclaration(
    {
      namedImports: [
        {
          name: names.getModuleVarName(moduleConfig.moduleName)
        }
      ],
      moduleSpecifier: util.getRelativeModuleSpecifier(containerFile, moduleFile)
    }
  );

  const container = sourceFile.getVariableDeclarationOrThrow('container')
    .getInitializerIfKind(SyntaxKind.ArrowFunction) as FunctionExpression;

  const myContainerStatementIndex = container.getVariableDeclaration('myContainer').getChildIndex();

  container.insertStatements((myContainerStatementIndex + 1),
    `myContainer.load(${names.getModuleVarName(moduleConfig.moduleName)}.container());`
  );

  await sourceFile.save();

};
export const moduleCreate = async (config: IConfig, moduleConfig: IModuleConfig) => {

  await setup(config, moduleConfig);

  await addModuleToApp(config, moduleConfig);

};