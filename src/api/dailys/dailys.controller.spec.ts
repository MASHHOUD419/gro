import { Test, TestingModule } from '@nestjs/testing';
import { DailysController } from './dailys.controller';
import { DailysService } from './dailys.service';

describe('DailysController', () => {
  let controller: DailysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailysController],
      providers: [DailysService],
    }).compile();

    controller = module.get<DailysController>(DailysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
