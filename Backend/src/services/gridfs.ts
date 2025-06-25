import { MongoClient, GridFSBucket, Db} from 'mongodb'
import dotenv from 'dotenv'
import 'dotenv/config'
dotenv.config();
class GridFSService {
    private static instance: GridFSService;
    private db?: Db;
    private client: MongoClient;

    private constructor() {
        this.client = new MongoClient(process.env.DATABASE_URL!);
    }

    public static getInstance(): GridFSService {
        if (!GridFSService.instance) {
            GridFSService.instance = new GridFSService();
        }
        return GridFSService.instance;
    }

    private async connect(): Promise<Db> {
        if (!this.db) {
            await this.client.connect()
            this.db = this.client.db();
        }
        return this.db;
    }

    public async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
        const db = await this.connect();
        const bucket = new GridFSBucket(db, { bucketName: 'documentos'});

        return new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(fileName);
            uploadStream.write(fileBuffer);
            uploadStream.end();

            uploadStream.on('finish', () => {
                resolve(fileName);
            });

            uploadStream.on('error', reject);
        });
    }

    public async getFileStream(fileName: string) {
        const db = await this.connect()
        const bucket = new GridFSBucket(db, { bucketName: 'documentos'});
        return bucket.openDownloadStreamByName(fileName);
    }

    public async deleteFile(fileName: string): Promise<boolean> {
        const db = await this.connect();
        const bucket = new GridFSBucket(db, { bucketName: 'documentos'});

        const files = await db.collection('documentos.files').find({ fileName }).toArray();
        if (files.length === 0 ) return false;

        await bucket.delete(files[0]._id);
        return true;
    } 
}

export const gridFSService = GridFSService.getInstance();