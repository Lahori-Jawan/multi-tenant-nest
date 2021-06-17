import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DEFAULT_TENANT } from '@src/app/common/constants/app';
import { messages } from 'src/app/common/messages';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto, tenantName: string) {
    const user = await this.userService.create(createUserDto);
    user['accessToken'] = this.createToken({ id: user.id }, [tenantName]);

    return user;
  }

  async loginUser({ email, password }, tenantName: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException(messages.USER_NOT_FOUND);

    const isPasswordMatch = await user.validatePassword(password);

    if (!isPasswordMatch)
      throw new BadRequestException(messages.BAD_LOGIN_REQUEST);

    user['accessToken'] = this.createToken({ id: user.id }, [tenantName]);

    // const [error] = await trycatch(user.save());

    // if (error) throw new ServerException();

    return user;
  }

  getUser(id: number) {
    return this.userService.getUser(id);
  }

  private createToken(payload, audience: string[] = [DEFAULT_TENANT]) {
    return this.jwtService.sign(payload, { audience });
  }
}
