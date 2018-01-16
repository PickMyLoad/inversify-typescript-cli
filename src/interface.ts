export enum EActions {
  INIT = 'init',
  MODULE = 'module',
  COMPONENT = 'component'
}

export interface IConfig {
  dir: string;
  componentTests: boolean;
}

export interface IModuleNameConfig {
  moduleName: string;
}
export interface IComponentNameConfig {
  componentName: string;
}
export interface IModuleConfig extends IModuleNameConfig {

}
export interface IComponentConfig extends IComponentNameConfig, IModuleNameConfig {

}