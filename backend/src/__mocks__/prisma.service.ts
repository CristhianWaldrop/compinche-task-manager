import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaServiceMock {
  user = {
    create: jest.fn(),
    findUnique: jest.fn(),
  };

  task = {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };
}
