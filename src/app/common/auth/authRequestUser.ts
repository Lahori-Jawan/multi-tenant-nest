import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data, req: ExecutionContext): User => {
    // ? extracting user from request object
    return req.switchToHttp().getRequest().user;
  },
);
