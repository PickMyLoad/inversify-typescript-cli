import * as fs from 'fs-extra';

export const setupDir = async (dirPath: string) => {

  if (false === await fs.pathExists(dirPath)) {

    await fs.ensureDir(dirPath);

  }

};