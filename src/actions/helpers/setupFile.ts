import * as fs from 'fs-extra';

export const setupFile = async (fileName: string, content?: string) => {

  if (false === await fs.pathExists(fileName)) {

    await fs.ensureFile(fileName);

    if (content) {

      await fs.writeFile(fileName, content);

    }

  }

};