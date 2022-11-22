import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/shared/services/file.service';
import { S3BucketFolderType } from 'src/shared/types';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './entities';
import { FolderReponsibility } from './entities/folder-responsibility.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @InjectRepository(FolderReponsibility)
    private folderResponsibilityRepository: Repository<FolderReponsibility>,
    private readonly fileService: FileService
  ) { }

  async create(createFolderDto: CreateFolderDto, file: Express.Multer.File = null) {
    const folder = await this.findByName(createFolderDto.name);
    if (folder) {
      throw new BadRequestException('Folder name is exist');
    }
    if (file) {
      const result = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        S3BucketFolderType.FOLDER
      );
      createFolderDto.photo = result.url;
    }
    const _folder = this.folderRepository.create(createFolderDto);
    const newFolder = await this.folderRepository.save(_folder);

    const responsibilities = createFolderDto.responsibilities;
    const responsibilitiesArr = responsibilities.map((id) => {

      return this.folderResponsibilityRepository.create({
        folder_id: newFolder.id,
        responsibility_id: id
      });
    });
    await this.folderResponsibilityRepository.save(responsibilitiesArr);
    const data = await this.folderRepository.createQueryBuilder('folder')
      // .leftJoinAndSelect('folder.user', 'user')
      .leftJoinAndSelect('folder.folderResponsibilitiies', 'folderResponsibilitiies')
      .leftJoinAndSelect('folderResponsibilitiies.responsibility', 'responsibility')
      // .select(['folder', 'folderResponsibilitiies', 'responsibility'])
      .select(['folder', 'folderResponsibilitiies', 'responsibility'])
      .where('folder.id = :folderId', { folderId: newFolder.id })
      .getOne();
    let temp = data.folderResponsibilitiies.map((fr) => {
      return fr.responsibility
    });
    return {
      ...newFolder,
      responsibilities: temp
    };
  }

  async findAll(userId: number) {
    return this.folderRepository.findAndCount({ where: { owner_id: userId } });
  }
  async findAllCompleted(userId: number) {
    return this.folderRepository.findAndCount({ where: { completed: true, owner_id: userId } });
  }

  async findOneFolderInfo(id: number) {
    const folder = await this.folderRepository.findOneBy({ id });
    if (!folder) throw new BadRequestException('Folder not found');
    const data = await this.folderRepository.createQueryBuilder('folder')
      // .leftJoinAndSelect('folder.user', 'user')
      .leftJoinAndSelect('folder.folderResponsibilitiies', 'folderResponsibilitiies')
      .leftJoinAndSelect('folderResponsibilitiies.responsibility', 'responsibility')
      // .select(['folder', 'folderResponsibilitiies', 'responsibility'])
      .select(['folder', 'folderResponsibilitiies', 'responsibility'])
      .where('folder.id = :folderId', { folderId: folder.id })
      .getOne();
    let temp = data.folderResponsibilitiies.map((fr) => {
      return fr.responsibility
    });
    return {
      ...folder,
      responsibilities: temp
    };
  }

  async findOne(id: number) {
    const folder = await this.folderRepository.findOneBy({ id });
    if (folder) return folder;
    else return null;
  }

  async findByName(name: string) {
    const folder = await this.folderRepository.findOneBy({ name });
    if (folder) return folder;
    else return null;
  }

  async update(id: number, updateFolderDto: UpdateFolderDto, file: Express.Multer.File = null) {
    const folder = await this.findOne(id);
    if (!folder) throw new NotFoundException('Folder not found');
    if (file) {
      const result = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        S3BucketFolderType.FOLDER
      );
      updateFolderDto.photo = result.url;
    }
    return this.folderRepository.update(id, updateFolderDto);
  }

  async remove(id: number) {
    const folder = await this.findOne(id);
    return this.folderRepository.remove(folder);
  }

  /**
   * 
   * @param id : Task Id
   */
  async complete(id: number) {
    const folder = await this.findOne(id);
    if (!folder) throw new NotFoundException('folder not found');
    if (folder.completable) {
      folder.completed = true;
      folder.completed_at = new Date();
      return this.folderRepository.save(folder);
    }
    return { status: 0, message: 'not completable' }
  }
}
