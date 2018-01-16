import { dirPaths } from './dirPaths';
import * as path from 'path';

const refString = (name: string, ext = true) => {

  return (ext) ? `${name}.ts` : name;

};

export const filePaths = {
  app: (folder: string, ext?: boolean) => path.join(process.cwd(), folder, refString('app', ext)),
  container: (folder: string, ext?: boolean) => path.join(process.cwd(), folder, refString('container', ext)),
  harness: (folder: string, ext?: boolean) => path.join(process.cwd(), folder, refString('harness', ext)),
  interface: (folder: string, ext?: boolean) => path.join(process.cwd(), folder, refString('interface', ext)),
  ref: (folder: string, ext?: boolean) => path.join(process.cwd(), folder, refString('ref', ext)),
  moduleIndex:
    (folder: string, moduleName: string, ext = true) =>
      path.join(dirPaths.modules(folder, moduleName), refString(moduleName, ext)),
  moduleComponent:
    (folder: string, moduleName: string, className: string, ext = true) =>
      path.join(dirPaths.classes(folder, moduleName), refString(className, ext))
};