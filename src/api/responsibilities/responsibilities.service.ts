import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { startOfMonth, endOfMonth, getMonth } from 'date-fns';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateResponsibilityDto } from './dto/create-responsibility.dto';
import { UpdateResponsibilityDto } from './dto/update-responsibility.dto';
import { Responsibility } from './entities/responsibility.entity';
import { FileService } from 'src/shared/services/file.service';
import { S3BucketFolderType } from 'src/shared/types';
import { responsibilityFolder } from './dto/responsibilityFolder.dto';

@Injectable()
export class ResponsibilitiesService {
  constructor(
    @InjectRepository(Responsibility)
    private responsibilityRepository: Repository<Responsibility>,
    private readonly fileService: FileService
  ) { }

  async create(createResponsibilityDto: CreateResponsibilityDto, file: Express.Multer.File = null) {
    const responsibility = await this.findByName(createResponsibilityDto.name);
    if (responsibility) {
      throw new BadRequestException('Responsibility name is exist');
    }
    if (file) {
      const result = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        S3BucketFolderType.RESPONSIBILITY
      );
      createResponsibilityDto.photo = result.url;
    }
    const _responsibilityRepository = this.responsibilityRepository.create(createResponsibilityDto);
    return this.responsibilityRepository.save(_responsibilityRepository);
  }

  async findAllAndCount(userId: number) {
    return this.responsibilityRepository.findAndCount({ where: { owner_id: userId } });
  }
  async findAll(userId: number) {
    let responsibilities=this.responsibilityRepository.find({ where: { owner_id: userId } });
    return responsibilities
  }
  async findAllCompleted(userId: number) {
    return this.responsibilityRepository.findAndCount({ where: { completed: true, owner_id: userId } });
  }

  async findOne(id: number) {
    const responsibility = await this.responsibilityRepository.findOneBy({ id });
    if (responsibility) return responsibility;
    return null;
  }

  async findByName(name: string) {
    const responsibility = await this.responsibilityRepository.findOneBy({ name });
    if (responsibility) return responsibility;
    return null;
  }

  async update(id: number, updateResponsibilityDto: UpdateResponsibilityDto, file: Express.Multer.File = null) {
    const responsibility = await this.findOne(id);
    if (!responsibility) throw new NotFoundException('Responsibility not found');
    if (file) {
      const result = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        S3BucketFolderType.RESPONSIBILITY
      );
      updateResponsibilityDto.photo = result.url;
    }
    return this.responsibilityRepository.update(id, updateResponsibilityDto);
  }

  async remove(id: number) {
    const responsibility = await this.findOne(id);
    return this.responsibilityRepository.remove(responsibility);
  }

  async getUserMonthlyStatistics(userId: number) {
    const now = new Date();
    const queryBuilder = this.responsibilityRepository.createQueryBuilder();

    const data = await queryBuilder
      .select(
        'sum(case when completed = true then 1 else 0 end) as total_completed_responsibility_count'
      )
      .where('owner_id = :userId', { userId })
      .andWhere('completed_at >= :after', { after: startOfMonth(now) })
      .andWhere('completed_at <= :before', { before: endOfMonth(now) })
      .addGroupBy('DATE_FORMAT(completed_at, "%y-%m-%d")')
      .getRawOne();
    return {
      status: 1,
      message: 'Your monthly responsibility',
      data
    };

  }

  async getUserAllTimeStatistics(userId: number) {
    const now = new Date();
    const queryBuilder = this.responsibilityRepository.createQueryBuilder();

    const data = await queryBuilder
      .select(
        'sum(case when completed = true then 1 else 0 end) as total_completed_responsibility_count'
      )
      .where('owner_id = :userId', { userId })
      .getRawOne();
    return {
      status: 1,
      message: 'Your all time responsibility',
      data
    };

  }

  /**
   * 
   * @param id : Task Id
   */
  async complete(id: number) {
    const responsibility = await this.findOne(id);
    if (!responsibility) throw new NotFoundException('Responsibility not found');
    if (responsibility.completable) {
      responsibility.completed = true;
      responsibility.completed_at = new Date();
      return this.responsibilityRepository.save(responsibility);
    }
    return { status: 0, message: 'not completable' }
  }


  //saoud work start from here
  async responsibilityByFolder(folder_id: number, user_Id: number) {
    try {
      let responsibilities = await this.responsibilityRepository.find({ where: { folder_id: folder_id, owner_id: user_Id } });
      if (responsibilities.length > 0) {
        return responsibilities
      }
      else {
        throw new BadRequestException('no data found');
      }
    } catch (error) {
      throw new BadRequestException('error when getting responsibility '+error.message);
    }

  }

  async responsibilityAndFolder(user_Id: number) {
   
      if(user_Id){
        try {
        let resFolder:responsibilityFolder= new responsibilityFolder()
        let responsibilities = await this.findAll(user_Id)
        if (responsibilities.length > 0) {
          return responsibilities
        }
        else {
          throw new BadRequestException('no data found');
        }
      } catch (error) {
        throw new BadRequestException('error when getting responsibility '+error.message);
      }
      }
     

  }

}
