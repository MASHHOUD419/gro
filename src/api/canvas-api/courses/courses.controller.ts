import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Canvas/Courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService
  ) { }

  // @Post()
  // create(@Body() createCourseDto: CreateCourseDto) {
  //   return this.coursesService.create(createCourseDto);
  // }

  @Get()
  @ApiOperation({
    summary: "User Courses.",
    description: "Get user's all courses."
  })
  @ApiResponse({ status: 200, description: "User's course Data" })
  @ApiResponse({ status: 400, description: "Error" })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get One Course Info.",
    description: "Get One Course data."
  })
  @ApiResponse({ status: 200, description: "User's course Data" })
  @ApiResponse({ status: 400, description: "Error" })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Get(':id/assignments')
  @ApiOperation({
    summary: "Course Assignments.",
    description: "Get all assignment of specific course."
  })
  @ApiResponse({ status: 200, description: "Course Assignment Data" })
  @ApiResponse({ status: 400, description: "Error" })
  findAssignments(@Param('id') id: string) {
    return this.coursesService.findAssignmentsWithCourseId(+id);
  }

  @Get(':course_id/assignments/:assignment_id')
  @ApiOperation({
    summary: "Course Assignments.",
    description: "Get all assignment of specific course."
  })
  @ApiResponse({ status: 200, description: "Course Assignment Data" })
  @ApiResponse({ status: 400, description: "Error" })
  findAssignment(@Param('course_id') id: number, @Param('assignment_id') assignment_id: number) {
    return this.coursesService.findAssignmentWithId(+id, assignment_id);
  }

  @Get(':id/students')
  @ApiOperation({
    summary: "Course students.",
    description: "Get all students of specific course."
  })
  @ApiResponse({ status: 200, description: "Course students Data" })
  @ApiResponse({ status: 400, description: "User not authorized this api" })
  findStudents(@Param('id') id: string) {
    return this.coursesService.findStudentsWithCourseId(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
  //   return this.coursesService.update(+id, updateCourseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.coursesService.remove(+id);
  // }
}
