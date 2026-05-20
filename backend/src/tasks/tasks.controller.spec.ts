import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';

// Recreamos la interfaz localmente para tipar el mock
interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string };
}

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Mock del Request que inyecta Passport-JWT
  const mockRequest = {
    user: { userId: 'user-123', email: 'test@test.com' },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería delegar al servicio y crear la tarea', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        dueDate: '2026-05-20T23:59:59Z',
      };
      const expectedTask = { id: '1', ...dto, userId: 'user-123' };

      mockTasksService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(mockRequest, dto);

      // Solución aplicada aquí con jest.spyOn
      expect(jest.spyOn(service, 'create')).toHaveBeenCalledWith(
        'user-123',
        dto,
      );
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAll', () => {
    it('debería delegar al servicio manejando parámetros de paginación', async () => {
      const expectedResponse = {
        data: [],
        meta: { totalItems: 0, currentPage: 1 },
      };
      mockTasksService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(mockRequest, 'pending', '2', '5');

      // Solución aplicada aquí con jest.spyOn
      expect(jest.spyOn(service, 'findAll')).toHaveBeenCalledWith(
        'user-123',
        'pending',
        2,
        5,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('debería usar valores por defecto si no se envían parámetros de paginación', async () => {
      await controller.findAll(mockRequest);

      // Solución aplicada aquí con jest.spyOn
      expect(jest.spyOn(service, 'findAll')).toHaveBeenCalledWith(
        'user-123',
        undefined,
        1,
        10,
      );
    });
  });

  describe('findOne', () => {
    it('debería delegar al servicio buscando por ID y userId', async () => {
      mockTasksService.findOne.mockResolvedValue({ id: 'task-1' });
      await controller.findOne('task-1', mockRequest);

      // Solución aplicada aquí con jest.spyOn
      expect(jest.spyOn(service, 'findOne')).toHaveBeenCalledWith(
        'task-1',
        'user-123',
      );
    });
  });

  describe('update', () => {
    it('debería delegar al servicio para actualizar', async () => {
      const dto: UpdateTaskDto = { status: 'done' };
      mockTasksService.update.mockResolvedValue({
        id: 'task-1',
        status: 'done',
      });

      await controller.update('task-1', mockRequest, dto);

      // Solución aplicada aquí con jest.spyOn
      expect(jest.spyOn(service, 'update')).toHaveBeenCalledWith(
        'task-1',
        'user-123',
        dto,
      );
    });
  });

  describe('remove', () => {
    it('debería delegar al servicio para eliminar', async () => {
      mockTasksService.remove.mockResolvedValue({
        message: 'Tarea eliminada con éxito',
      });
      await controller.remove('task-1', mockRequest);

      // Solución aplicada aquí con jest.spyOn
      expect(jest.spyOn(service, 'remove')).toHaveBeenCalledWith(
        'task-1',
        'user-123',
      );
    });
  });
});
