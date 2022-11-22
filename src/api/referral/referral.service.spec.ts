import { Test, TestingModule } from '@nestjs/testing';
import { referralService } from './referral.service';

describe('referralService', () => {
  let service: referralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [referralService],
    }).compile();

    service = module.get<referralService>(referralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
