import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock estricto del servicio
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debería llamar a authService.register y retornar el resultado', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: 'pass',
        name: 'Test',
      };
      const expectedResult = {
        message: 'Usuario registrado con éxito',
        userId: '123',
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(jest.spyOn(authService, 'register')).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('debería llamar a authService.login y retornar el token', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: 'pass' };
      const expectedResult = {
        access_token: 'jwt-token',
        user: { id: '1', name: 'Test', email: 'test@test.com' },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(jest.spyOn(authService, 'login')).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
