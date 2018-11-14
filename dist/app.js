"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const Routes_1 = require("./routes/Routes");
const mongoose = require("mongoose");
const corns = require("cors");
class App {
    constructor() {
        this.routerPrv = new Routes_1.Routes();
        this.mongoUrl = 'mongodb://localhost/tournamentDB';
        this.julioLocal = 'mongodb://192.168.100.10:27017/tournamentDB';
        this.app = express();
        this.config();
        this.routerPrv.routes(this.app);
        this.mongoSetup();
    }
    config() {
        this.app.use(corns());
        //support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.julioLocal);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map