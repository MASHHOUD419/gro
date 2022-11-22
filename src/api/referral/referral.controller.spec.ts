import { Test, TestingModule } from '@nestjs/testing';
import { referralController } from './referral.controller';
import { referralService } from './referral.service';

describe('FeedbacksController', () => {
  let controller: referralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [referralController],
      providers: [referralService],
    }).compile();

    controller = module.get<referralController>(referralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
