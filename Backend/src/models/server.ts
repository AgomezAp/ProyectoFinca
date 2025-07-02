import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express';
import mongoose from 'mongoose';
import rReserva from '../routes/reserva'
import bodyParser from 'body-parser'
import imagenesRouter from '../routes/images';
class Server {
    private app: Application;
    private port?: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.router();
        this.DBconnect();
        this.listen();
    }

    listen (){
        this.app.listen(this.port, () => {
            console.log("Server running on port: " + this.port);
        });
    }

    
    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-type', 'Authorization']
        }));
    }
    
    router() {
        this.app.use(rReserva);
        this.app.use(imagenesRouter);
    }
    async DBconnect() {
        try {
            await mongoose.connect(process.env.DATABASE_URL || '');
            console.log('Conexion a MongoDB establecida correctamente'); 
        } catch (error) {
            console.log("Error de conexion a MongoDB", error);
        }
    }
}

export default Server;