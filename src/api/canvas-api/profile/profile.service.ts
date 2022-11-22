import { Injectable } from '@nestjs/common';
import { CanvaseService } from 'src/shared/services/canvas.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  route: string;
  filterParamStr: string;
  constructor(
    private readonly canvasService: CanvaseService
  ) {
    this.route = 'users';
    this.filterParamStr = '';
  }
  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  async userProfile() {
    this.filterParamStr = 'self/profile';
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }

  async otherProfile(id: number) {
    this.filterParamStr = `${id}/profile`;
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }
}
