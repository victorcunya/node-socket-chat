
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
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketController from '../controllers/sockets/socket.js';

export class RestServer {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = new Server(this.server);

        this.path = {
            auth: '/api/auth',
            category: '/api/categories',
            user: '/api/users',
            product: '/api/products',
            search: '/api/searches',
            upload: '/api/uploads',
        }

        this.connectDB();
        this.middlewares();
        this.routes();
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
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

    sockets() {
        this.io.on('connection', (socket) => {
            socketController(socket, this.io)
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('listening on port ' + this.port);
        })

    }
}