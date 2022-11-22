import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Folder } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { FolderReponsibility } from './entities/folder-responsibility.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, FolderReponsibility]),
    SharedModule
  ],
  controllers: [FoldersController],
  providers: [FoldersService]
})
export class FoldersModule {}
