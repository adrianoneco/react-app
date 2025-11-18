import { Client } from "minio";

if (!process.env.MINIO_ENDPOINT || !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY || !process.env.MINIO_BUCKET_NAME) {
  throw new Error("MinIO environment variables are not set");
}

const endpoint = process.env.MINIO_ENDPOINT.replace(/^https?:\/\//, '').replace(/\/$/, '');
const isLocalhost = endpoint.includes("localhost");

export const minioClient = new Client({
  endPoint: endpoint,
  port: isLocalhost ? 9000 : 443,
  useSSL: !isLocalhost,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
      console.log(`Bucket ${BUCKET_NAME} created successfully`);
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error: any) {
    console.error("MinIO Error - Check your credentials and endpoint:", error.message || error);
    console.log("Application will continue without MinIO upload functionality");
  }
}
