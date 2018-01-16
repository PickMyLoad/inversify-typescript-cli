import { IConfig } from './../interface';
import * as fs from 'fs-extra';
import * as path from 'path';

export const util = {

  getConfig: (configFile = "inversify-cli.json") => {

    let config: IConfig = {
      dir: './',
    };

    if (fs.pathExistsSync(configFile)) {

      config = JSON.parse(fs.readFileSync(configFile).toString());

    }

    return config;

  },

  setupDir: async (dirPath: string) => {

    if (false === await fs.pathExists(dirPath)) {

      await fs.ensureDir(dirPath);

    }

  },

  setupFile: async (fileName: string, content?: string) => {

    if (false === await fs.pathExists(fileName)) {

      await fs.ensureFile(fileName);

      if (content) {

        await fs.writeFile(fileName, content);

      }

    }

  },

  getRelativeModuleSpecifier: (from: string, to: string) => {

    const val = `./${path.relative(path.dirname(from), to)}`;

    return val.substring(0, val.lastIndexOf('.ts'));

  }

};