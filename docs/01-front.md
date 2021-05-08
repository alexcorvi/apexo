## Front

To get started with Apexo Application you need to have the application installed on your system. Apexo is a progressive web application, meaning that it uses the web and the browser as a platform to run on any device. That doesn't mean that you can't run it when being offline, nor it means that you can't install it as an executable on your system.

Use any of the following options to setup the front of your application:

### Without installation

Without any installation what so ever, you can use any modern browser (Chrome, edge, firefox, safari) to navigate to [web.apexo.app](https://web.apexo.app) and just as the website loads it will be installed on your computer i.e. you can navigate to it while offline and it won't require internet connection anymore.

Using this option will provide with the latest updates and bugfixes just as they get released. However, you will not be able to control the source code or do any modification

More about progressive web applications: [link](https://web.dev/what-are-pwas/)

### Installation on your computer / smartphone

Apexo is also distributed as an executable for MacOS and Windows, it can also be installed on your smartphone home screen. [For more details click here](https://apexo.app/download/).

### Running locally

The application above is precompiled and hosted on github as repository ([Link](https://github.com/alexcorvi/apexo-app)), so you can clone it to your computer and serve it using any static file web server of your preference.

-   [NGINX](https://nginx.com/)
-   [Apache](https://httpd.apache.org/)
-   [lite-server](https://github.com/johnpapa/lite-server)

> Note: Cloning the repository and running it locally means that you will not get any updates unless you clone it again once an update is released

### Building from source

To use the latest features, before being released, you can clone the application repository ([Link](https://github.com/alexcorvi/apexo)) and build it from source using the command:

```bash
yarn run prod
```

and the command

```bash
yarn run serve
```

to start it

> Note: Building the repository from source means that you will not get any updates unless you clone it again once an update is released
