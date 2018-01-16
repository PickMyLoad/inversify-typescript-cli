export const templates = {
  app: `import { container} from './container';
import { ref } from './ref';
export const app = () => {

  container();

};`,
  container: `import 'reflect-metadata';
import { Container } from 'inversify';

export const container = () => {

  const myContainer = new Container();

  const moduleConfigs = [
  ];

  moduleConfigs.map(
    (moduleConfig) => myContainer.load(moduleConfig.module.container(moduleConfig.config))
  )

  return myContainer;

};`,
  harness: `import 'reflect-metadata';
import * as testdouble from 'testdouble';
import { Container } from 'inversify';
import { ref } from './ref';
import { container } from './container';

export type ContainerConfigurator<T> = (self: H<T>) => void;

export class H<T> {

  static ref = ref;

  static td = testdouble;

  sut: T;

  readonly container: Container;

  constructor(private type: symbol, configurator?: ContainerConfigurator<T>) {

    this.container = container();

    if (configurator) {
      configurator(this);
    }

    this.sut = this.container.get<T>(type);

    }

    rebind<U>(type: symbol, dblFunc: (obj: U) => U = testdouble.object): U {

    const dbl = dblFunc(this.container.get<U>(type));

    this.container.rebind<U>(type).toConstantValue(dbl);

    return dbl;

    }

}`,
  ref: `export const ref = {};`,
  moduleIndex: (moduleName: string, pathToRef: string) => `import { ContainerModule, interfaces } from 'inversify';
  import { ref } from '${pathToRef}';

  export const ${moduleName} = {

  container: (config?: any) => {

    const binder: interfaces.ContainerModuleCallBack = (bind) => {

    }

    return new ContainerModule(binder);

  }
};`,
classComponent: (
  moduleName: string,
  componentName: string,
  pathToRef: string,
  componentInterfaceName: string,
  pathToInterface: string) =>
`import { injectable } from 'inversify';
import { ref } from '${pathToRef}';
import { ${componentInterfaceName} } from '${pathToInterface}';

@injectable()
export class ${componentName} implements ${componentInterfaceName} {

  constructor(
  ) { }

}`

};