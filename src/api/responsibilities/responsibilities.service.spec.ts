import { Test, TestingModule } from '@nestjs/testing';
import { ResponsibilitiesService } from './responsibilities.service';

describe('ResponsibilitiesService', () => {
  let service: ResponsibilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsibilitiesService],
    }).compile();

    service = module.get<ResponsibilitiesService>(ResponsibilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
