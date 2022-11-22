import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
@Injectable()
export class FileService {
  async uploadPublicFile(dataBuffer: Buffer, filename: string, mimetype: string, type='avatar') {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Body: dataBuffer,
          Key: `${type}/${uuid()}-${filename}`,
          ContentType: mimetype
        })
        .promise();

      return  {
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (err) {
      console.log(err);
      return { key: 'error', url: err.message };
    }
  }
}