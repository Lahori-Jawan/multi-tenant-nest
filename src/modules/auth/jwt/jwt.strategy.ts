import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { DEFAULT_TENANT } from '@src/app/common/constants/app';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_TOKEN_KEY'),
    });
  }

  async validate(request: Request, jwtPayload) {
    const { aud } = jwtPayload;
    const tenant = request.params?.tenant ?? DEFAULT_TENANT;
    console.log({ jwtPayload });
    console.log({ params: request.params });
    console.log('strategy', { tenant, aud }, !aud.includes(tenant));
    // Todo:: talk to Brian
    // const contextId = ContextIdFactory.getByRequest(request);

    if (!aud.includes(tenant)) {
      throw new UnauthorizedException();
    }
    // const authService: AuthService = await this.moduleRef.resolve(
    //   AuthService,
    //   contextId,
    // );

    // const user = await authService.getUser(jwtPayload.id);

    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    // return user;
    return jwtPayload;
  }
}
