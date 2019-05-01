import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/Routes";
import * as mongoose from "mongoose";
import * as corns from "cors"

class App {
    public app: express.Application;
    public routerPrv: Routes = new Routes();
    public julioUrl: string = 'mongodb://192.168.100.10:27017/tournamentDB';
    public mongoUrl: string = 'mongodb://localhost/tournamentDB';

    constructor() {
        this.app = express();
        this.config();
        this.routerPrv.routes(this.app);
        this.mongoSetup();
    }
    private config(): void {
        this.app.use(corns())
        //support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

    }
    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose.set('useNewUrlParser', true);
        mongoose.connect(this.mongoUrl);
        // mongoose.connect(this.julioUrl);
    }
}

export default new App().app;