import { Exclude, classToPlain } from 'class-transformer';
import { AbstractEntity } from 'src/app/common/baseEntity';
import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import { nanoid } from 'nanoid';
import * as argon2 from 'argon2';
import trycatch from 'src/utils/betterCatch';
import { ServerException } from 'src/app/common/exceptions/server';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'char', length: 21, name: 'unique_id', unique: true })
  uId: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  //   @Index({ unique: true })
  @Column({ nullable: false })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;

  @Column({ name: 'is_email_valid', default: false })
  isEmailValid: boolean;

  @Column({ name: 'is_phone_valid', default: false })
  isPhoneValid: boolean;

  toJSON() {
    return classToPlain(this);
  }

  async validatePassword(password: string) {
    return await argon2.verify(this.password, password);
  }

  @BeforeInsert()
  async addSecureData() {
    this.uId = nanoid();
    const promise = argon2.hash(this.password);
    const [err, hashedPassword] = await trycatch(promise);

    if (err) throw new ServerException();

    this.password = hashedPassword;
  }
}
