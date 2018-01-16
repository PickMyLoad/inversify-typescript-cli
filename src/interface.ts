export enum EActions {
  INIT = 'init',
  MODULE = 'module',
  COMPONENT = 'component'
}

export interface IDirConfig {
  dir: string;

}
export interface IModuleNameConfig {
  moduleName: string;
}
export interface IComponentNameConfig {
  componentName: string;
}
export interface IInitConfig extends IDirConfig {
}
export interface IModuleConfig extends IDirConfig, IModuleNameConfig {

}
export interface IComponentConfig extends IDirConfig, IComponentNameConfig, IModuleNameConfig {

}