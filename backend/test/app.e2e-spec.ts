import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // <-- 1. Importamos el servicio JWT
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';

describe('TasksController (E2E)', () => {
  let app: INestApplication;
  let validToken: string; // <-- 2. Variable para guardar nuestro token de prueba

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    // 3. Extraemos JwtService y firmamos un token válido para un usuario ficticio
    const jwtService = app.get<JwtService>(JwtService);
    validToken = jwtService.sign({ sub: 'user-123', email: 'test@test.com' });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/tasks (GET)', () => {
    it('should return 401 Unauthorized if no token provided', async () => {
      // Forzamos el tipado directamente desde el origen para eliminar el 'any' de NestJS
      const server = app.getHttpServer() as Server;

      const response = await request(server).get('/api/tasks').expect(401);

      const body = response.body as { message: string };

      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('/api/tasks (POST)', () => {
    it('should return 400 Bad Request if body payload is missing required titles', async () => {
      // Hacemos lo mismo aquí
      const server = app.getHttpServer() as Server;

      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ description: 'Missing title' })
        .expect(400);
    });
  });
});
