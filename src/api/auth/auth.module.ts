import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local.strategy';
import { JwtRefreshTokenStrategy } from './guards/jwt-refresh-token.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthenticationService } from './google.authentication.service';
import { AppleAuthenticationService } from './apple_authentication.service';
import { TwilioModule } from 'nestjs-twilio';
import { SharedModule } from 'src/shared/shared.module';
import { SnapStrategy } from './passpord-strategies/snap.stratagy';
import { ResponseModel } from 'src/utils/responseModel';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({}),
        PassportModule,
        TwilioModule.forRoot({
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN,
          }),
        SharedModule,
        ResponseModel
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshTokenStrategy,
        GoogleAuthenticationService,
        AppleAuthenticationService,
        SnapStrategy
    ]
})
export class AuthModule { }
