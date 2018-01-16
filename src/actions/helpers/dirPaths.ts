import * as path from 'path';

export const dirPaths = {
  modules: (folder: string, extra?: string) =>
    (extra) ? path.join(process.cwd(), folder, 'modules', extra) : path.join(process.cwd(), folder, 'modules'),
  classes: (folder: string, moduleName: string, extra?: string) =>
    (extra) ?
      path.join(dirPaths.modules(folder, moduleName), 'components', extra) :
      path.join(dirPaths.modules(folder, moduleName), 'components')
};