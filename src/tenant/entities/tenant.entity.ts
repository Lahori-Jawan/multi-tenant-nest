import { AbstractEntity } from 'src/app/common/baseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity('tenants')
export class Tenant extends AbstractEntity {
  @Index({ unique: true })
  @Column({ name: 'tenant_name', unique: true })
  name: string;

  @Index('tenant_owner')
  @Column()
  username: string;

  @Column()
  password: string;
  // Todo change it to status with check/enum constraint
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
