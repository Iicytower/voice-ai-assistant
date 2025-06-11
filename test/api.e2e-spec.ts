import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './test-utils/test-helper';

describe('ApiController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testChatId: string;

  beforeAll(async () => {
    app = await TestHelper.initApp();

    // Register and login a test user
    const testUser = {
      email: 'apitest@example.com',
      password: 'test123456',
      nickname: 'apitester',
    };

    // Register the user
    await request(app.getHttpServer()).post('/api/auth/register').send(testUser);

    // Login to get the token
    const loginResponse = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    authToken = loginResponse.body.token;
  }, 60000); // 60 second timeout

  afterAll(async () => {
    await TestHelper.cleanup();
  }, 60000); // 60 second timeout

  // TODO: Commented due to the fact that the prompt endpoint is not testable for now
  // describe('POST /prompt', () => {
  //   it('should fail without authentication', () => {
  //     return request(app.getHttpServer())
  //       .post('/api/prompt')
  //       .send({ prompt: 'Test prompt' })
  //       .expect(401);
  //   });

  //   it('should create a new chat with prompt', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/api/prompt')
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .send({ prompt: 'Test prompt' })
  //       .expect(201);

  //     expect(response.body).toBeDefined();
  //     expect(typeof response.body).toBe('string');
  //   });

  //   it('should add message to existing chat', async () => {
  //     // First, get the list of chats to get a chat ID
  //     const chatsResponse = await request(app.getHttpServer())
  //       .get('/api/chats/findAll')
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200);

  //     testChatId = chatsResponse.body.chats[0]._id;

  //     const response = await request(app.getHttpServer())
  //       .post('/api/prompt')
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .send({
  //         prompt: 'Follow-up prompt',
  //         chatId: testChatId,
  //       })
  //       .expect(201);

  //     expect(response.body).toBeDefined();
  //     expect(typeof response.body).toBe('string');
  //   });
  // });

  describe('GET /chats/findAll', () => {
    it('should fail without authentication', () => {
      return request(app.getHttpServer()).get('/api/chats/findAll').expect(401);
    });

    it('should return list of user chats', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/chats/findAll')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('chats');
      expect(Array.isArray(response.body.chats)).toBe(true);
      expect(response.body.chats.length).toBeGreaterThan(0);
    });
  });

  describe('GET /chats/findOne', () => {
    it('should fail without authentication', () => {
      return request(app.getHttpServer()).get(`/api/chats/findOne?id=${testChatId}`).expect(401);
    });

    it('should return a specific chat', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/chats/findOne?id=${testChatId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', testChatId);
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
    });

    it('should return 404 for non-existent chat', () => {
      return request(app.getHttpServer())
        .get('/api/chats/findOne?id=nonexistentid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('DELETE /chats/delete-messages', () => {
    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/api/chats/delete-messages?chatId=${testChatId}&chatMessageIds=123,456`)
        .expect(401);
    });

    it('should delete specific messages from chat', async () => {
      // First, get the chat to get message IDs
      const chatResponse = await request(app.getHttpServer())
        .get(`/api/chats/findOne?id=${testChatId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const messageIds = chatResponse.body.messages
        .slice(0, 2)
        .map(msg => msg._id)
        .join(',');

      return request(app.getHttpServer())
        .delete(`/api/chats/delete-messages?chatId=${testChatId}&chatMessageIds=${messageIds}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('success', true);
        });
    });
  });

  describe('DELETE /chats/delete', () => {
    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/api/chats/delete?chatId=${testChatId}`)
        .expect(401);
    });

    it('should delete entire chat', () => {
      return request(app.getHttpServer())
        .delete(`/api/chats/delete?chatId=${testChatId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('success', true);
        });
    });

    it('should return 404 for non-existent chat', () => {
      return request(app.getHttpServer())
        .delete(`/api/chats/delete?chatId=${testChatId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
