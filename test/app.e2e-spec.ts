import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './test-utils/test-helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await TestHelper.initApp();
  });

  afterAll(async () => {
    await TestHelper.cleanup();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/api').expect(404); // Since we haven't defined a root route
  });
});
