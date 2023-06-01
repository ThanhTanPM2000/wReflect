import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
console.log('envFile: ' + envFile);
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
