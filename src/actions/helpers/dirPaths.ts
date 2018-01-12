import * as path from 'path';

export const dirPaths = {
  modules: (folder: string) => path.join(process.cwd(), folder, 'modules'),
};