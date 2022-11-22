import { Module } from '@nestjs/common';
import { DailysService } from './dailys.service';
import { DailysController } from './dailys.controller';

@Module({
  controllers: [DailysController],
  providers: [DailysService]
})
export class DailysModule {}
