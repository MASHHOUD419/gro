
import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { google, Auth } from 'googleapis';
import jwtDecode, { JwtHeader, JwtPayload } from "jwt-decode";
import { AuthService } from './auth.service';
import { LoginType } from './auth.dto';


@Injectable()
export class GoogleAuthenticationService {
  // oauthClient: Auth.OAuth2Client;
  oauthClient: OAuth2Client;
  clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    // private readonly authenticationService: AuthenticationService
  ) {
    
    Logger.log(this.clientID);
    this.oauthClient = new OAuth2Client(this.clientID);
  }

  async authenticate(token: string) {
    Logger.log(`Token === ${token} === Token`);

    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.clientID
    });
    const _payload = ticket.getPayload();
    Logger.log(`Google token = ${_payload} <=>`);
    const userid = _payload['sub'];
    //////
    const payload = jwtDecode<any>(token);
    Logger.log(`payload === ${JSON.stringify(payload)} === payload`);

    if (!payload.email_verified) {
      throw new BadRequestException('User not verified by google');
    }
    // const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = payload.email;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // new user
      return this.registerUser(token, payload);
    } else {
      Logger.log(user);
      // already registered user
      const _payload = { email: payload.email, sub: user.id }
      const { accessToken, refreshToken } = await this.authService.getTokens(_payload);
      Logger.log({ accessToken, refreshToken });
      await this.usersService.setRefreshToken(refreshToken, _payload.sub);
      return {
        access_token: accessToken,
        status: 1,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: process.env.JWT_EXPIRATION_TIME,
        user
      };
    }
  }

  async registerUser(token: string, payload: any) {
    // TODO:
    // const userData = await this.getUserData(token); 
    //

    const name = payload.name;// payload.given_name || 'anonymous_google' + ' ' + payload.family_name || 'user';
    const email = payload.email;
    const user = await this.usersService.createWithSocial(email, name, LoginType.GOOGLE);
    const _payload = { email: payload.email, sub: user.id }
    const { accessToken, refreshToken } = await this.authService.getTokens(_payload);
    Logger.log({ accessToken, refreshToken });
    await this.usersService.setRefreshToken(refreshToken, _payload.sub);
    return {
      access_token: accessToken,
      status: 1,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRATION_TIME,
      user
    };
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    })

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient
    });

    return userInfoResponse.data;
  }

  async getCalendars(token: string) {
    this.oauthClient.setCredentials({
      access_token: token,
    })
    const auth = this.oauthClient;
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    });
  }
}
