import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './test-utils/test-helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const testUser = {
    email: 'test@example.com',
    password: 'test123456',
    nickname: 'testuser',
  };
  let authToken: string;

  beforeAll(async () => {
    app = await TestHelper.initApp();
  }, 60000); // 60 second timeout

  afterAll(async () => {
    await TestHelper.cleanup();
  }, 60000); // 60 second timeout

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('token');
          expect(typeof res.body.token).toBe('string');
        });
    });

    it('should fail to register with existing email', () => {
      return request(app.getHttpServer()).post('/api/auth/register').send(testUser).expect(409);
    });

    it('should fail to register with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, email: 'invalid-email' })
        .expect(400);
    });

    it('should fail to register with short password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, password: '12345' })
        .expect(400);
    });

    it('should fail to register with short nickname', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, nickname: 'ab' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      authToken = response.body.token;
    });

    it('should fail to login with wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail to login with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(401);
    });

    it('should fail to login with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: testUser.password,
        })
        .expect(400);
    });
  });
});
