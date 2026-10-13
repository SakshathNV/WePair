import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockAppService = {
      getHello: () => 'WePair API is operational',
      getHealth: () => ({
        status: 'healthy',
        platform: 'WePair Automobile Public Service Platform',
        database: { provider: 'MongoDB Atlas', state: 'connected' },
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return operational status', () => {
      expect(appController.getHello()).toBe('WePair API is operational');
    });

    it('should return health status', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('healthy');
      expect(health.database.state).toBe('connected');
    });
  });
});
