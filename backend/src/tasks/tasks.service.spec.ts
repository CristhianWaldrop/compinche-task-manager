import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { PrismaServiceMock } from '../__mocks__/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prismaMock: PrismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useClass: PrismaServiceMock }, // Inyectamos el mock
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaMock = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tasks for a specific user', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task', userId: 'user-123' }];

      // Simulamos las respuestas en paralelo de findMany y count
      prismaMock.task.findMany.mockResolvedValue(mockTasks);
      prismaMock.task.count.mockResolvedValue(1);

      const result = await service.findAll('user-123', undefined, 1, 10);

      expect(result.data).toEqual(mockTasks);
      expect(result.meta.totalItems).toBe(1);
      expect(prismaMock.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if task does not exist or belongs to another user', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);

      await expect(service.findOne('task-999', 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
