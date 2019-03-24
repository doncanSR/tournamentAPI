# Tournament API

This is the API for the Tournament APP, created in node using typescript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to have previusly installed Nodejs with this version v8.9.4, https://nodejs.org/es/download/ ,

Must have preferably Yarn v.1.13.0 as fast dependency management. [yarnpkg](https://yarnpkg.com/es-ES/),

Download mongodb this version is the recomended to use 3.4.9 here is https://docs.mongodb.com/manual/installation/ the 

Documentatio
to set up mongo, also is recomended to dowload https://nosqlbooster.com/downloads mongobooster, to manage the db with an IDE

Typescript version 3.1.1

ts-node version 7.0.1

Also you need to install Typescript globally in your PC, usin the following command:

```
npm install -g typescript
npm install -g ts-node
```


### Installing

To run the API you just need to install al the dependencies using

```
Yarn
```

### Start API

To run the API, you just need to start your mongo server using:

Unix OS

```
sudo mongod
```

Windows in a cmd admin window

```
mongod
```
once you start mongo server, you should run the api, in the API folder with the following command:

```
<<<<<<< HEAD
npm run build
npm run dev
=======
yarn dev
>>>>>>> cc67b467919df1dc3a673f37cca26473299685ee
```

## Code version syntax

* feat(moduleName): resume changes || this will be used to add new features to the app.
* fix(moduleName): resume changes  || this will be used to fix something to the app.
* refactor(moduleName): resume changes  || this will be used to refactor some module.
* tool: For build process changes (ie. package.json).

## Authors

* **Julio Cesar Ramirez Jimenez** - *Initial work* - [Julio Cesar](https://github.com/JulioCesarRamirez)

* **Doncan Alexis Sanchez Rico** - *Initial work* [Doncan](https://github.com/doncanSR)

* **Jonathan Ramirez Jimenez** - *Initial work* [Jony](https://github.com/JonathanRamirezJ)

