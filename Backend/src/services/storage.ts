import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2 = new S3Client({
    
    region: 'auto',
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
    },
});

export async function uploadToR2(fileBuffer: Buffer, fileName: string): Promise<string> {

    const uploadParams = {
        Bucket: 'finca-documentos',
        Key: `documentos/${Date.now()}_${fileName}`,
        Body: fileBuffer,
        ContentType: 'image/jpeg',
    };

    await R2.send(new PutObjectCommand(uploadParams));
    
    return `https://finca-documentos.${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/${uploadParams.Key}`;
    
}