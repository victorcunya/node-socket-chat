
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import fileUpload from 'express-fileupload';
import { dbConnection } from '../database/config.js';
import {
    authRouter,
    categoryRouter,
    productRouter,
    searchRouter,
    uploadRouter,
    userRouter
} from '../routes/index.js';

export class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.path = {
            auth: '/api/auth',
            category: '/api/categories',
            user: '/api/users',
            product: '/api/products',
            search: '/api/searches',
            upload: '/api/uploads',
        }

        // connect to DB cafe
        this.connectDB();
        // middleware; para servir carpeta publica
        // son funciones que siempre se ejecutan al levantar el server.
        this.middlewares();

        //rutas de aplicación.
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // cors
        this.app.use(cors());

        // lectura y Parseo del body
        this.app.use(express.json());

        // directorio publico
        this.app.use(express.static('public'));

        // carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
            // debug: true,
        }));
    }

    routes() {
        this.app.use(this.path.user, userRouter);
        this.app.use(this.path.auth, authRouter);
        this.app.use(this.path.category, categoryRouter);
        this.app.use(this.path.product, productRouter);
        this.app.use(this.path.search, searchRouter);
        this.app.use(this.path.upload, uploadRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('listening on port ' + this.port);
        })

    }
}