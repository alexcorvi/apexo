# Apexo Dental Clinic Manager

![Apexo.app](https://i.imgur.com/Vkdbzb3.png)

[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)
![license](https://img.shields.io/github/license/alexcorvi/apexo.svg?style=flat-square)
![David](https://img.shields.io/david/alexcorvi/apexo.svg?style=flat-square)
![David](https://img.shields.io/david/dev/alexcorvi/apexo.svg?style=flat-square)

A web/desktop application to manage your dental clinic practice.

-   [More Info](https://apexo.app)
-   [Documentation](https://docs.apexo.app)
-   [Demo Application](https://demo.apexo.app)
-   [Web Application](https://web.apexo.app)
-   [Download](https://github.com/alexcorvi/apexo/releases/)
-   [Roadmap](https://github.com/alexcorvi/apexo/blob/master/ROADMAP.md)
-   [Changelog](https://github.com/alexcorvi/apexo/blob/master/CHANGELOG.md)

#### Embedded apps that can be used separately

-   [Cephalometric](https://cephalometric.apexo.app), [repo](https://github.com/alexcorvi/cephalometric)

### Building from source & Deployment

After cloning the repository, run `yarn install`, this will install the required dependencies. then run `yarn run prod` to build for production, or `yarn run dev` to build for development.

### Scripts

-   `yarn run prod`: build for production.
-   `yarn run dev`: build for development.
-   `yarn run lint`: run ts-lint on the project.
-   `yarn run serve`: run a localhost server that serves the files in `dist/application/`.
-   `yarn run build-desktop`: will create a desktop electron application that loads the URL: `web.apexo.app`.
-   `yarn run upload`: will upload the files in `dist/application/` to `web.apexo.app` and `demo.apexo.app`.
-   `yarn run deploy`: will build the application in production mode and then upload it just like the aforementioned script.

### Testing

This project uses end-to-end/integration testing solely. The testing code, though found in the subdirectory `testing`, is a separate project with an independent `package.json`.

##### Prequisites

-   CouchDB installed and running on `http://localhost:5984`.
-   Application being served on `http://localhost:8000` (preferably on development mode).

##### Running tests

navigate to `testing/` and run `npm run start`, webpack will build a new `test.js` file and an electron application will run the application and all the tests will run consecutively.

The test results will be displayed on the console of the electron application.

##### Adding new tests

the `testing/tests` subdirectory have the following structure:

```
- tests
    - [dir: group of tests]
        - [file: test suite]
```

Each test suite must export an object of test functions. Test suites must implement the `testing/tests/suite.interface.ts` interface.

Each test suite must be imported in the `testing/tests/index.ts` and located in its appropriate group.

---

License: The MIT License (MIT) - Copyright (c) Alex Corvi
