import dotenv from 'dotenv';
import { connect, ConnectOptions } from 'mongoose'
dotenv.config();

const MONGODB_URI  = process.env.DATABASE_URL;

if (!MONGODB_URI ) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
}

const dbOptioons: ConnectOptions = {
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

export async function connectBD() {
    try {
        await connect(MONGODB_URI as string, dbOptioons);
        console.log('Mongo conectada');
    } catch (error) {
        console.error('Mongo no conectada', error);
        process.exit(1)
    }
    
}

const db = connect(MONGODB_URI as string, dbOptioons);

db.then(() => {
    console.log('Conectado a MongoDB');
}).catch((err) => {
    console.error('Error de conexion', err);
});

export default db;