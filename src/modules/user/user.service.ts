import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { messages } from 'src/app/common/messages';
import { TENANT_CONNECTION } from 'src/tenant/tenant.provider';
import { ServerException } from 'src/app/common/exceptions/server';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  private readonly userRepository: Repository<User>;
  private readonly conn: Connection;

  constructor(@Inject(TENANT_CONNECTION) connection: Connection) {
    this.userRepository = connection.getRepository(User);
    this.conn = connection;
  }

  async create(createUserDto: CreateUserDto) {
    let user: User;
    try {
      user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Error while saving user ${JSON.stringify(
          createUserDto,
        )} on connection ${this.conn.name}`,
      );
      this.logger.error(JSON.stringify(error, null, 2));
      throw new ServerException();
    }

    return user;
  }

  findAll() {
    this.logger.debug(`connection to fetch users is ${this.conn.name}`);
    return this.userRepository.find();
  }

  async getUser(id: number) {
    this.logger.debug(`connection to 'getUser' is ${this.conn.name}`);
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND);
    }

    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }
}
