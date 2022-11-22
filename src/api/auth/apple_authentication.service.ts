
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import appleSignin from 'apple-signin-auth';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import verifyAppleToken from "verify-apple-id-token";
import { AuthService } from './auth.service';
import { LoginType } from './auth.dto';

@Injectable()
export class AppleAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    
  }

  async authenticate(token: string) {
    /*
    try {
      const { sub: userAppleId } = await appleSignin.verifyIdToken(token, {
        // Optional Options for further verification - Full list can be found here https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        audience: 'com.company.app', // client id - can also be an array
        nonce: 'NONCE', // nonce // Check this note if coming from React Native AS RN automatically SHA256-hashes the nonce https://github.com/invertase/react-native-apple-authentication#nonce
        // If you want to handle expiration on your own, or if you want the expired tokens decoded
        ignoreExpiration: true, // default is false
      });
    } catch (err) {
      // Token is not verified
      console.error(err);
    }
    */
    // const email = tokenInfo.email;
    // const user = await this.usersService.findByEmail(email);
    // if (!user) {
    //   // new user
    //   return this.registerUser(token, email);
    // } else {
    //   // already registered user
    //   return { status: 1, message: 'success', user };
    // }
    Logger.log(token);
    const jwtClaims = await verifyAppleToken({
      idToken: token,
      clientId: this.configService.get("APPLE_CLIENT_ID"),
    });
    Logger.log(jwtClaims);
    const email = jwtClaims.email;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // new user
      return this.registerUser(token, email);
    } else {
      // already registered user
      const _payload = { email: email, sub: user.id }
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

  async registerUser(token: string, email: string) {
    // const userData = await this.getUserData(token);
    // const name = userData.name;
    
    const user = await this.usersService.createWithSocial(email, 'apple', LoginType.APPLE);
    const _payload = { email: email, sub: user.id }
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
    // const userInfoClient = google.oauth2('v2').userinfo;

    // this.oauthClient.setCredentials({
    //   access_token: token
    // })

    // const userInfoResponse = await userInfoClient.get({
    //   auth: this.oauthClient
    // });

    // return userInfoResponse.data;
  }
}
