import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { storageConfig } from '../config/storage';
// import dotenv from 'dotenv';
// dotenv.config();

let s3: AWS.S3;

if (storageConfig.isProd) {
  s3 = new AWS.S3({
    endpoint: storageConfig.wasabi.endpoint,
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
    region: storageConfig.wasabi.region,
  });
}

// export class StorageService {
//   static async uploadFile(filePath: string, fileName: string) {
//     if (env === 'production') {

//       const fileContent = fs.readFileSync(filePath);
//       const params = {
//         Bucket: process.env.WASABI_BUCKET!,
//         Key: fileName,
//         Body: fileContent,
//       };
//       await s3.upload(params).promise();
//       return `https://${process.env.WASABI_BUCKET}.s3.${process.env.WASABI_REGION}.wasabisys.com/${fileName}`;
//     } else {
//       const dest = path.join(process.env.DEV_STORAGE_PATH!, fileName);
//       fs.copyFileSync(filePath, dest)
//       return dest;
//     }
//   }
// }

export class StorageService {
  static async upload(
    filePath: string,
    key: string
  ): Promise<string> {
    if (storageConfig.isProd && s3) {
      const file = fs.readFileSync(filePath);
      await s3
        .upload({
          Bucket: storageConfig.wasabi.bucket,
          Key: key,
          Body: file,
          ACL: "public-read"
        })
        .promise();

      return `${storageConfig.wasabi.endpoint}/${storageConfig.wasabi.bucket}/${key}`;
    }

    const dest = path.join(storageConfig.localPath, key);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(filePath, dest);

    return dest;
  }
}