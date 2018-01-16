# Inversify Typescript CLI
An opinionated command line interface for creating inversify modules and components.

Speeds up some of the boilerplate required to build apps with dependency injection.

This project is a work in progress. Contributions and feedback are welcome.

## Getting Started

Install inversify-cli

```yarn add inversify-cli```

In the scripts section of your `package.json` file, assign a script to inversify-cli to create an alias

```
...
"scripts": {
  "cli": "inversify-cli"
},
...
```

> NOTE: replace "cli" in all examples below with whatever string you use as the script name.

Optionally create an inversify-cli.json file in your project root.

inversify-cli.json
```
{
  "dir": "./src" // Folder to create the typescript files
}
```


Initialize your project.

```
yarn cli init
```

Files will be created in the folder specified by inversify-cli.json.

## Folder Structure

Inside your project folder you will have the following files and directories:

### app.ts
This file exports an app function you can use to run your app.

### container.ts
This file exports a container function which registers your module containers. It is set up to allow you to pass a config object to each module container.

### harness.ts
This is a test harness that can be imported in your unit tests.

You can modify this class as you like to help simplify your testing. For example, I suggest adding a helper function that uses  [testdouble](https://www.npmjs.com/package/testdouble) to rebind a reference with a mocked version. This helps isolate units of code.

### interface.ts
This is the app interface file that contains the apps abstractions.

### ref.ts
This is the ref file which contains an object with keys linked to symbols used to identify dependencies.

## Add a module

Add a module with the command
`yarn cli module create <ModuleName>`

A module container will be created and added to the application container.

## Add a component

Add a component to a module with the command
`yarn cli component create <ModuleName> <ComponentName>`

A component will be created and added to the module container.

## Testing

To simplify unit testing you can use the harness to reference any component registered in the application container. Additionally, you can pass in a function that will let you get an instance of the container so that you can rebind any dependencies as you see fit.

Before your tests bootstrap your harness (referred to below as "h").
In your tests you can reference the component you are testing with `h.sut` (System Under Test).

```
import * as Fs from 'fs';
import * as Path from 'path';
import { H } from './../../../harness';
import { ref } from './../../../ref';

describe('Sample Test', () => {

  let h: H<ClassUnderTest>;
  let dblFs: typeof Fs;
  let dblPath: typeof Path;

  beforeEach(() => h = new H<ClassUnderTest>(
    ref.ClassUnderTest,
    (harness) => {

      // Rebind some dependencies to a constant value
      // to avoid side effects in tests
      //dblFs = harness.container.rebind(ref.Fs).toConstant({});
      //dblPath = container.rebind(ref.Path).toConstantValue({});

    }
  ));

  describe('sampleMethod', () => {

    it('should return true', async () => {

      expect(h.sut.sampleMethod()).to.eql(true);

    });

  });

});
```

# Wish List

- Refactor the application to itself use inversify
- Throw more informative errors
- Add unit and e2e tests
- Throw error if attempting to recreate a module or container that already exists
- Create test file for components (toggleable via config file)