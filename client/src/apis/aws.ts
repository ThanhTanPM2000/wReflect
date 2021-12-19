import { RcFile } from 'antd/lib/upload';
import ReactS3Client from 'react-aws-s3-typescript';

export const s3Config = {
  bucketName: 'wreflect',
  region: 'us-east-2',
  accessKeyId: 'AKIAYEGOEURTKT7EYXSV',
  secretAccessKey: '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',
};

export const uploadFile = async (file: RcFile) => {
  const s3 = new ReactS3Client(s3Config);
  const filename = file.name; /* Optional */
  try {
    const res = await s3.uploadFile(file, filename);
    return res;
  } catch (exception) {
    throw exception;
  }
};
