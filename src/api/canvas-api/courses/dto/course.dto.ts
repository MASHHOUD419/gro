import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

import { AbstractDto } from 'src/shared/dto';
/*
{
    "id": 1261383,
    "name": "Fa19 - US FOREIGN POLICY (62250)",
    "account_id": 99230,
    "uuid": "bSNR1Y7Fi2wNS70toaS8WUiGesfjNTKFEl5cqo0y",
    "start_at": "2019-08-15T05:00:00Z",
    "grading_standard_id": 39014,
    "is_public": false,
    "created_at": "2019-06-03T13:38:10Z",
    "course_code": "UGS 303",
    "default_view": "feed",
    "root_account_id": 97771,
    "enrollment_term_id": 4491,
    "license": "private",
    "grade_passback_setting": null,
    "end_at": "2019-12-31T06:00:00Z",
    "public_syllabus": false,
    "public_syllabus_to_auth": false,
    "storage_quota_mb": 6144,
    "is_public_to_auth_users": false,
    "homeroom_course": false,
    "course_color": null,
    "friendly_name": null,
    "apply_assignment_group_weights": true,
    "calendar": {
      "ics": "https://utexas.instructure.com/feeds/calendars/course_bSNR1Y7Fi2wNS70toaS8WUiGesfjNTKFEl5cqo0y.ics"
    },
    "time_zone": "America/Chicago",
    "blueprint": false,
    "template": false,
    "enrollments": [
      {
        "type": "student",
        "role": "StudentEnrollment",
        "role_id": 6720,
        "user_id": 4285078,
        "enrollment_state": "active",
        "limit_privileges_to_course_section": false
      }
    ],
    "hide_final_grades": false,
    "workflow_state": "available",
    "restrict_enrollments_to_course_dates": false,
    "overridden_course_visibility": ""
  }
*/
export class CourseDto extends AbstractDto {

  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  start_at: Date;

  @ApiProperty()
  grading_standard_id: number;

  @ApiProperty()
  is_public: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  course_code: string;

  @ApiProperty()
  @IsNotEmpty()
  default_view: string;

  @ApiProperty()
  @IsNotEmpty()
  root_account_id: number;

  @ApiProperty()
  @IsNotEmpty()
  enrollment_term_id: number;

  @ApiProperty()
  @IsNotEmpty()
  license: string;

  @ApiPropertyOptional()
  grade_passback_setting: string;

  @ApiPropertyOptional()
  end_at: Date;
  
  @ApiPropertyOptional()
  public_syllabus: boolean;
  
  @ApiPropertyOptional()
  public_syllabus_to_auth: boolean;
  
  @ApiProperty()
  storage_quota_mb: number;
  
  @ApiProperty()
  is_public_to_auth_users: boolean;
  
  @ApiProperty()
  homeroom_course: boolean;
  
  @ApiPropertyOptional()
  course_color: string;
  
  @ApiPropertyOptional()
  friendly_name: string;
  
  @ApiPropertyOptional()
  apply_assignment_group_weights: boolean;
  
  @ApiProperty()
  @IsNotEmpty()
  calendar: any;
  
  @ApiProperty()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty()
  blueprint: boolean;

  @ApiProperty()
  template: boolean;

  @ApiProperty()
  enrollments: any;

  @ApiProperty()
  hide_final_grades: boolean;

  @ApiProperty()
  workflow_state: string;

  @ApiProperty()
  restrict_enrollments_to_course_dates: boolean;

  @ApiProperty()
  overridden_course_visibility: string;


}