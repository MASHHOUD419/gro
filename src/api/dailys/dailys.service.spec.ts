import { Test, TestingModule } from '@nestjs/testing';
import { DailysService } from './dailys.service';

describe('DailysService', () => {
  let service: DailysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailysService],
    }).compile();

    service = module.get<DailysService>(DailysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
