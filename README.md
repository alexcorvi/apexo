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
-   `yarn run jest`: will run unit tests.
-   `yarn run cypress`: will run e2e tests.

### Testing

-   This project uses end-to-end/integration testing in addition to unit tests.

#### Unit testing

-   Using Jest, run `yarn run jest`.

#### E2E Testing

##### Prequisites

-   Internet connection.
-   CouchDB installed and running on `http://localhost:5984`.
-   Admin username `test`, with password `test`.
-   Application being served on `http://localhost:8000` (preferably on development mode).

##### Running tests

-   Using cypress, run `yarn run cypress`.

---

License: The MIT License (MIT) - Copyright (c) Alex Corvi
