# Assessment, Survey re-implementation from Curious Learning in Typescript

## [ ] Building the Project
### - First we need to have a Typescript transpiler installed by using the following command:
``` npm install -g typescript ```

### - The Typescript config is already included in the project, now we need to install the typescript-bundle Typescript bundler tool to be able to use import statements and much more, by using the following command:
``` npm install -g typescript-bundle ```

### - In order to build the compile/transpile Typescript to Javascript let's use the following command:
``` tsc ```

### - Now we can move on to bundling the generated Javascript files into one bundle that can be referenced as a script on a page, by using the following command:
``` tsc-bundle tsconfig.json ```

## [ ] Running the Project
### - Currently the preferred way of running the project is by using the `live-server` command line application that creates a localhost server and hosts the project and enables, more on that [here](https://www.npmjs.com/package/live-server).


