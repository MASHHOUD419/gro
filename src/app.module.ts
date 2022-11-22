import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ExceptionsFilter } from './shared/exceptions.filter';
import { HttpModule } from "@nestjs/axios";
import moment from 'moment';
// @App
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CalendarsModule } from './api/calendars/calendars.module';
import { CoursesModule } from './api/canvas-api/courses/courses.module';
import { ProfileModule } from './api/canvas-api/profile/profile.module';
import { FoldersModule } from './api/folders/folders.module';
import { ResponsibilitiesModule } from './api/responsibilities/responsibilities.module';
import { TasksModule } from './api/tasks/tasks.module';
import { EventsModule } from './api/events/events.module';
import { referralModule } from './api/referral/referral.module';


@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
      port: +process.env.DB_PORT,
      username: process.env.NODE_ENV === 'production' ? process.env.DB_USERNAME : 'root',
      password: process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : '',
      database: process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE : 'gro_db_dev',
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true
    }),
    HttpModule,
    SharedModule,
    AuthModule,
    UsersModule,
    CalendarsModule,
    CoursesModule,
    ProfileModule,
    FoldersModule,
    ResponsibilitiesModule,
    TasksModule,
    EventsModule,
    referralModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: 'MomentWrapper',
      useValue: moment
    },
  ],
  exports: [
 
  ]
})
export class AppModule {
  constructor() {}
}
