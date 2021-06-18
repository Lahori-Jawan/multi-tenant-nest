import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// https://wanago.io/2020/09/21/api-nestjs-refresh-tokens-jwt/

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly configService: ConfigService) {
    // JWT extraction is handled for us
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_TOKEN_KEY'),
      // IMPORTANT: This flag is needed to access the request in the `validate(...)` callback below
      passReqToCallback: true,
    });
  }

  async validate(@Request() req, payload: any) {
    // Payload is guaranteed to be valid, issued token at this point.
    // sub: short for 'subject'; refers to user id.
    // const user = await this.usersService.getUserIfRefreshTokenMatches(payload.sub, req.body.refreshToken);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
}
