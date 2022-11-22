import { Test, TestingModule } from '@nestjs/testing';
import { ResponsibilitiesController } from './responsibilities.controller';
import { ResponsibilitiesService } from './responsibilities.service';

describe('ResponsibilitiesController', () => {
  let controller: ResponsibilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsibilitiesController],
      providers: [ResponsibilitiesService],
    }).compile();

    controller = module.get<ResponsibilitiesController>(ResponsibilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
