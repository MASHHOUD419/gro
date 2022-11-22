import { Injectable } from '@nestjs/common';
import { CanvaseService } from 'src/shared/services/canvas.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  route: string;
  filterParamStr: string;
  constructor(
    private readonly canvasService: CanvaseService
  ) {
    this.route = 'courses';
    this.filterParamStr = ''
  }
  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
  }

  async findAll() {
    this.filterParamStr = '';
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }

  async findOne(id: number) {
    this.filterParamStr=`${id}`;
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }

  async findAssignmentsWithCourseId(id: number) {
    this.filterParamStr=`${id}/assignments`;
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }

  async findAssignmentWithId(courseId: number, assignmentId: number) {
    this.filterParamStr=`${courseId}/assignments/${assignmentId}`;
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }

  async findStudentsWithCourseId(id: number) {
    this.filterParamStr=`${id}/users`;
    return this.canvasService.getCanvasDataWith(this.route, this.filterParamStr);
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
