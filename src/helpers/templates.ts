import { names } from './names';

export const templates = {
  app: `import { container } from './container';
import { ref } from './ref';

export const app = () => {

  container();

};`,
  container: `import 'reflect-metadata';
import { Container } from 'inversify';

export const container = () => {

  const myContainer = new Container();

  return myContainer;

};`,
  harness: `import 'reflect-metadata';
import { Container } from 'inversify';
import { ref } from './ref';
import { container } from './container';

export type ContainerConfigurator<T> = (self: H<T>) => void;

export class H<T> {

  static ref = ref;

  sut: T;

  readonly container: Container;

  constructor(private type: symbol, configurator?: ContainerConfigurator<T>) {

    this.container = container();

    if (configurator) {
      configurator(this);
    }

    this.sut = this.container.get<T>(type);

    }

}`,
  interface: ``,
  ref: `export const ref = {};`,
  moduleIndex: (moduleName: string, pathToRef: string) => `import { ContainerModule, interfaces } from 'inversify';
import { ref } from '${pathToRef}';

export const ${names.getModuleVarName(moduleName)} = {

  container: (config?: any) => {

    const binder: interfaces.ContainerModuleCallBack = (bind) => {

    };

    return new ContainerModule(binder);

  }
};`,
componentClass: (
  moduleName: string,
  componentName: string,
  pathToRef: string,
  pathToInterface: string) =>
`import { injectable } from 'inversify';
import { ref } from '${pathToRef}';
import { ${names.getComponentInterfaceName(componentName)} } from '${pathToInterface}';

@injectable()
export class ${
  names.getComponentClassName(componentName)
} implements ${names.getComponentInterfaceName(componentName)} {

  constructor(
  ) { }

}`,
componentTest: (
  componentName: string,
  pathToComponent: string,
  pathToHarness: string,
  pathToRef: string
) => `
import { H } from '${pathToHarness}';
import { ${names.getComponentClassName(componentName)} } from '${pathToComponent}';
import { ref } from '${pathToRef}';

describe('${names.getComponentClassName(componentName)}', () => {

  let h: H<${names.getComponentClassName(componentName)}>;

  beforeEach(() => h = new H(
    ref.${names.getRefName(componentName)},
    (container) => {

      // Configure container for testing

    }
  ));

});
`

};