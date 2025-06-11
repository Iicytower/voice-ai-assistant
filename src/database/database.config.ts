import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017',
  // Connection options following MongoDB driver 4.0+ best practices
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
}));
