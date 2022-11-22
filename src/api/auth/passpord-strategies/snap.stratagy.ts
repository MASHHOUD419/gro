import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-snapchat';


@Injectable()
export class SnapStrategy extends PassportStrategy(Strategy, 'snapchat') {
  constructor() {
    super({
      clientID: '806be913-526e-4938-b9c0-d33d8c4a32f5',
      clientSecret: 'QNNGvG6PBkaMHoHkEAeKlU0yHhnkdDL-6T_RRivy-J0',
      callbackURL: 'https://52.204.203.3/auth/snapchat/callback',
      profileFields: ['id', 'displayName', 'bitmoji'],
      scope: ['user.display_name', 'user.bitmoji.avatar'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile,
    cb,
  ): Promise<any> {
    console.log(profile);
    const user = {
      ...profile,
      accessToken: refreshToken,
      refreshToken: accessToken,
    };
    return user;
  }
}