import { MongoMemoryServer } from 'mongodb-memory-server';

export class TestContainer {
  private static mongoServer: MongoMemoryServer;
  private static isInitialized = false;

  static async start() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Start MongoDB Memory Server
      console.log('Starting MongoDB Memory Server...');
      this.mongoServer = await MongoMemoryServer.create();
      const mongoUri = this.mongoServer.getUri();
      process.env.MONGODB_URI = mongoUri;
      console.log('MongoDB Memory Server started successfully');

      // Mock Weaviate settings
      process.env.WEAVIATE_HOST = 'localhost:8080';
      process.env.WEAVIATE_SCHEME = 'http';

      this.isInitialized = true;
    } catch (error) {
      console.error('Error starting test containers:', error);
      await this.stop();
      throw error;
    }
  }

  static async stop() {
    try {
      if (this.mongoServer) {
        console.log('Stopping MongoDB Memory Server...');
        await this.mongoServer.stop();
        console.log('MongoDB Memory Server stopped successfully');
      }
    } catch (error) {
      console.error('Error stopping test containers:', error);
      throw error;
    } finally {
      this.isInitialized = false;
    }
  }

  static getMongoUri() {
    if (!this.isInitialized || !this.mongoServer) {
      throw new Error('Test containers not initialized');
    }
    return this.mongoServer.getUri();
  }
}
