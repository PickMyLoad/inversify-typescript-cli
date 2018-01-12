import * as path from 'path';

export const filePaths = {
  app: (folder: string) => path.join(process.cwd(), folder, 'app.ts'),
  container: (folder: string) => path.join(process.cwd(), folder, 'container.ts'),
  harness: (folder: string) => path.join(process.cwd(), folder, 'harness.ts'),
  interface: (folder: string) => path.join(process.cwd(), folder, 'interface.ts'),
  ref: (folder: string) => path.join(process.cwd(), folder, 'ref.ts')
};